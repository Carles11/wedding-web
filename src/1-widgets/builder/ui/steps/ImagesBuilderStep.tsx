"use client";

import {
  deleteImage,
  fetchImagesBySite,
  fetchSectionId,
  uploadImageForSite,
} from "@/3-entities/images/api";
import { getPlanLimit } from "@/4-shared/helpers/billing/entitlements";
import {
  classifyImage,
  imagesSignature,
  inferSectionIdsFromRows,
  normalizeImages,
  publicUrlForImageRow,
  type ImageSectionIds,
  type ImageSlot,
} from "@/4-shared/helpers/images";
import { notify } from "@/4-shared/lib/toast/toast";
import type { AccountInfo, ImageRow, PlanType, Site } from "@/4-shared/types";
import FileUploader from "@/4-shared/ui/builder/FileUploader";
import { CustomLoader } from "@/4-shared/ui/commons/loader/CustomLoader";
import { ensureNotLegacy } from "@/4-shared/utils/billing/legacyLock";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Accept } from "react-dropzone";
import { StepLayout } from "../../step-layout";

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
  const url = publicUrlForImageRow(img);
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
          className="absolute top-0 right-2 cursor-pointer mt-2 p-2 h-6 w-6 bg-white rounded-md border shadow-sm flex items-center justify-center text-(--builder-color-danger) text-sm font-bold hover:bg-white md:opacity-0 md:group-hover:opacity-100 transition"
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
  account: AccountInfo;
};

export default function ImagesBuilderStep({
  site,
  refresh,
  translations,
  setHeroImageExists,
  planType,
  account,
}: Props) {
  const fetchCounterRef = useRef(0);
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
  const [sectionIds, setSectionIds] = useState<ImageSectionIds>({
    hero: null,
    contact: null,
  });

  // assignments
  const assignedHero = useMemo(
    () =>
      images.find(
        (img) =>
          classifyImage(img, sectionIds.hero, sectionIds.contact) === "hero",
      ) || null,
    [images, sectionIds.contact, sectionIds.hero],
  );

  const assignedContact = useMemo(
    () =>
      images.find(
        (img) =>
          classifyImage(img, sectionIds.hero, sectionIds.contact) === "contact",
      ) || null,
    [images, sectionIds.contact, sectionIds.hero],
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

  function resolveSectionIds(rows: ImageRow[]): ImageSectionIds {
    const inferredSectionIds = inferSectionIdsFromRows(rows);
    const nextSectionIds: ImageSectionIds = {
      hero: inferredSectionIds.hero ?? sectionIds.hero,
      contact: inferredSectionIds.contact ?? sectionIds.contact,
    };

    setSectionIds((prev) =>
      prev.hero === nextSectionIds.hero &&
      prev.contact === nextSectionIds.contact
        ? prev
        : nextSectionIds,
    );

    return nextSectionIds;
  }

  async function reconcileImages(
    requestId: number,
    baselineRows: ImageRow[],
    resolvedSectionIds: ImageSectionIds,
    maxAttempts = 3,
  ) {
    if (!site?.id) return;

    let activeSectionIds = {
      ...resolvedSectionIds,
    };

    let baselineSignature = imagesSignature(
      normalizeImages(
        baselineRows,
        activeSectionIds.hero,
        activeSectionIds.contact,
      ),
      activeSectionIds.hero,
      activeSectionIds.contact,
    );

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (!site?.id || fetchCounterRef.current !== requestId) {
        return;
      }

      const nextRows = await fetchImagesBySite(site.id);
      activeSectionIds = resolveSectionIds(nextRows);

      const nextNormalized = normalizeImages(
        nextRows,
        activeSectionIds.hero,
        activeSectionIds.contact,
      );
      const nextSignature = imagesSignature(
        nextNormalized,
        activeSectionIds.hero,
        activeSectionIds.contact,
      );

      if (nextSignature !== baselineSignature) {
        setImages(nextNormalized);
        baselineSignature = nextSignature;
      }
    }
  }

  async function fetchImages() {
    if (!site?.id) return;
    const requestId = ++fetchCounterRef.current;
    setLoading(true);
    setError(null);

    try {
      const rows = await fetchImagesBySite(site.id);
      const resolvedSectionIds = resolveSectionIds(rows);
      const normalized = normalizeImages(
        rows,
        resolvedSectionIds.hero,
        resolvedSectionIds.contact,
      );
      setImages(normalized);
      await reconcileImages(requestId, rows, resolvedSectionIds);
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
      ensureNotLegacy(account);

      const existingInSlot = slot === "hero" ? assignedHero : assignedContact;
      const sectionId = await fetchSectionId(site.id, slot);
      if (!sectionId) {
        throw new Error(
          translations["builder.images.error.missing_section"] ||
            "Unable to prepare the image section.",
        );
      }

      const nextSectionIds: ImageSectionIds = {
        ...sectionIds,
        [slot]: sectionId,
      };
      setSectionIds((prev) =>
        prev[slot] === sectionId ? prev : { ...prev, [slot]: sectionId },
      );

      const inserted = await uploadImageForSite(
        site.id,
        file,
        slot,
        sectionId,
        site.subdomain,
        "0",
      );

      if (!inserted)
        throw new Error(
          translations["builder.images.error.upload_failed"] ||
            "Upload failed.",
        );

      setImages((prev) =>
        normalizeImages(
          [...prev.filter((img) => img.id !== existingInSlot?.id), inserted],
          nextSectionIds.hero,
          nextSectionIds.contact,
        ),
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

    try {
      const ok = await deleteImage(image);
      if (!ok) {
        notify.error(translations["builder.images.error.delete_failed"]);
        return;
      }

      setImages((prev) => prev.filter((img) => img.id !== image.id));

      // refresh();
    } catch (err) {
      notify.error(translations["builder.images.error.delete_failed"]);
    } finally {
      setAssigning(false);
    }
  }

  return (
    <StepLayout showActions={false}>
      <div className="space-y-6 min-w-0">
        {/* HEADER */}
        <div className="mb-4 text-md text-gray-600 leading-relaxed">
          {translations["builder.images.label.intro"] ||
            "Personalize your site with a stunning Hero image and a Contact photo to add a personal touch."}
        </div>

        {/* STATES */}
        {loading && (
          <CustomLoader
            message={
              translations["builder.images.label.loading"] || "Loading images…"
            }
          />
        )}
        {!loading && error && (
          <p className="text-(--builder-color-danger) text-sm">{error}</p>
        )}
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
              ) : null}

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
              ) : null}

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
