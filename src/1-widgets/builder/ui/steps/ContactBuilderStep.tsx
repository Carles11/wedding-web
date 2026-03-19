"use client";

import { StepLayout } from "@/1-widgets/builder/step-layout";
import { upsertContactSection } from "@/3-entities/contact/api";
import {
  fetchImagesBySite,
  getPublicUrlForImage,
} from "@/3-entities/images/api";
import { fetchContactSection } from "@/3-entities/sections/api/fetchContactSection";
import { notify } from "@/4-shared/lib/toast/toast";
import type { ContactSection, Site } from "@/4-shared/types";
import { isValidEmail, isValidPhone } from "@/4-shared/utils/validations";
import { useEffect, useRef, useState } from "react";
import { ContactForm } from "./contact/ContactForm";

type Props = {
  site: Site | null;
  refresh: () => void;
  lang: string;
  translations: Record<string, string>;
  setHasContact?: (hasContact: boolean) => void;
};

export default function ContactBuilderStep({
  site,
  refresh,
  setHasContact,
  translations,
}: Props) {
  const fetchCounterRef = useRef(0);
  const [section, setSection] = useState<ContactSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  function sectionSignature(nextSection: ContactSection | null): string {
    if (!nextSection) return "empty";

    return [
      nextSection.id ?? "",
      nextSection.created_at ?? "",
      JSON.stringify(nextSection.content ?? null),
    ].join("|");
  }

  async function reconcileSection(
    requestId: number,
    baselineSection: ContactSection | null,
    maxAttempts = 3,
  ) {
    if (!site?.id) return;

    let baselineSignature = sectionSignature(baselineSection);

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!site?.id || fetchCounterRef.current !== requestId) return;

      const nextSection = await fetchContactSection(site.id);
      const nextSignature = sectionSignature(nextSection);

      if (nextSignature !== baselineSignature) {
        setSection(nextSection);
        baselineSignature = nextSignature;
      }
    }
  }

  useEffect(() => {
    if (!site?.id) return;
    let mounted = true;
    const requestId = ++fetchCounterRef.current;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const sec = await fetchContactSection(site.id);
        if (!mounted || fetchCounterRef.current !== requestId) return;

        setSection(sec);
        await reconcileSection(requestId, sec);
      } catch (err: unknown) {
        if (mounted && fetchCounterRef.current === requestId) {
          setError((err as Error)?.message ?? String(err));
        }
      } finally {
        if (mounted && fetchCounterRef.current === requestId) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [site?.id]);

  // Manual reload used by the "Reload" back button
  function load() {
    if (!site?.id) return;
    setLoading(true);
    setError(null);
    fetchContactSection(site.id)
      .then((sec) => setSection(sec))
      .catch((err: unknown) => setError((err as Error)?.message ?? String(err)))
      .finally(() => setLoading(false));
  }

  const [form, setForm] = useState<ContactSection["content"]>({
    bride: { name: null, email: null, phone: null },
    groom: { name: null, email: null, phone: null },
    image_id: null,
  });

  useEffect(() => {
    if (section?.content) setForm(section.content);
  }, [section]);

  type Partner = {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  };

  function updatePartner(
    partner: "bride" | "groom",
    field: string,
    value: string | null,
  ) {
    setForm((f) => {
      const prev = (f?.[partner] as Partner) ?? {
        name: null,
        email: null,
        phone: null,
      };
      return {
        ...(f ?? {}),
        [partner]: { ...prev, [field]: value },
      } as ContactSection["content"];
    });
    setFormErrors((errs) => {
      const key = `${partner}_${field}`;
      const { [key]: _removed, ...rest } = errs;
      return rest;
    });
  }

  // Contact completeness logic
  function validContact(pt: Partner) {
    if (!pt?.name && !pt?.email) return false;
    if (!pt?.name || !pt?.email) return false;
    if (!isValidEmail(pt.email || "")) return false;
    return true;
  }

  // Run completeness detection/propagate to parent on changes
  useEffect(() => {
    if (setHasContact) {
      const bride = (form?.bride as Partner | undefined) ?? {};
      const groom = (form?.groom as Partner | undefined) ?? {};
      setHasContact(validContact(bride) && validContact(groom));
    }
  }, [form, setHasContact]);

  async function handleSave() {
    if (!site?.id) return;
    setError(null);
    const bride = (form?.bride as Partner | undefined) ?? {};
    const groom = (form?.groom as Partner | undefined) ?? {};
    const errors: Record<string, string> = {};

    // Bride validations
    if (!bride.name) {
      errors.bride_name =
        translations["builder.contact.error.name_required"] ||
        "Name is required";
    }
    if (bride.email && !isValidEmail(bride.email)) {
      errors.bride_email =
        translations["builder.contact.error.email_invalid"] || "Invalid email";
    }
    if (bride.phone && !isValidPhone(bride.phone)) {
      errors.bride_phone =
        translations["builder.contact.error.phone_invalid"] ||
        "Invalid phone number";
    }

    // Groom validations
    if (!groom.name) {
      errors.groom_name =
        translations["builder.contact.error.name_required"] ||
        "Name is required";
    }
    if (groom.email && !isValidEmail(groom.email)) {
      errors.groom_email =
        translations["builder.contact.error.email_invalid"] || "Invalid email";
    }
    if (groom.phone && !isValidPhone(groom.phone)) {
      errors.groom_phone =
        translations["builder.contact.error.phone_invalid"] ||
        "Invalid phone number";
    }

    // At least one partner must have valid name and email
    const brideValid = bride.name && bride.email && isValidEmail(bride.email);
    const groomValid = groom.name && groom.email && isValidEmail(groom.email);
    if (!brideValid && !groomValid) {
      setError(
        translations["builder.contact.error.at_least_one"] ||
          "At least one partner must have a name and a valid email",
      );
      setFormErrors(errors);
      return;
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setError(Object.values(errors)[0]);
      return;
    }

    setSaving(true);
    try {
      const updated = await upsertContactSection(site.id, form ?? {});
      if (!updated) throw new Error("Save failed");
      setSection(updated);
      notify.success(
        translations["builder.general.form.save_success"] ||
          "Saved successfully.",
      );
      setFormErrors({});
      // No refresh() here: doesn't change the sites table; local state is authoritative.
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  const [contactImageUrl, setContactImageUrl] = useState<string | null>(null);
  useEffect(() => {
    async function loadImage() {
      if (!site?.id) return setContactImageUrl(null);
      try {
        const imgs = await fetchImagesBySite(site.id);
        const contactImg = imgs.find((i) => i.section === "contact");
        if (contactImg)
          setContactImageUrl(
            getPublicUrlForImage({ url: contactImg.url || "" }),
          );
        else setContactImageUrl(null);
      } catch {
        setContactImageUrl(null);
      }
    }
    loadImage();
  }, [site?.id, section?.content?.image_id]);

  return (
    <StepLayout
      onNext={handleSave}
      nextLoading={saving}
      nextDisabled={saving}
      nextLabel={translations["builder.actions.save"] || "Save"}
      onBack={load}
      backLabel={translations["builder.contact.reload"] || "Reload"}
      translations={translations}
    >
      <div className="space-y-4">
        <div className="mb-4 text-md text-gray-600">
          {translations["builder.contact.description"] ||
            "Provide the main contact details used for RSVP and site contact."}
        </div>

        {loading ? (
          <p>{translations["common.loading"] || "Loading..."}</p>
        ) : (
          <div className="space-y-4">
            {contactImageUrl && (
              <div className="max-w-xs">
                <div className="text-xs text-gray-600 mb-1">
                  {translations["builder.contact.image_label"] ||
                    "Contact image"}
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={contactImageUrl ?? undefined}
                  alt={translations["builder.contact.image_alt"] || "Contact"}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}

            <div className="border rounded-xl p-4 bg-gray-50">
              <ContactForm
                form={form}
                errors={formErrors}
                translations={translations}
                onChangePartner={updatePartner}
                disabled={saving}
              />
              {error && (
                <div className="text-[--builder-color-danger] mt-4">
                  {error}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </StepLayout>
  );
}
