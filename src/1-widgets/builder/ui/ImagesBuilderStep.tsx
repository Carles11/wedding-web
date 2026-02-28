"use client";

import { useEffect, useState } from "react";
import type { ImageRow, Site } from "@/4-shared/types";
import {
  fetchImagesBySite,
  uploadImageForSite,
  deleteImage,
  getPublicUrlForImage,
  updateImage,
  fetchSectionId,
} from "@/3-entities/images/api";
import Image from "next/image";
import FileUploader from "@/4-shared/ui/fileUploader/FileUploader";
import type { Accept } from "react-dropzone";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
};

const FREE_IMAGE_LIMIT = 2;

export default function ImagesBuilderStep({
  site,
  refresh,
  translations,
}: Props) {
  const [images, setImages] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [heroId, setHeroId] = useState<string | null>(null);
  const [contactId, setContactId] = useState<string | null>(null);

  useEffect(() => {
    if (!site?.id) return;
    fetchImages();
    // eslint-disable-next-line
  }, [site?.id]);

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
        const first = rows[0];
        setAssigning(true);
        await updateImage(first.id, { section: "hero" });
        setAssigning(false);
        const refreshed = await fetchImagesBySite(site.id);
        setImages(refreshed);
      }
    } catch (err: unknown) {
      console.error("Images fetch error:", err);
      setError(
        translations["builder.images.error.fetch"] || "Failed to fetch images.",
      );
    } finally {
      setLoading(false);
    }
  }

  function canUploadMore() {
    return images.length < FREE_IMAGE_LIMIT;
  }

  async function handleFileChange(file: File) {
    if (!site?.id || !site?.subdomain) return;
    if (!file) return;

    if (!canUploadMore()) {
      setError(
        translations["builder.images.error.free_limit"] ||
          "Free limit reached. Upgrade to upload more images.",
      );
      return;
    }

    setUploading(true);
    setError(null);
    try {
      // Determine slot and section
      let slot = "0"; // Always string!
      let section: "hero" | "contact" = "hero";
      if (heroId && !contactId) {
        section = "contact";
        slot = "0";
      } else if (heroId && contactId) {
        setError(
          translations["builder.images.error.free_limit"] ||
            "Free limit reached. Upgrade to upload more images.",
        );
        setUploading(false);
        return;
      }

      // 🔥 Fetch correct sectionId as UUID
      const sectionId = await fetchSectionId(site.id, section);
      if (!sectionId) {
        setError("Failed to find section UUID for " + section);
        setUploading(false);
        return;
      }

      // Now call the upload with a valid sectionId UUID!
      const inserted = await uploadImageForSite(
        site.id,
        file,
        section,
        sectionId,
        site.subdomain,
        slot,
      );
      if (!inserted)
        throw new Error(
          translations["builder.images.error.upload_failed"] ||
            "Failed to upload image",
        );

      await fetchImages();
      refresh();
    } catch (err: unknown) {
      console.error("Upload error:", err);
      setError(
        translations["builder.images.error.upload_failed"] ||
          (err instanceof Error ? err.message : "Failed to upload image"),
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(image: ImageRow) {
    if (assigning || uploading) return;
    setAssigning(true);
    const ok = await deleteImage(image);
    if (!ok) {
      setAssigning(false);
      setError(
        translations["builder.images.error.delete_failed"] ||
          "Failed to delete image",
      );
      return;
    }
    await fetchImages();
    setAssigning(false);
    refresh();
  }

  function publicUrlFor(image: ImageRow): string | null {
    if (!image?.url) return null;
    return getPublicUrlForImage({ url: image.url || "" });
  }

  function renderImageThumb(url: string, alt: string, className?: string) {
    if (!url) {
      return (
        <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
          {translations["builder.images.label.preview_unavailable"] ||
            "Preview unavailable"}
        </div>
      );
    }
    return (
      <Image
        src={url}
        alt={alt}
        width={500}
        height={200}
        className={className ?? "object-cover rounded"}
        unoptimized
      />
    );
  }

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-lg font-medium">
          {translations["builder.images.label.title"] || "Images"}
        </h3>
        <div className="text-sm text-gray-700 mt-1">
          {translations["builder.images.label.intro"] ||
            "You can upload only a Hero image (required) and a Contact image (optional). Only two images are supported."}
        </div>
        <div className="mt-2">
          <FileUploader
            onFile={handleFileChange}
            disabled={!canUploadMore() || uploading || !site?.id || assigning}
            label={
              translations["builder.images.button.upload"] || "Upload image"
            }
            accept={{ "image/*": [] } as Accept}
          />
        </div>
      </div>
      {loading ? (
        <p>
          {translations["builder.images.label.loading"] || "Loading images…"}
        </p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border p-3 rounded">
              <div className="font-medium">
                {translations["builder.images.label.hero"] ||
                  "Hero Image (required)"}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {translations["builder.images.label.hero_help"] ||
                  "Select which image is used as the hero banner."}
              </div>
              {images.length === 0 ? (
                <div className="text-sm text-gray-500">
                  {translations["builder.images.label.no_images"] ||
                    "No images uploaded yet."}
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
                          await updateImage(img.id, { section: "hero" });
                          if (prevHero && prevHero !== img.id) {
                            await updateImage(prevHero, { section: null });
                          }
                          await fetchImages();
                          setAssigning(false);
                          refresh();
                        }}
                      />
                      <div className="flex items-center gap-2">
                        {renderImageThumb(
                          publicUrlFor(img) ?? "",
                          img.id,
                          "w-16 h-10",
                        )}
                        <div className="text-xs text-gray-700">{img.id}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="border p-3 rounded">
              <div className="font-medium">
                {translations["builder.images.label.contact"] ||
                  "Contact Image (optional)"}
              </div>
              <div className="text-sm text-gray-600 mb-2">
                {translations["builder.images.label.contact_help"] ||
                  "Used on the contact section. Can be left empty."}
              </div>
              {images.length === 0 ? (
                <div className="text-sm text-gray-500">
                  {translations["builder.images.label.no_images"] ||
                    "No images uploaded yet."}
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
                        setAssigning(true);
                        const prev = contactId;
                        if (prev) await updateImage(prev, { section: null });
                        await fetchImages();
                        setAssigning(false);
                        refresh();
                      }}
                    />
                    <div className="text-sm">
                      {translations["builder.images.label.no_contact"] ||
                        "No contact image"}
                    </div>
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
                          if (heroId === img.id) return;
                          setAssigning(true);
                          const prev = contactId;
                          await updateImage(img.id, { section: "contact" });
                          if (prev && prev !== img.id)
                            await updateImage(prev, { section: null });
                          await fetchImages();
                          setAssigning(false);
                          refresh();
                        }}
                      />
                      <div className="flex items-center gap-2">
                        {renderImageThumb(
                          publicUrlFor(img) ?? "",
                          img.id,
                          "w-16 h-10",
                        )}
                        <div className="text-xs text-gray-700">{img.id}</div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="border p-2 rounded">
                {renderImageThumb(
                  publicUrlFor(img) ?? "",
                  img.id,
                  "w-full h-32",
                )}
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs text-gray-700">
                    {typeof img.section === "string"
                      ? img.section
                      : (img.section?.type ?? "—")}{" "}
                  </div>
                  <button
                    className="text-xs text-red-600"
                    onClick={() => handleDelete(img)}
                    disabled={assigning || uploading}
                  >
                    {translations["builder.images.button.delete"] || "Delete"}
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
