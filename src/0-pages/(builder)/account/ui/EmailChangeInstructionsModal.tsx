import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import React from "react";

interface EmailChangeInstructionsModalProps {
  open: boolean;
  onClose: () => void;
  translations: Record<string, string>;
}

const EmailChangeInstructionsModal: React.FC<
  EmailChangeInstructionsModalProps
> = ({ open, onClose, translations }) => {
  return (
    <MainModal
      open={open}
      title={
        translations["builder.account.email_change_modal_title"] ||
        "Confirm your email change"
      }
      onClose={onClose}
    >
      <div className="space-y-4 p-2 text-sm">
        <p>
          {translations["builder.account.email_change_modal_instructions"] ||
            "To complete your email change, please confirm the links sent to BOTH your old and new email addresses. Your email will not change until both are confirmed."}
        </p>
        <ul className="list-disc pl-5">
          <li>
            {translations["builder.account.email_change_modal_step_old"] ||
              "Check your old email inbox and confirm the link."}
          </li>
          <li>
            {translations["builder.account.email_change_modal_step_new"] ||
              "Check your new email inbox and confirm the link."}
          </li>
        </ul>
        <p className="text-xs text-(--builder-color-text-muted)">
          {translations["builder.account.email_change_modal_note"] ||
            "If you do not see the emails, please check your spam folder."}
        </p>
      </div>
    </MainModal>
  );
};

export default EmailChangeInstructionsModal;
