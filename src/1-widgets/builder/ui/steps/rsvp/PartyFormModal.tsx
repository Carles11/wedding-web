"use client";

import type { RsvpParty } from "@/3-entities/rsvp/model/types";
import {
  SUPPORTED_LANGUAGES,
  SUPPORTED_LANGUAGE_LABELS,
} from "@/4-shared/config/i18n";
import { t } from "@/4-shared/helpers/t";
import { BuilderButton } from "@/4-shared/ui/builder";
import { BuilderDropdownInput } from "@/4-shared/ui/builder/inputs/BuilderDropdownInput";
import { BuilderTextInput } from "@/4-shared/ui/builder/inputs/BuilderTextInput";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: (party: RsvpParty) => void;
  editingParty: RsvpParty | null;
  translations: Record<string, string>;
  siteId: string;
};

const LANG_OPTIONS = SUPPORTED_LANGUAGES.map((l) => ({
  key: l,
  label: SUPPORTED_LANGUAGE_LABELS[l],
}));

export function PartyFormModal({
  open,
  onClose,
  onSaved,
  editingParty,
  translations,
  siteId,
}: Props) {
  const isEdit = editingParty !== null;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLang, setPreferredLang] = useState("en");
  const [maxGuests, setMaxGuests] = useState("1");

  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [maxGuestsError, setMaxGuestsError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (open) {
      if (editingParty) {
        setName(editingParty.name);
        setEmail(editingParty.email);
        setPreferredLang(editingParty.preferred_lang);
        setMaxGuests(String(editingParty.max_guests));
      } else {
        setName("");
        setEmail("");
        setPreferredLang("en");
        setMaxGuests("1");
      }
      setNameError(null);
      setEmailError(null);
      setMaxGuestsError(null);
      setSubmitError(null);
    }
  }, [open, editingParty]);

  function validate(): boolean {
    let valid = true;

    if (!name.trim()) {
      setNameError(
        t(
          translations,
          "builder.rsvp.guest.name.required",
          "Name is required.",
        ),
      );
      valid = false;
    } else {
      setNameError(null);
    }

    if (!email.trim()) {
      setEmailError(
        t(
          translations,
          "builder.rsvp.guest.email.required",
          "Email is required.",
        ),
      );
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError(
        t(
          translations,
          "builder.rsvp.guest.email.invalid",
          "Enter a valid email address.",
        ),
      );
      valid = false;
    } else {
      setEmailError(null);
    }

    const guests = parseInt(maxGuests, 10);
    if (!maxGuests || isNaN(guests) || guests < 1) {
      setMaxGuestsError(
        t(
          translations,
          "builder.rsvp.guest.max_guests.invalid",
          "Max guests must be at least 1.",
        ),
      );
      valid = false;
    } else {
      setMaxGuestsError(null);
    }

    return valid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSaving(true);
    setSubmitError(null);

    const guests = parseInt(maxGuests, 10);
    const payload = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      preferred_lang: preferredLang,
      max_guests: guests,
    };

    const url = isEdit
      ? `/api/sites/${siteId}/rsvp-parties/${editingParty!.id}`
      : `/api/sites/${siteId}/rsvp-parties`;
    const method = isEdit ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = (await res.json()) as {
        success: boolean;
        party?: RsvpParty;
        error?: string;
        code?: string;
      };

      if (!res.ok || !json.success) {
        if (json.code === "email_duplicate") {
          setEmailError(
            t(
              translations,
              "builder.rsvp.guest.email.duplicate",
              "This email is already registered for this site.",
            ),
          );
        } else {
          setSubmitError(
            json.error ??
              t(translations, "builder.rsvp.guest.save.error", "Save failed."),
          );
        }
        return;
      }

      onSaved(json.party!);
      onClose();
    } catch {
      setSubmitError(
        t(
          translations,
          "builder.rsvp.guest.network.error",
          "Network error — please try again.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <MainModal
      open={open}
      title={
        isEdit
          ? t(translations, "builder.rsvp.guest.modal.edit", "Edit guest")
          : t(translations, "builder.rsvp.guest.modal.add", "Add guest")
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <BuilderTextInput
          label={t(translations, "builder.rsvp.guest.name.label", "Name")}
          value={name}
          onChange={setName}
          required
          placeholder="Jane & John Smith"
          error={nameError ?? undefined}
        />

        <BuilderTextInput
          label={t(translations, "builder.rsvp.guest.email.label", "Email")}
          value={email}
          onChange={setEmail}
          type="email"
          required
          placeholder="jane@example.com"
          error={emailError ?? undefined}
        />

        <BuilderDropdownInput
          label={t(
            translations,
            "builder.rsvp.guest.lang.label",
            "Preferred language",
          )}
          value={preferredLang}
          options={LANG_OPTIONS}
          onChange={setPreferredLang}
        />

        <div className="space-y-1">
          <label className="block text-xs text-gray-600 dark:text-gray-400">
            {t(
              translations,
              "builder.rsvp.guest.max_guests.label",
              "Max guests",
            )}
            <span className="ml-0.5 text-red-500 dark:text-red-400"> *</span>
          </label>
          <input
            type="number"
            min={1}
            value={maxGuests}
            onChange={(e) => setMaxGuests(e.target.value)}
            required
            className={`mt-1 w-full border rounded-md px-3 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              maxGuestsError ? "border-red-500 dark:border-red-800/50" : "border-gray-300 dark:border-gray-600"
            }`}
          />
          {maxGuestsError && (
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">{maxGuestsError}</p>
          )}
        </div>

        {submitError && <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <BuilderButton
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            {t(translations, "builder.rsvp.guest.modal.cancel", "Cancel")}
          </BuilderButton>
          <BuilderButton type="submit" variant="primary" disabled={saving}>
            {saving
              ? t(translations, "builder.rsvp.guest.modal.saving", "Saving…")
              : t(translations, "builder.rsvp.guest.modal.save", "Save")}
          </BuilderButton>
        </div>
      </form>
    </MainModal>
  );
}
