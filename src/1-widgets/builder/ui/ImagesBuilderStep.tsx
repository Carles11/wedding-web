"use client";

import {
  deleteImage,
  fetchImagesBySite,
  fetchSectionId,
  getPublicUrlForImage,
  updateImage,
  uploadImageForSite,
} from "@/3-entities/images/api";
import { getPlanLimit } from "@/4-shared/helpers/billing/entitlements";
import { notify } from "@/4-shared/lib/toast/toast";
import type { ImageRow, PlanType, Site } from "@/4-shared/types";
import FileUploader from "@/4-shared/ui/builder/FileUploader";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { Accept } from "react-dropzone";
import { StepLayout } from "../step-layout";

type ImageSlot = "hero" | "contact";

// ─── Module-level helpers (no component state deps) ───────────────────────────

function imageSection(img: ImageRow): string | null {
  return typeof img.section === "string"
    ? img.section
    : ((img.section as { type?: string } | null)?.type ?? null);
}

function imageCreatedAtValue(img: ImageRow): number {
  if (!img.created_at) return 0;
  const ts = Date.parse(img.created_at);
  return Number.isNaN(ts) ? 0 : ts;
}

function sortImagesNewestFirst(rows: ImageRow[]): ImageRow[] {
  return [...rows].sort((a, b) => {
    const byCreatedAt = imageCreatedAtValue(b) - imageCreatedAtValue(a);
    if (byCreatedAt !== 0) return byCreatedAt;
    return String(b.id).localeCompare(String(a.id));
  });
}

/** Keep only newest hero/contact image in front to avoid stale slot rendering. */
function normalizeImages(rows: ImageRow[]): ImageRow[] {
  const sorted = sortImagesNewestFirst(rows);
  const hero = sorted.find((img) => imageSection(img) === "hero") ?? null;
  const contact = sorted.find((img) => imageSection(img) === "contact") ?? null;

  const visibleIds = new Set<string>();
  if (hero?.id) visibleIds.add(hero.id);
  if (contact?.id) visibleIds.add(contact.id);

  const remainder = sorted.filter((img) => !visibleIds.has(img.id));
  return [...(hero ? [hero] : []), ...(contact ? [contact] : []), ...remainder];
}

function publicUrlFor(image: ImageRow): string | null {
  if (!image?.url) return null;
  const base = getPublicUrlForImage({ url: image.url });
  if (!base) return null;
  // Stable cache-buster — never use Date.now() here
  const cacheBuster =
    typeof image.created_at === "string"
      ? image.created_at
      : image.id || "missing";
  return `${base}?t=${cacheBuster}`;
}

function EmptySlot({ label }: { label: string }) {
  return (
    <div className="h-40 rounded-xl border border-dashed flex items-center justify-center text-sm text-gray-500 bg-gray-50">
      {label}
    </div>
  );
}

