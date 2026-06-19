"use client";

import { t } from "@/4-shared/helpers/t";
import { BuilderButton } from "@/4-shared/ui/builder";
import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import React from "react";

interface DeleteAccountConfirmModalProps {
  open: boolean;
  translations: Record<string, string>;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountConfirmModal: React.FC<DeleteAccountConfirmModalProps> = ({
  open,
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
        "builder.account.page.delete_confirm_modal_title",
        "Delete account?",
      )}
      onClose={onClose}
    >
      <div className="space-y-4 p-2 text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          {t(
            translations,
            "builder.account.page.delete_confirm_modal_message",
            "Are you sure you want to permanently delete your account? This action cannot be undone.",
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
            {t(
              translations,
              "builder.account.page.delete_confirm_modal_cancel",
              "Cancel",
            )}
          </BuilderButton>
          <BuilderButton
            type="button"
            size="sm"
            variant="secondary"
            tone="danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {t(
              translations,
              "builder.account.page.delete_confirm_modal_confirm",
              "Permanently Delete",
            )}
          </BuilderButton>
        </div>
      </div>
    </MainModal>
  );
};

export default DeleteAccountConfirmModal;
