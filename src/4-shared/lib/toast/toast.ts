"use client";

import { toast, ToastOptions } from "react-toastify";

const baseOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "auto",
};

export const notify = {
  success(message: string, options?: ToastOptions) {
    toast.success(message, { ...baseOptions, ...options });
  },

  error(message: string, options?: ToastOptions) {
    toast.error(message, { ...baseOptions, ...options });
  },

  info(message: string, options?: ToastOptions) {
    toast.info(message, { ...baseOptions, ...options });
  },
};
