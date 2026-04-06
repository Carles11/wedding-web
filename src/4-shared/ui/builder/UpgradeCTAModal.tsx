"use client";

import MainModal from "@/4-shared/ui/commons/modals/MainModal";
import { BuilderButton } from "./BuilderButton";

type UpgradeCTAModalProps = {
  open: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  title: string;
  description: string;
  cancelLabel?: string;
  upgradeLabel?: string;
};

export function UpgradeCTAModal({
  open,
  onClose,
  onUpgrade,
  title,
  description,
  cancelLabel = "Cancel",
  upgradeLabel = "Upgrade to Premium",
}: UpgradeCTAModalProps) {
  return (
    <MainModal open={open} title={title} onClose={onClose}>
      <p className="text-sm text-gray-700 mb-5">{description}</p>
      <div className="flex justify-end gap-3">
        <BuilderButton type="button" variant="secondary" onClick={onClose}>
          {cancelLabel}
        </BuilderButton>
        <BuilderButton type="button" onClick={onUpgrade}>
          {upgradeLabel}
        </BuilderButton>
      </div>
    </MainModal>
  );
}
