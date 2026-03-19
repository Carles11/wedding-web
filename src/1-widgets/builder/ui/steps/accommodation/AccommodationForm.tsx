import { t } from "@/4-shared/helpers/t";
import type { AccommodationFormValues } from "@/4-shared/types/accommodation";
import {
  BuilderTextInput,
  BuilderTextarea,
} from "@/4-shared/ui/builder/inputs";
import {
  isValidEmail,
  isValidPhone,
  isValidURL,
} from "@/4-shared/utils/validations";

export type AccommodationFormErrors = Partial<
  Record<keyof AccommodationFormValues, string>
>;

export type AccommodationFormProps = {
  form: AccommodationFormValues;
  errors: AccommodationFormErrors;
  translations: Record<string, string>;
  onChange: <K extends keyof AccommodationFormValues>(
    field: K,
    value: AccommodationFormValues[K],
  ) => void;
  disabled?: boolean;
};
export function AccommodationForm({
  form,
  errors,
  translations,
  onChange,
  disabled,
}: AccommodationFormProps) {
  // Inline validation for website, phone, email
  const websiteError =
    form.website && !isValidURL(form.website)
      ? t(
          translations,
          "builder.accommodation.error.website",
          "Invalid website URL.",
        )
      : errors.website;
  const phoneError =
    form.phone && !isValidPhone(form.phone)
      ? t(
          translations,
          "builder.accommodation.error.phone",
          "Invalid phone number.",
        )
      : errors.phone;
  const emailError =
    form.email && !isValidEmail(form.email)
      ? t(
          translations,
          "builder.accommodation.error.email",
          "Invalid email address.",
        )
      : errors.email;
  return (
    <>
      <BuilderTextInput
        label={t(translations, "builder.accommodation.field.name", "Name")}
        value={form.name}
        onChange={(v) => onChange("name", v)}
        required
        error={errors.name}
        disabled={disabled}
      />
      <BuilderTextInput
        label={t(
          translations,
          "builder.accommodation.field.address",
          "Address (optional)",
        )}
        value={form.address ?? ""}
        onChange={(v) => onChange("address", v)}
        error={errors.address}
        disabled={disabled}
      />
      <BuilderTextarea
        label={t(
          translations,
          "builder.accommodation.field.notes",
          "Notes (optional)",
        )}
        value={form.notes ?? ""}
        onChange={(v) => onChange("notes", v)}
        rows={2}
        disabled={disabled}
      />
      <BuilderTextInput
        label={t(
          translations,
          "builder.accommodation.field.website",
          "Website (optional)",
        )}
        value={form.website ?? ""}
        onChange={(v) => onChange("website", v)}
        error={websiteError}
        disabled={disabled}
      />
      <BuilderTextInput
        label={t(
          translations,
          "builder.accommodation.field.phone",
          "Phone (optional)",
        )}
        value={form.phone ?? ""}
        onChange={(v) => onChange("phone", v)}
        error={phoneError}
        disabled={disabled}
      />
      <BuilderTextInput
        label={t(
          translations,
          "builder.accommodation.field.email",
          "Email (optional)",
        )}
        value={form.email ?? ""}
        onChange={(v) => onChange("email", v)}
        error={emailError}
        disabled={disabled}
      />
    </>
  );
}
