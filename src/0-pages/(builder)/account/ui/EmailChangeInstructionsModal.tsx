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
        "Check your new inbox"
      }
      onClose={onClose}
    >
      <div className="space-y-4 p-2 text-sm">
        <p className="text-(--builder-color-text)">
          {translations["builder.account.email_change_modal_instructions"] ||
            "We've sent a confirmation link to your new email address. Please click the link in that email to finalize the change."}
        </p>

        <div className="bg-(--builder-color-primary)/5 border border-(--builder-color-primary)/10 rounded-lg p-3">
          <p className="text-xs text-(--builder-color-primary) font-medium">
            {translations["builder.account.email_change_modal_note_action"] ||
              "Your account will keep using your old email until you confirm the new one."}
          </p>
        </div>

        <p className="text-xs text-(--builder-color-text-muted)">
          {translations["builder.account.email_change_modal_note"] ||
            "If you do not see the email in a few minutes, please check your spam folder."}
        </p>
      </div>
    </MainModal>
  );
};

export default EmailChangeInstructionsModal;
