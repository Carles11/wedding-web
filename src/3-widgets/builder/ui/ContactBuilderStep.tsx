"use client";

import React, { useEffect, useState } from "react";
import type { Site, ContactSection } from "@/4-shared/types";
import {
  fetchContactSection,
  upsertContactSection,
} from "@/3-entities/contact/api";
import {
  fetchImagesBySite,
  getPublicUrlForImage,
} from "@/3-entities/images/api";

type Props = { site: Site | null; refresh: () => void };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactBuilderStep({ site, refresh }: Props) {
  const [section, setSection] = useState<ContactSection | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For static bride/groom contacts we don't need per-language strings.

  useEffect(() => {
    if (!site?.id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [site?.id]);

  async function load() {
    if (!site?.id) return;
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

  async function handleSave() {
    if (!site?.id) return;
    setError(null);

    // Validate that at least one partner has name+valid email.
    const bride =
      (form?.bride as
        | { name?: string | null; email?: string | null; phone?: string | null }
        | undefined) ?? {};
    const groom =
      (form?.groom as
        | { name?: string | null; email?: string | null; phone?: string | null }
        | undefined) ?? {};

    function validContact(pt: { name?: string | null; email?: string | null; phone?: string | null }) {
      if (!pt?.name && !pt?.email) return false;
      if (!pt?.name || !pt?.email) return false;
      if (!EMAIL_RE.test(pt.email)) return false;
      return true;
    }

    if (!validContact(bride) && !validContact(groom)) {
      setError("At least one partner must have a name and a valid email");
      return;
    }

    // If phone present, do simple digit-length validation
    const phoneCheck = (p?: string | null) => {
      if (!p) return true;
      const digits = p.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    };
    if (!phoneCheck(bride?.phone) || !phoneCheck(groom?.phone)) {
      setError("If provided, phone numbers must contain 7–15 digits");
      return;
    }

    setSaving(true);
    try {
      const updated = await upsertContactSection(site.id, form ?? {});
      if (!updated) throw new Error("Save failed");
      setSection(updated);
      refresh();
    } catch (err: unknown) {
      setError((err as Error)?.message ?? String(err));
    } finally {
      setSaving(false);
    }
  }

  // Optionally show a contact image if one exists (images API used elsewhere).
  const [contactImageUrl, setContactImageUrl] = useState<string | null>(null);
  useEffect(() => {
    async function loadImage() {
      if (!site?.id) return setContactImageUrl(null);
      try {
        const imgs = await fetchImagesBySite(site.id);
        const contactImg = imgs.find((i) => i.section === "contact");
        if (contactImg) setContactImageUrl(getPublicUrlForImage(contactImg));
        else setContactImageUrl(null);
      } catch {
        setContactImageUrl(null);
      }
    }
    loadImage();
  }, [site?.id, section?.content?.image_id]);

  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Contact</h3>

      <div className="text-sm text-gray-600 mb-3">
        Provide the main contact details used for RSVP and site contact.
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-4">
          {contactImageUrl && (
            <div>
              <div className="text-xs text-gray-600 mb-1">Contact image</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={contactImageUrl ?? undefined}
                alt="Contact"
                className="w-48 h-32 object-cover rounded"
              />
            </div>
          )}

          <div className="border rounded p-3 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-2 border rounded">
                <div className="font-medium">Bride</div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-600">Name</label>
                  <input
                    value={(form?.bride as Partner | undefined)?.name ?? ""}
                    onChange={(e) =>
                      updatePartner("bride", "name", e.target.value || null)
                    }
                    className="mt-1 w-full"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-600">Email</label>
                  <input
                    value={(form?.bride as Partner | undefined)?.email ?? ""}
                    onChange={(e) =>
                      updatePartner("bride", "email", e.target.value || null)
                    }
                    className="mt-1 w-full"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-600">
                    Phone (optional)
                  </label>
                  <input
                    value={(form?.bride as Partner | undefined)?.phone ?? ""}
                    onChange={(e) =>
                      updatePartner("bride", "phone", e.target.value || null)
                    }
                    className="mt-1 w-full"
                  />
                </div>
              </div>

              <div className="p-2 border rounded">
                <div className="font-medium">Groom</div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-600">Name</label>
                  <input
                    value={(form?.groom as Partner | undefined)?.name ?? ""}
                    onChange={(e) =>
                      updatePartner("groom", "name", e.target.value || null)
                    }
                    className="mt-1 w-full"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-600">Email</label>
                  <input
                    value={(form?.groom as Partner | undefined)?.email ?? ""}
                    onChange={(e) =>
                      updatePartner("groom", "email", e.target.value || null)
                    }
                    className="mt-1 w-full"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-600">
                    Phone (optional)
                  </label>
                  <input
                    value={(form?.groom as Partner | undefined)?.phone ?? ""}
                    onChange={(e) =>
                      updatePartner("groom", "phone", e.target.value || null)
                    }
                    className="mt-1 w-full"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              {error && <div className="text-red-600 mt-2">{error}</div>}

              <div className="mt-4 flex gap-2">
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save"}
                </button>
                <button
                  className="px-3 py-1 border rounded bg-white"
                  onClick={() => {
                    setSection(null);
                    load();
                  }}
                  disabled={saving}
                >
                  Reload
                </button>
              </div>
              {/* Preview of static contacts */}
              <div className="mt-4">
                <div className="font-medium mb-2">Preview</div>
                <div className="space-y-2">
                  {(form?.bride as Partner | undefined)?.name ? (
                    <div className="p-2 border rounded">
                      <div className="font-semibold">Bride</div>
                      <div className="text-sm">
                        {(form?.bride as Partner).name}
                      </div>
                      <div className="text-sm mt-1">
                        {(form?.bride as Partner).email ? (
                          <a href={`mailto:${(form?.bride as Partner).email}`}>
                            {(form?.bride as Partner).email}
                          </a>
                        ) : null}
                        {(form?.bride as Partner).phone ? (
                          <div>
                            <a href={`tel:${(form?.bride as Partner).phone}`}>
                              {(form?.bride as Partner).phone}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  {(form?.groom as Partner | undefined)?.name ? (
                    <div className="p-2 border rounded">
                      <div className="font-semibold">Groom</div>
                      <div className="text-sm">
                        {(form?.groom as Partner).name}
                      </div>
                      <div className="text-sm mt-1">
                        {(form?.groom as Partner).email ? (
                          <a href={`mailto:${(form?.groom as Partner).email}`}>
                            {(form?.groom as Partner).email}
                          </a>
                        ) : null}
                        {(form?.groom as Partner).phone ? (
                          <div>
                            <a href={`tel:${(form?.groom as Partner).phone}`}>
                              {(form?.groom as Partner).phone}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

