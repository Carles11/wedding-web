"use client";

import { interpolate } from "@/4-shared/helpers/interpolateVars";
import { t } from "@/4-shared/helpers/t";
import { BuilderButton } from "@/4-shared/ui/builder";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import React from "react";

interface RemoveDomainConfirmModalProps {
  open: boolean;
  domain: string | null;
  translations: Record<string, string>;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const RemoveDomainConfirmModal: React.FC<RemoveDomainConfirmModalProps> = ({
  open,
  domain,
  translations,
  loading = false,
  onClose,
  onConfirm,
}) => {
  return (
    <MainModal
      open={open}
      title={t(
        translations,
        "builder.domain.confirm_remove_title",
        "Remove domain?",
      )}
      onClose={onClose}
    >
      <div className="space-y-4 p-2 text-sm">
        <p className="text-gray-600">
          {interpolate(
            t(
              translations,
              "builder.domain.confirm_remove_message",
              "Are you sure you want to remove {domain} from this site?",
            ),
            {
              domain:
                domain ??
                t(translations, "builder.domain.this_domain", "this domain"),
            },
          )}
        </p>

        <div className="flex justify-end gap-2">
          <BuilderButton
            type="button"
            size="sm"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {t(translations, "builder.domain.confirm_remove_cancel", "Cancel")}
          </BuilderButton>
          <BuilderButton
            type="button"
            size="sm"
            variant="secondary"
            tone="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {t(translations, "builder.domain.confirm_remove_confirm", "Remove")}
          </BuilderButton>
        </div>
      </div>
    </MainModal>
  );
};

export default RemoveDomainConfirmModal;
