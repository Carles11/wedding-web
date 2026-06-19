import type { ContactSection } from "@/4-shared/types";
import { BuilderTextInput } from "@/4-shared/ui/builder/inputs";

export type ContactFormErrors = Partial<Record<string, string>>;

export type ContactFormProps = {
  form: ContactSection["content"];
  errors: ContactFormErrors;
  translations: Record<string, string>;
  onChangePartner: (
    partner: "bride" | "groom",
    field: string,
    value: string | null,
  ) => void;
  disabled?: boolean;
};

export function ContactForm({
  form,
  errors,
  translations,
  onChangePartner,
  disabled,
}: ContactFormProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Bride */}
      <div className="p-3 border rounded-xl bg-white dark:bg-gray-800">
        <div className="font-medium">
          {translations["builder.contact.bride"] || "Side A"}
        </div>
        <div className="mt-3 space-y-3">
          <BuilderTextInput
            label={translations["builder.contact.field.name"] || "Name"}
            value={form?.bride?.name ?? ""}
            onChange={(v: string) =>
              onChangePartner("bride", "name", v || null)
            }
            error={errors.bride_name}
            disabled={disabled}
          />
          <BuilderTextInput
            label={translations["builder.contact.field.email"] || "Email"}
            value={form?.bride?.email ?? ""}
            onChange={(v: string) =>
              onChangePartner("bride", "email", v || null)
            }
            error={errors.bride_email}
            disabled={disabled}
          />
          <BuilderTextInput
            label={
              translations["builder.contact.field.phone_optional"] ||
              "Phone (optional)"
            }
            value={form?.bride?.phone ?? ""}
            onChange={(v: string) =>
              onChangePartner("bride", "phone", v || null)
            }
            error={errors.bride_phone}
            disabled={disabled}
          />
        </div>
      </div>
      {/* Groom */}
      <div className="p-3 border rounded-xl bg-white dark:bg-gray-800">
        <div className="font-medium">
          {translations["builder.contact.groom"] || "Side B"}
        </div>
        <div className="mt-3 space-y-3">
          <BuilderTextInput
            label={translations["builder.contact.field.name"] || "Name"}
            value={form?.groom?.name ?? ""}
            onChange={(v: string) =>
              onChangePartner("groom", "name", v || null)
            }
            error={errors.groom_name}
            disabled={disabled}
          />
          <BuilderTextInput
            label={translations["builder.contact.field.email"] || "Email"}
            value={form?.groom?.email ?? ""}
            onChange={(v: string) =>
              onChangePartner("groom", "email", v || null)
            }
            error={errors.groom_email}
            disabled={disabled}
          />
          <BuilderTextInput
            label={
              translations["builder.contact.field.phone_optional"] ||
              "Phone (optional)"
            }
            value={form?.groom?.phone ?? ""}
            onChange={(v: string) =>
              onChangePartner("groom", "phone", v || null)
            }
            error={errors.groom_phone}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}
