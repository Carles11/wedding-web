"use client";

import { StepLayout } from "@/1-widgets/builder/step-layout";
import { upsertContactSection } from "@/3-entities/contact/api";
import {
  fetchImagesBySite,
  getPublicUrlForImage,
} from "@/3-entities/images/api";
import { fetchContactSection } from "@/3-entities/sections/api/fetchContactSection";
import type { ContactSection, Site } from "@/4-shared/types";
import { EMAIL_RE } from "@/4-shared/utils/validations";
import { useEffect, useState } from "react";

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
  const [section, setSection] = useState<ContactSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchAndApplyContactSection() {
    if (!site?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const sec = await fetchContactSection(site.id);
      setSection(sec);
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAndApplyContactSection();
  }, [site?.id]);

  // Manual reload used by the "Reload" back button
  function load() {
    fetchAndApplyContactSection();
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
    field: keyof Partner,
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
  }

  // Contact completeness logic
  function validContact(pt: Partner) {
    if (!pt?.name && !pt?.email) return false;
    if (!pt?.name || !pt?.email) return false;
    if (!EMAIL_RE.test(pt.email || "")) return false;
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

    if (!validContact(bride) && !validContact(groom)) {
      setError(
        translations["builder.contact.error.at_least_one"] ||
          "At least one partner must have a name and a valid email",
      );
      return;
    }

    const phoneCheck = (p?: string | null) => {
      if (!p) return true;
      const digits = p.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    };

    if (!phoneCheck(bride?.phone) || !phoneCheck(groom?.phone)) {
      setError(
        translations["builder.contact.error.phone_invalid"] ||
          "If provided, phone numbers must contain 7-15 digits",
      );
      return;
    }

    setSaving(true);
    try {
      const updated = await upsertContactSection(site.id, form ?? {});
      if (!updated) throw new Error("Save failed");

      await Promise.resolve(refresh());
      await fetchAndApplyContactSection();
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

  const inputCls =
    "mt-1 w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

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
        <div>
          <h3 className="text-lg font-medium">
            {translations["builder.contact.title"] || "Contact"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {translations["builder.contact.description"] ||
              "Provide the main contact details used for RSVP and site contact."}
          </p>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Bride */}
                <div className="p-3 border rounded-xl bg-white">
                  <div className="font-medium">
                    {translations["builder.contact.bride"] || "Bride"}
                  </div>
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600">
                        {translations["builder.contact.field.name"] || "Name"}
                      </label>
                      <input
                        value={(form?.bride as Partner | undefined)?.name ?? ""}
                        onChange={(e) =>
                          updatePartner("bride", "name", e.target.value || null)
                        }
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600">
                        {translations["builder.contact.field.email"] || "Email"}
                      </label>
                      <input
                        value={
                          (form?.bride as Partner | undefined)?.email ?? ""
                        }
                        onChange={(e) =>
                          updatePartner(
                            "bride",
                            "email",
                            e.target.value || null,
                          )
                        }
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600">
                        {translations["builder.contact.field.phone_optional"] ||
                          "Phone (optional)"}
                      </label>
                      <input
                        value={
                          (form?.bride as Partner | undefined)?.phone ?? ""
                        }
                        onChange={(e) =>
                          updatePartner(
                            "bride",
                            "phone",
                            e.target.value || null,
                          )
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>

                {/* Groom */}
                <div className="p-3 border rounded-xl bg-white">
                  <div className="font-medium">
                    {translations["builder.contact.groom"] || "Groom"}
                  </div>
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600">
                        {translations["builder.contact.field.name"] || "Name"}
                      </label>
                      <input
                        value={(form?.groom as Partner | undefined)?.name ?? ""}
                        onChange={(e) =>
                          updatePartner("groom", "name", e.target.value || null)
                        }
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600">
                        {translations["builder.contact.field.email"] || "Email"}
                      </label>
                      <input
                        value={
                          (form?.groom as Partner | undefined)?.email ?? ""
                        }
                        onChange={(e) =>
                          updatePartner(
                            "groom",
                            "email",
                            e.target.value || null,
                          )
                        }
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600">
                        {translations["builder.contact.field.phone_optional"] ||
                          "Phone (optional)"}
                      </label>
                      <input
                        value={
                          (form?.groom as Partner | undefined)?.phone ?? ""
                        }
                        onChange={(e) =>
                          updatePartner(
                            "groom",
                            "phone",
                            e.target.value || null,
                          )
                        }
                        className={inputCls}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && <div className="text-red-600 mt-4">{error}</div>}

              {/* Preview */}
              <div className="mt-6">
                <div className="font-medium mb-2">
                  {translations["builder.contact.preview_title"] ||
                    "Contact section preview"}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(form?.bride as Partner | undefined)?.name && (
                    <div className="p-3 border rounded-xl bg-white">
                      <div className="font-semibold">
                        {translations["builder.contact.bride"] || "Bride"}
                      </div>
                      <div className="text-sm">
                        {(form?.bride as Partner).name}
                      </div>
                      <div className="text-sm mt-1">
                        {(form?.bride as Partner).email && (
                          <a href={`mailto:${(form?.bride as Partner).email}`}>
                            {(form?.bride as Partner).email}
                          </a>
                        )}
                        {(form?.bride as Partner).phone && (
                          <div>
                            <a href={`tel:${(form?.bride as Partner).phone}`}>
                              {(form?.bride as Partner).phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {(form?.groom as Partner | undefined)?.name && (
                    <div className="p-3 border rounded-xl bg-white">
                      <div className="font-semibold">
                        {translations["builder.contact.groom"] || "Groom"}
                      </div>
                      <div className="text-sm">
                        {(form?.groom as Partner).name}
                      </div>
                      <div className="text-sm mt-1">
                        {(form?.groom as Partner).email && (
                          <a href={`mailto:${(form?.groom as Partner).email}`}>
                            {(form?.groom as Partner).email}
                          </a>
                        )}
                        {(form?.groom as Partner).phone && (
                          <div>
                            <a href={`tel:${(form?.groom as Partner).phone}`}>
                              {(form?.groom as Partner).phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StepLayout>
  );
}
