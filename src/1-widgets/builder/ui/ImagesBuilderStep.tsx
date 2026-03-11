"use client";

import {
  deleteImage,
  fetchImagesBySite,
  fetchSectionId,
  getPublicUrlForImage,
  updateImage,
  uploadImageForSite,
} from "@/3-entities/images/api";
import { FREE_IMAGE_LIMIT } from "@/4-shared/config/limits/usage-limits";
import { notify } from "@/4-shared/lib/toast/toast";
import type { ImageRow, Site } from "@/4-shared/types";
import FileUploader from "@/4-shared/ui/builder/FileUploader";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Accept } from "react-dropzone";
import { StepLayout } from "../step-layout";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  setHeroImageExists?: (exists: boolean) => void;
};

export default function ImagesBuilderStep({
  site,
  refresh,
  translations,
  setHeroImageExists,
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

  useEffect(() => {
    if (setHeroImageExists) {
      setHeroImageExists(!!assignedHero);
    }
  }, [assignedHero, setHeroImageExists]);

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
      notify.error(translations["builder.images.error.fetch"]);
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
      notify.error(translations["builder.images.error.free_limit"]);

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

      // 🔥 optimistic add
      setImages((prev) => [...prev, inserted]);

      await fetchImages(); // keep for safety
      refresh();

      // 🔥 scroll back to uploader
      uploadRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      notify.error(translations["builder.images.error.upload_failed"]);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(image: ImageRow) {
    if (assigning || uploading) return;

    setAssigning(true);

    // 🔥 optimistic update FIRST
    setImages((prev) => prev.filter((img) => img.id !== image.id));

    try {
      const ok = await deleteImage(image);
      if (!ok) {
        // rollback if failed
        await fetchImages();
        notify.error(translations["builder.images.error.delete_failed"]);
        return;
      }

      refresh();
    } catch (err) {
      await fetchImages();
      notify.error(translations["builder.images.error.delete_failed"]);
    } finally {
      setAssigning(false);
    }
  }

  function publicUrlFor(image: ImageRow): string | null {
    if (!image?.url) return null;
    const base = getPublicUrlForImage({ url: image.url });
    if (!base) return null;

    // Only use a **stable** cache-buster, never Date.now() here!
    const cacheBuster =
      typeof image.created_at === "string"
        ? image.created_at
        : image.id || "missing";

    return `${base}?t=${cacheBuster}`;
  }

  function ImageCard({
    img,
    label,
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
      <div className="relative group w-full md:max-w-md">
        <div className="border rounded-lg hover:ring-2 hover:ring-blue-500 transition">
          {url ? (
            <Image
              src={url}
              alt={label ?? "uploaded image"}
              key={img.id} // 🔥 IMPORTANT for React reconciliation
              width={500}
              height={300}
              className="w-full h-48 md:h-56 object-cover rounded-lg"
              unoptimized
            />
          ) : (
            <div className="h-48 md:h-56 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
              {translations["builder.images.label.preview_unavailable"] ||
                "No preview available"}
            </div>
          )}

          {label && (
            <div className="absolute top-0 left-2 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded">
              {label}
            </div>
          )}
        </div>

        {/* 🗑 DELETE BADGE */}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={assigning || uploading}
            className="absolute top-0 right-2 cursor-pointer mt-2 p-2 h-6 w-6 bg-white rounded-md border shadow-sm flex items-center justify-center text-red-600 text-sm font-bold hover:bg-white md:opacity-0 md:group-hover:opacity-100 transition "
            aria-label="Delete image"
          >
            ×
          </button>
        )}
      </div>
    );
  }

  return (
    <StepLayout nextLabel="Save" backLabel="Cancel" translations={translations}>
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
            className="h-48"
            translations={translations}
          />
        </div>

        {/* STATES */}
        {loading && (
          <p>{translations["builder.images.label.loading"] || "Loading…"}</p>
        )}

        {!loading && !error && images.length > 0 && (
          <div className="flex flex-col gap-8">
            {/* HERO */}
            <div>
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
          </div>
        )}
      </div>
    </StepLayout>
  );
}
