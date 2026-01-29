"use client";

import React, { useEffect, useState } from "react";
import type { ImageRow, Site } from "@/4-shared/types";
import {
  fetchImagesBySite,
  uploadImageForSite,
  deleteImage,
  getPublicUrlForImage,
  updateImage,
} from "@/3-entities/images/api";

type Props = {
  site: Site | null;
  refresh: () => void;
};

const FREE_IMAGE_LIMIT = 2;

export default function ImagesBuilderStep({ site, refresh }: Props) {
  const [images, setImages] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // slot assignments held locally for quick UI updates
  const [heroId, setHeroId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);

  // Stub plan check; replace with real billing logic later
  const isProUser = false;

  useEffect(() => {
    if (!site?.id) return;
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  // keep local slot state in sync when images change
  useEffect(() => {
    const hero = images.find((i) => i.section === "hero");
    const contact = images.find((i) => i.section === "contact");
    setHeroId(hero?.id ?? null);
    setContactId(contact?.id ?? null);
  }, [images]);

  async function fetchImages() {
    if (!site?.id) return;
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchImagesBySite(site.id);
      setImages(rows);
      // ensure a hero exists if there's at least one image
      if (rows.length > 0 && !rows.find((r) => r.section === "hero")) {
        // auto-assign first image as hero to satisfy requirement
        const first = rows[0];
        // best-effort update; don't block UI long-term
        setAssigning(true);
        const updated = await updateImage(first.id, { section: "hero" });
        setAssigning(false);
        if (updated) {
          // refresh to pick up the persisted change
          const refreshed = await fetchImagesBySite(site.id);
          setImages(refreshed);
        }
      }
    } catch (err: unknown) {
      console.error("Images fetch error:", err);
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setLoading(false);
    }
  }

  function canUploadMore() {
    return images.length < FREE_IMAGE_LIMIT;
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (!site?.id) return;
    const file = e.target.files?.[0];
    if (!file) return;

    if (!canUploadMore()) {
      setError("Free limit reached. Upgrade to upload more images.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const inserted = await uploadImageForSite(site.id, file);
      if (!inserted) throw new Error("Failed to upload image");

      // Refresh local list and parent site data
      await fetchImages();
      refresh();
    } catch (err: unknown) {
      console.error("Upload error:", err);
      if (err instanceof Error) setError(err.message);
      else setError(String(err));
    } finally {
      setUploading(false);
      // Clear file input value
      (e.target as HTMLInputElement).value = "";
    }
  }

  async function handleDelete(image: ImageRow) {
    // prevent concurrent modifications
    if (assigning || uploading) return;
    setAssigning(true);
    const ok = await deleteImage(image);
    if (!ok) {
      setAssigning(false);
      setError("Failed to delete image");
      return;
    }

    // After delete, refresh. Ensure a hero exists if images remain.
    await fetchImages();
    setAssigning(false);
    refresh();
  }

  function publicUrlFor(image: ImageRow) {
    return getPublicUrlForImage(image);
  }

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-lg font-medium">Images</h3>
        <div className="text-sm text-gray-700 mt-1">
          You can upload only a Hero image (required) and a Contact image
          (optional). Only two images are supported.
        </div>

        <div className="mt-2">
          <label
            className={`inline-flex items-center gap-2 ${!canUploadMore() ? "opacity-50" : ""}`}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              disabled={!canUploadMore() || uploading || !site?.id || assigning}
            />
            <span className="text-sm ml-2">Upload image</span>
          </label>
        </div>
      </div>

      {loading ? (
        <p>Loading images…</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          {/* Slot assignment controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-3 rounded">
              <div className="font-medium">Hero Image (required)</div>
              <div className="text-sm text-gray-600 mb-2">
                Select which image is used as the hero banner.
              </div>
              {images.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No images uploaded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {images.map((img) => (
                    <label key={img.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="hero-slot"
                        value={img.id}
                        checked={heroId === img.id}
                        disabled={assigning}
                        onChange={async () => {
                          if (assigning || heroId === img.id) return;
                          setAssigning(true);
                          const prevHero = heroId;
                          // assign new hero
                          const updated = await updateImage(img.id, {
                            section: "hero",
                          });
                          // clear previous hero if different
                          if (prevHero && prevHero !== img.id) {
                            await updateImage(prevHero, { section: null });
                          }
                          // refresh list
                          await fetchImages();
                          setAssigning(false);
                          refresh();
                        }}
                      />
                      <div className="flex items-center gap-2">
                        {publicUrlFor(img) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={publicUrlFor(img) ?? undefined}
                            alt={img.id}
                            className="w-16 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-gray-100 rounded" />
                        )}
                        <div className="text-xs text-gray-700">{img.id}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border p-3 rounded">
              <div className="font-medium">Contact Image (optional)</div>
              <div className="text-sm text-gray-600 mb-2">
                Used on the contact section. Can be left empty.
              </div>
              {images.length === 0 ? (
                <div className="text-sm text-gray-500">
                  No images uploaded yet.
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="contact-slot"
                      value="none"
                      checked={contactId === null}
                      disabled={assigning}
                      onChange={async () => {
                        if (assigning) return;
                        // clear previous contact
                        setAssigning(true);
                        const prev = contactId;
                        if (prev) await updateImage(prev, { section: null });
                        await fetchImages();
                        setAssigning(false);
                        refresh();
                      }}
                    />
                    <div className="text-sm">No contact image</div>
                  </label>

                  {images.map((img) => (
                    <label key={img.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="contact-slot"
                        value={img.id}
                        checked={contactId === img.id}
                        disabled={assigning || heroId === img.id}
                        onChange={async () => {
                          if (assigning || contactId === img.id) return;
                          // cannot assign contact equal to hero — UI prevents it but guard here too
                          if (heroId === img.id) return;
                          setAssigning(true);
                          const prev = contactId;
                          // assign contact to this image
                          await updateImage(img.id, { section: "contact" });
                          // clear previous contact
                          if (prev && prev !== img.id)
                            await updateImage(prev, { section: null });
                          await fetchImages();
                          setAssigning(false);
                          refresh();
                        }}
                      />
                      <div className="flex items-center gap-2">
                        {publicUrlFor(img) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={publicUrlFor(img) ?? undefined}
                            alt={img.id}
                            className="w-16 h-10 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-10 bg-gray-100 rounded" />
                        )}
                        <div className="text-xs text-gray-700">{img.id}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails with delete action */}
          <div className="grid grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="border p-2 rounded">
                {publicUrlFor(img) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={publicUrlFor(img) ?? undefined}
                    alt={img.id}
                    className="w-full h-32 object-cover"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                    Preview unavailable
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-700">
                    {img.section ?? "—"}
                  </div>
                  <button
                    className="text-xs text-red-600"
                    onClick={() => handleDelete(img)}
                    disabled={assigning || uploading}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