function ImageCard({
  img,
  label,
  assigning,
  uploading,
  translations,
  onDelete,
  vertical,
}: {
  img: ImageRow;
  label?: string;
  assigning: boolean;
  uploading: boolean;
  translations: Record<string, string>;
  onDelete?: () => void;
  vertical?: boolean;
}) {
  const url = publicUrlFor(img);
  const imgClass = vertical
    ? "w-full aspect-[3/4] object-cover rounded-lg"
    : "w-full h-48 md:h-56 object-cover rounded-lg";
  const fallbackClass = vertical
    ? "aspect-[3/4] bg-gray-100 flex items-center justify-center text-xs text-gray-500"
    : "h-48 md:h-56 bg-gray-100 flex items-center justify-center text-xs text-gray-500";

  return (
    <div className="relative group w-full md:max-w-md">
      <div className="border rounded-lg hover:ring-2 hover:ring-blue-500 transition">
        {url ? (
          <Image
            src={url}
            alt={label ?? "uploaded image"}
            key={img.id}
            width={500}
            height={vertical ? 667 : 300}
            className={imgClass}
            unoptimized
          />
        ) : (
          <div className={fallbackClass}>
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

      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={assigning || uploading}
          className="absolute top-0 right-2 cursor-pointer mt-2 p-2 h-6 w-6 bg-white rounded-md border shadow-sm flex items-center justify-center text-red-600 text-sm font-bold hover:bg-white md:opacity-0 md:group-hover:opacity-100 transition"
          aria-label="Delete image"
        >
          ×
        </button>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  setHeroImageExists?: (exists: boolean) => void;
  planType: PlanType;
};

export default function ImagesBuilderStep({
  site,
  refresh,
  translations,
  setHeroImageExists,
  planType,
}: Props) {
  const imageLimit = getPlanLimit(planType, "images");

  const [images, setImages] = useState<ImageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadingSlot, setUploadingSlot] = useState<ImageSlot | null>(null);
  const [assigning, setAssigning] = useState(false);
  const [uploaderResetKeys, setUploaderResetKeys] = useState({
    hero: 0,
    contact: 0,
  });

  // assignments
  const assignedHero = useMemo(
    () => images.find((img) => imageSection(img) === "hero") || null,
    [images],
  );

  const assignedContact = useMemo(
    () => images.find((img) => imageSection(img) === "contact") || null,
    [images],
  );

  const isBusy = assigning || uploadingSlot !== null;

  useEffect(() => {
    setHeroImageExists?.(!!assignedHero);
  }, [assignedHero, setHeroImageExists]);

  useEffect(() => {
    if (!site?.id) {
      setLoading(false);
      return;
    }
    fetchImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  async function fetchImages() {
    if (!site?.id) return;
    setLoading(true);
    setError(null);

    try {
      const rows = await fetchImagesBySite(site.id);
      const normalized = normalizeImages(rows);
      setImages(normalized);

      // ensure hero exists
      if (
        rows.length > 0 &&
        !rows.some((img) => imageSection(img) === "hero")
      ) {
        const heroSectionId = await fetchSectionId(site.id, "hero");
        if (!heroSectionId) {
          throw new Error(
            translations["builder.images.error.missing_section"] ||
              "Unable to prepare the hero image section.",
          );
        }

        const newestRow = sortImagesNewestFirst(rows)[0];
        await updateImage(newestRow.id, { sectionId: heroSectionId });
        const refreshed = await fetchImagesBySite(site.id);
        setImages(normalizeImages(refreshed));
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : translations["builder.images.error.fetch"] ||
            "Failed to load images.";
      setError(message);
      notify.error(message);
    } finally {
      setLoading(false);
    }
  }

  function canUploadToSlot(slot: ImageSlot): boolean {
    if (imageLimit === -1) return true;

    const usedSlots = Number(!!assignedHero) + Number(!!assignedContact);
    const slotAlreadyFilled =
      slot === "hero" ? !!assignedHero : !!assignedContact;

    // Replacing an already-filled slot should remain allowed.
    if (slotAlreadyFilled) return true;

    return usedSlots < imageLimit;
  }

  function bumpUploaderResetKey(slot: ImageSlot) {
    setUploaderResetKeys((prev) => ({
      ...prev,
      [slot]: prev[slot] + 1,
    }));
  }

  async function handleFileChange(file: File, slot: ImageSlot) {
    if (!file) return;

    if (!site?.id) {
      const message =
        translations["builder.images.error.site_missing"] ||
        "The site is not ready yet. Please reload and try again.";
      setError(message);
      notify.error(message);
      bumpUploaderResetKey(slot);
      return;
    }

    if (!site.subdomain) {
      const message =
        translations["builder.images.error.subdomain_required"] ||
        "Save your subdomain in the General step before uploading images.";
      setError(message);
      notify.error(message);
      bumpUploaderResetKey(slot);
      return;
    }

    if (!canUploadToSlot(slot)) {
      const message =
        translations["builder.images.error.free_limit"] ||
        "You reached the image limit for your plan.";
      setError(message);
      notify.error(message);
      bumpUploaderResetKey(slot);
      return;
    }

    setUploadingSlot(slot);
    setError(null);

    try {
      const existingInSlot = slot === "hero" ? assignedHero : assignedContact;
      const sectionId = await fetchSectionId(site.id, slot);
      if (!sectionId) {
        throw new Error(
          translations["builder.images.error.missing_section"] ||
            "Unable to prepare the image section.",
        );
      }

      const inserted = await uploadImageForSite(
        site.id,
        file,
        slot,
        sectionId,
        site.subdomain,
        "0",
      );

      if (!inserted) throw new Error("Upload failed");

      // uploadImageForSite returns a plain DB row without a section join.
      // Attach section.type so normalizeImages can immediately classify this
      // image as hero/contact without needing a round-trip re-fetch.
      const insertedWithSection: ImageRow = {
        ...inserted,
        section: { type: slot },
      };

      setImages((prev) =>
        normalizeImages([
          ...prev.filter((img) => img.id !== existingInSlot?.id),
          insertedWithSection,
        ]),
      );

      // Keep DB clean: remove the replaced image row after successful upload.
      if (existingInSlot?.id) {
        const removed = await deleteImage(existingInSlot);
        if (!removed) {
          notify.error(
            translations["builder.images.error.replace_cleanup"] ||
              "The previous image could not be removed automatically.",
          );
        }
      }
      // No redundant re-fetch here: local state above is authoritative
      // and avoids the loading flicker that hides the newly uploaded preview.
      // refresh();

      notify.success(
        translations[
          slot === "hero"
            ? "builder.images.success.hero_uploaded"
            : "builder.images.success.contact_uploaded"
        ] ||
          (slot === "hero"
            ? "Hero image uploaded successfully."
            : "Contact image uploaded successfully."),
      );
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : "";
      const fallback =
        translations["builder.images.error.upload_failed"] ||
        "Failed to upload image.";
      const message = rawMessage || fallback;
      setError(message);
      notify.error(message === fallback ? fallback : `${fallback} ${message}`);
    } finally {
      setUploadingSlot(null);
      bumpUploaderResetKey(slot);
    }
  }

  async function handleDelete(image: ImageRow) {
    if (isBusy) return;

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

      // refresh();
    } catch (err) {
      await fetchImages();
      notify.error(translations["builder.images.error.delete_failed"]);
    } finally {
      setAssigning(false);
    }
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

        {!site?.subdomain && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            {translations["builder.images.warning.subdomain_required"] ||
              "Save your subdomain in the General step before uploading images."}
          </div>
        )}

        {/* STATES */}
        {loading && (
          <p>{translations["builder.images.label.loading"] || "Loading…"}</p>
        )}
        {!loading && error && <p className="text-red-600 text-sm">{error}</p>}
        {!loading && (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border bg-white p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    {translations["builder.images.label.hero"] || "Hero image"}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {translations["builder.images.hint.hero"] ||
                      "Required. This image is shown in the main hero section."}
                  </p>
                </div>
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                  {translations["builder.images.label.required"] || "Required"}
                </span>
              </div>

              {assignedHero ? (
                <ImageCard
                  img={assignedHero}
                  label={translations["builder.images.label.hero"] || "Hero"}
                  assigning={assigning}
                  uploading={uploadingSlot === "hero"}
                  translations={translations}
                  onDelete={() => handleDelete(assignedHero)}
                />
              ) : (
                <EmptySlot
                  label={
                    translations["builder.images.label.hero"] || "Hero image"
                  }
                />
              )}

              {!assignedHero && (
                <FileUploader
                  onFile={(file) => handleFileChange(file, "hero")}
                  disabled={
                    !site?.id ||
                    !site?.subdomain ||
                    isBusy ||
                    !canUploadToSlot("hero")
                  }
                  label={
                    translations["builder.images.button.upload_hero"] ||
                    "Upload hero image"
                  }
                  accept={{ "image/*": [] } as Accept}
                  className="min-h-36"
                  translations={translations}
                  resetKey={uploaderResetKeys.hero}
                />
              )}
            </div>

            <div className="rounded-xl border bg-white p-4 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-base font-semibold text-gray-900">
                    {translations["builder.images.label.contact"] ||
                      "Contact image"}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {translations["builder.images.hint.contact"] ||
                      "Optional. This image can be shown in the contact section."}
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    {translations["builder.images.hint.contact_vertical_tip"] ||
                      "For best resultsss, use a portrait (vertical) image."}
                  </p>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {translations["builder.images.label.optional"] || "Optional"}
                </span>
              </div>

              {assignedContact ? (
                <ImageCard
                  img={assignedContact}
                  label={
                    translations["builder.images.label.contact"] || "Contact"
                  }
                  assigning={assigning}
                  uploading={uploadingSlot === "contact"}
                  translations={translations}
                  onDelete={() => handleDelete(assignedContact)}
                  vertical
                />
              ) : (
                <EmptySlot
                  label={
                    translations["builder.images.label.contact"] ||
                    "Contact image"
                  }
                />
              )}

              {!assignedContact && (
                <FileUploader
                  onFile={(file) => handleFileChange(file, "contact")}
                  disabled={
                    !site?.id ||
                    !site?.subdomain ||
                    isBusy ||
                    !canUploadToSlot("contact")
                  }
                  label={
                    translations["builder.images.button.upload_contact"] ||
                    "Upload contact image"
                  }
                  accept={{ "image/*": [] } as Accept}
                  className="min-h-36"
                  translations={translations}
                  resetKey={uploaderResetKeys.contact}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </StepLayout>
  );
}
