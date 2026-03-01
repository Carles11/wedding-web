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
import { FREE_IMAGE_LIMIT } from "@/4-shared/config/limits/usage-limits";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
};

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

  // Track current assignments
  const [assignedHero, setAssignedHero] = useState<ImageRow | null>(null);
  const [assignedContact, setAssignedContact] = useState<ImageRow | null>(null);

  // Helper: What is this image's section?
  function imageSection(img: ImageRow): string | null {
    return typeof img.section === "string"
      ? img.section
      : img.section?.type || null;
  }

  useEffect(() => {
    if (site?.id) fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  useEffect(() => {
    setAssignedHero(images.find((img) => imageSection(img) === "hero") || null);
    setAssignedContact(
      images.find((img) => imageSection(img) === "contact") || null,
    );
  }, [images]);

  async function fetchImages() {
    if (!site?.id) return;
    setLoading(true);
    setError(null);

    try {
      const rows = await fetchImagesBySite(site.id);
      setImages(rows);
      // Ensure a hero exists if at least one image present
      if (
        rows.length > 0 &&
        !rows.some((img) => imageSection(img) === "hero")
      ) {
        setAssigning(true);
        await updateImage(rows[0].id, { section: "hero" });
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

  function canUploadMore(): boolean {
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

    // Determine assignment slot
    let assignSection: "hero" | "contact" = "hero";
    if (assignedHero && !assignedContact) assignSection = "contact";
    else if (assignedHero && assignedContact) {
      setError(
        translations["builder.images.error.free_limit"] ||
          "Free limit reached. Upgrade to upload more images.",
      );
      setUploading(false);
      return;
    }

    try {
      // Get section UUID for current assign
      const sectionId = await fetchSectionId(site.id, assignSection);
      if (!sectionId)
        throw new Error("Failed to find section UUID for " + assignSection);

      const inserted = await uploadImageForSite(
        site.id,
        file,
        assignSection,
        sectionId,
        site.subdomain,
        "0",
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

  async function handleAssignment(id: string, section: "hero" | "contact") {
    if (assigning) return;
    setAssigning(true);
    try {
      // Unset this section for all other images
      const others = images.filter(
        (img) => imageSection(img) === section && img.id !== id,
      );
      for (const img of others) {
        await updateImage(img.id, { section: null });
      }
      // Set new assigned image
      await updateImage(id, { section });
      await fetchImages();
      refresh();
    } finally {
      setAssigning(false);
    }
  }

  async function handleUnassignContact() {
    if (assigning) return;
    setAssigning(true);
    try {
      if (assignedContact)
        await updateImage(assignedContact.id, { section: null });
      await fetchImages();
      refresh();
    } catch (err: unknown) {
      setError("Failed to unassign contact image.");
    } finally {
      setAssigning(false);
    }
  }

  async function handleDelete(image: ImageRow) {
    if (assigning || uploading) return;
    setAssigning(true);
    try {
      const ok = await deleteImage(image);
      if (!ok) {
        setError("Failed to delete image");
        console.error("Image deletion failed", image);
        return;
      }
      await fetchImages();
      refresh();
    } finally {
      setAssigning(false);
    }
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

  // Unassigned images for possible assignment
  const unassignedImages = images.filter(
    (img) => !["hero", "contact"].includes(imageSection(img) || ""),
  );

  return (
    <div className="min-w-0">
      <div className="mb-4">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* HERO IMAGE SELECTION */}
            <div className="border p-3 rounded min-w-0">
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
                  {/* Assigned Hero */}
                  {assignedHero && (
                    <label
                      key={assignedHero.id}
                      className="flex items-start sm:items-center gap-2 flex-wrap"
                    >
                      <input
                        type="radio"
                        name="hero-slot"
                        value={assignedHero.id}
                        checked={true}
                        disabled={assigning}
                        onChange={() => {}} // Already assigned
                      />
                      <div className="flex items-start sm:items-center gap-2 flex-wrap">
                        {renderImageThumb(
                          publicUrlFor(assignedHero) ?? "",
                          assignedHero.id,
                          "w-16 h-10",
                        )}
                        <div className="text-xs text-gray-700">
                          {assignedHero.id}
                        </div>
                        <span className="text-xs text-green-600 ml-2">
                          Assigned
                        </span>
                      </div>
                    </label>
                  )}
                  {/* Unassigned images as assignment options */}
                  {unassignedImages.length > 0 &&
                    unassignedImages.map((img) => (
                      <label
                        key={img.id}
                        className="flex items-start sm:items-center gap-2 flex-wrap"
                      >
                        <input
                          type="radio"
                          name="hero-slot"
                          value={img.id}
                          checked={false}
                          disabled={assigning}
                          onChange={() => handleAssignment(img.id, "hero")}
                        />
                        <div className="flex items-start sm:items-center gap-2 flex-wrap">
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

            {/* CONTACT IMAGE SELECTION */}
            <div className="border p-3 rounded min-w-0">
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
                  {/* Unassign contact */}
                  <label className="flex items-start sm:items-center gap-2 flex-wrap">
                    <input
                      type="radio"
                      name="contact-slot"
                      value="none"
                      checked={!assignedContact}
                      disabled={assigning}
                      onChange={handleUnassignContact}
                    />
                    <div className="text-sm">
                      {translations["builder.images.label.no_contact"] ||
                        "No contact image"}
                    </div>
                  </label>
                  {/* Assigned Contact */}
                  {assignedContact && (
                    <label
                      key={assignedContact.id}
                      className="flex items-start sm:items-center gap-2 flex-wrap"
                    >
                      <input
                        type="radio"
                        name="contact-slot"
                        value={assignedContact.id}
                        checked={true}
                        disabled={
                          Boolean(assigning) ||
                          Boolean(
                            assignedHero &&
                            assignedHero.id === assignedContact.id,
                          )
                        }
                        onChange={() => {}} // Already assigned
                      />
                      <div className="flex items-start sm:items-center gap-2 flex-wrap">
                        {renderImageThumb(
                          publicUrlFor(assignedContact) ?? "",
                          assignedContact.id,
                          "w-16 h-10",
                        )}
                        <div className="text-xs text-gray-700">
                          {assignedContact.id}
                        </div>
                        <span className="text-xs text-green-600 ml-2">
                          Assigned
                        </span>
                      </div>
                    </label>
                  )}
                  {/* Unassigned images as assignment options */}
                  {unassignedImages
                    .filter(
                      (img) => !(assignedHero && assignedHero.id === img.id),
                    )
                    .map((img) => (
                      <label
                        key={img.id}
                        className="flex items-start sm:items-center gap-2 flex-wrap"
                      >
                        <input
                          type="radio"
                          name="contact-slot"
                          value={img.id}
                          checked={false}
                          disabled={assigning}
                          onChange={() => handleAssignment(img.id, "contact")}
                        />
                        <div className="flex items-start sm:items-center gap-2 flex-wrap">
                          {renderImageThumb(
                            publicUrlFor(img) ?? "",
                            img.id,
                            "w-16 h-10",
                          )}
                          <div className="text-xs text-gray-700 break-all">
                            {img.id}
                          </div>
                        </div>
                      </label>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* IMAGES THUMBNAIL GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
            {images.map((img) => (
              <div key={img.id} className="border p-2 rounded min-w-0">
                {renderImageThumb(
                  publicUrlFor(img) ?? "",
                  img.id,
                  "w-full h-32",
                )}
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-xs font-semibold text-blue-600">
                    {imageSection(img) === "hero"
                      ? "Hero"
                      : imageSection(img) === "contact"
                        ? "Contact"
                        : "Unassigned"}
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
