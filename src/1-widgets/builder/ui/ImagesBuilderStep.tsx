"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { StepLayout } from "../step-layout";

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
  const uploadRef = useRef<HTMLDivElement | null>(null);

  const [images, setImages] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  // assignments
  const assignedHero = useMemo(
    () => images.find((img) => imageSection(img) === "hero") || null,
    [images],
  );

  const assignedContact = useMemo(
    () => images.find((img) => imageSection(img) === "contact") || null,
    [images],
  );

  function imageSection(img: ImageRow): string | null {
    return typeof img.section === "string"
      ? img.section
      : img.section?.type || null;
  }

  useEffect(() => {
    if (site?.id) fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  async function fetchImages() {
    if (!site?.id) return;
    setLoading(true);
    setError(null);

    try {
      const rows = await fetchImagesBySite(site.id);
      setImages(rows);

      // ensure hero exists
      if (
        rows.length > 0 &&
        !rows.some((img) => imageSection(img) === "hero")
      ) {
        await updateImage(rows[0].id, { section: "hero" });
        const refreshed = await fetchImagesBySite(site.id);
        setImages(refreshed);
      }
    } catch (err) {
      console.error(err);
      setError(
        translations["builder.images.error.fetch"] || "Failed to fetch images.",
      );
    } finally {
      setLoading(false);
    }
  }

  const uploadHint = useMemo(() => {
    if (!assignedHero)
      return (
        translations["builder.images.hint.hero"] || "Upload your Hero image"
      );

    if (!assignedContact)
      return (
        translations["builder.images.hint.contact"] ||
        "Upload your Contact image"
      );

    return (
      translations["builder.images.hint.done"] ||
      "You already uploaded the required images"
    );
  }, [assignedHero, assignedContact, translations]);

  function EmptySlot({ label }: { label: string }) {
    return (
      <div className="h-32 rounded-xl border border-dashed flex items-center justify-center text-sm text-gray-500">
        {label}
      </div>
    );
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
          "Free limit reached.",
      );
      return;
    }

    setUploading(true);
    setError(null);

    let assignSection: "hero" | "contact" = "hero";
    if (assignedHero && !assignedContact) assignSection = "contact";
    else if (assignedHero && assignedContact) {
      setUploading(false);
      return;
    }

    try {
      const sectionId = await fetchSectionId(site.id, assignSection);
      if (!sectionId) throw new Error("Missing section id");

      const inserted = await uploadImageForSite(
        site.id,
        file,
        assignSection,
        sectionId,
        site.subdomain,
        "0",
      );

      if (!inserted) throw new Error("Upload failed");

      await fetchImages();
      refresh();

      // 🔥 scroll back to uploader
      uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      console.error(err);
      setError(
        translations["builder.images.error.upload_failed"] ||
          "Failed to upload image",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleAssignment(id: string, section: "hero" | "contact") {
    if (assigning) return;
    setAssigning(true);

    try {
      const others = images.filter(
        (img) => imageSection(img) === section && img.id !== id,
      );

      for (const img of others) {
        await updateImage(img.id, { section: null });
      }

      await updateImage(id, { section });
      await fetchImages();
      refresh();
    } finally {
      setAssigning(false);
    }
  }

  async function handleDelete(image: ImageRow) {
    if (assigning || uploading) return;

    setAssigning(true);
    try {
      const ok = await deleteImage(image);
      if (!ok) throw new Error("Delete failed");

      await fetchImages();
      refresh();
    } catch (err) {
      setError("Failed to delete image");
    } finally {
      setAssigning(false);
    }
  }

  function publicUrlFor(image: ImageRow): string | null {
    if (!image?.url) return null;
    return getPublicUrlForImage({ url: image.url || "" });
  }

  function ImageCard({
    img,
    selected,
    label,
    onSelect,
    onDelete,
  }: {
    img: ImageRow;
    selected?: boolean;
    label?: string;
    onSelect?: () => void;
    onDelete?: () => void;
  }) {
    const url = publicUrlFor(img);

    return (
      <div className="relative group">
        {/* SELECT BUTTON */}
        <button
          type="button"
          onClick={onSelect}
          disabled={assigning}
          className={`w-full relative rounded-xl border overflow-hidden transition
          ${
            selected
              ? "ring-2 ring-green-600 border-green-600"
              : "hover:border-gray-400"
          }
        `}
        >
          {url ? (
            <Image
              src={url}
              alt={img.id}
              width={500}
              height={300}
              className="w-full h-32 object-cover"
              unoptimized
            />
          ) : (
            <div className="h-32 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
              Preview unavailable
            </div>
          )}

          {label && (
            <div className="absolute top-2 left-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded">
              {label}
            </div>
          )}
        </button>

        {/* 🗑 DELETE BADGE */}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={assigning || uploading}
            className="
            absolute top-2 right-2
            h-7 w-7 rounded-full
            bg-white/95 border shadow-sm
            flex items-center justify-center
            text-red-600 text-sm font-bold
            hover:bg-white
            md:opacity-0 md:group-hover:opacity-100
            transition
          "
            aria-label="Delete image"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <StepLayout nextLabel="Save" backLabel="Cancel">
      <div className="space-y-6 min-w-0">
        {/* HEADER */}
        <div>
          <h3 className="text-lg font-medium">
            {translations["builder.images.label.title"] || "Images"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {translations["builder.images.label.intro"] ||
              "Upload and assign your images."}
          </p>
        </div>

        {/* UPLOADER */}
        <div ref={uploadRef} className="space-y-2">
          <p className="text-sm text-gray-600">{uploadHint}</p>

          <FileUploader
            onFile={handleFileChange}
            disabled={
              !canUploadMore() ||
              uploading ||
              assigning ||
              !site?.id ||
              (!!assignedHero && !!assignedContact)
            }
            label={
              translations["builder.images.button.upload"] || "Upload image"
            }
            accept={{ "image/*": [] } as Accept}
          />
        </div>

        {/* STATES */}
        {loading && (
          <p>{translations["builder.images.label.loading"] || "Loading…"}</p>
        )}

        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && images.length > 0 && (
          <>
            {/* HERO */}
            <div>
              <div className="font-medium mb-2">
                {translations["builder.images.label.hero"] ||
                  "Hero Image (required)"}
              </div>

              {assignedHero ? (
                <ImageCard
                  img={assignedHero}
                  selected
                  label="Hero"
                  onDelete={() => handleDelete(assignedHero)}
                />
              ) : (
                <EmptySlot label="No hero image yet" />
              )}
            </div>

            {/* CONTACT */}
            <div>
              <div className="font-medium mb-2">
                {translations["builder.images.label.contact"] ||
                  "Contact Image (optional)"}
              </div>

              {assignedContact ? (
                <ImageCard
                  img={assignedContact}
                  selected
                  label="Contact"
                  onDelete={() => handleDelete(assignedContact)}
                />
              ) : (
                <EmptySlot label="No contact image yet" />
              )}
            </div>
          </>
        )}
      </div>
    </StepLayout>
  );
}
