"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type AlertConfirmTone = "default" | "danger";

export type AlertConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: AlertConfirmTone;
};

type AlertConfirmProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  tone?: AlertConfirmTone;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function AlertConfirm({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = "default",
  onConfirm,
  onCancel,
}: AlertConfirmProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const confirmClassName =
    tone === "danger"
      ? "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700"
      : "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700";

  return (
    <div
      className="fixed inset-0 z-120 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-confirm-title"
      aria-describedby="alert-confirm-description"
    >
      <button
        type="button"
        aria-label="Close confirmation"
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />

      <div className="relative w-full max-w-md rounded-xl bg-white shadow-2xl border border-gray-200 p-5">
        <h3
          id="alert-confirm-title"
          className="text-base font-semibold text-gray-900"
        >
          {title}
        </h3>
        <p
          id="alert-confirm-description"
          className="mt-2 text-sm text-gray-600"
        >
          {message}
        </p>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={confirmClassName}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

type AlertConfirmState = AlertConfirmOptions & {
  title: string;
  confirmLabel: string;
  cancelLabel: string;
  tone: AlertConfirmTone;
};

const DEFAULT_STATE: AlertConfirmState = {
  title: "Please confirm",
  message: "Are you sure?",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  tone: "default",
};

export function useAlertConfirm() {
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const [state, setState] = useState<AlertConfirmState | null>(null);

  const resolve = useCallback((value: boolean) => {
    const resolver = resolverRef.current;
    resolverRef.current = null;
    setState(null);
    resolver?.(value);
  }, []);

  const confirm = useCallback(
    (options: AlertConfirmOptions): Promise<boolean> => {
      return new Promise<boolean>((resolvePromise) => {
        resolverRef.current = resolvePromise;
        setState({
          ...DEFAULT_STATE,
          ...options,
        });
      });
    },
    [],
  );

  useEffect(() => {
    return () => {
      if (resolverRef.current) {
        resolverRef.current(false);
      }
    };
  }, []);

  const confirmDialog = (
    <AlertConfirm
      open={!!state}
      title={state?.title ?? DEFAULT_STATE.title}
      message={state?.message ?? DEFAULT_STATE.message}
      confirmLabel={state?.confirmLabel ?? DEFAULT_STATE.confirmLabel}
      cancelLabel={state?.cancelLabel ?? DEFAULT_STATE.cancelLabel}
      tone={state?.tone ?? DEFAULT_STATE.tone}
      onCancel={() => resolve(false)}
      onConfirm={() => resolve(true)}
    />
  );

  return {
    confirm,
    confirmDialog,
    isOpen: !!state,
  };
}
