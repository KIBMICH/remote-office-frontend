"use client";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type ToastType = "success" | "error" | "info";

export type Toast = {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number; // ms
};

type ToastContextValue = {
  show: (message: string, options?: { type?: ToastType; duration?: number }) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (message: string, options?: { type?: ToastType; duration?: number }) => {
      const id = Math.random().toString(36).slice(2);
      const toast: Toast = {
        id,
        message,
        type: options?.type ?? "info",
        duration: options?.duration ?? 2500,
      };
      setToasts((prev) => [...prev, toast]);
      if (toast.duration && toast.duration > 0) {
        setTimeout(() => remove(id), toast.duration);
      }
    },
    [remove]
  );

  const success = useCallback((message: string, duration?: number) => show(message, { type: "success", duration }), [show]);
  const error = useCallback((message: string, duration?: number) => show(message, { type: "error", duration }), [show]);
  const info = useCallback((message: string, duration?: number) => show(message, { type: "info", duration }), [show]);

  const value = useMemo(() => ({ show, success, error, info }), [show, success, error, info]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onClose }: { toasts: Toast[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`min-w-[220px] max-w-[320px] rounded-md px-3 py-2 shadow-lg border text-sm text-white ${
            t.type === "success" ? "bg-green-600 border-green-700" : t.type === "error" ? "bg-red-600 border-red-700" : "bg-gray-800 border-gray-700"
          }`}
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5">
              {t.type === "success" ? "✅" : t.type === "error" ? "⚠️" : "ℹ️"}
            </span>
            <div className="flex-1">{t.message}</div>
            <button
              onClick={() => onClose(t.id)}
              aria-label="Close notification"
              className="opacity-80 hover:opacity-100"
            >
              ✖
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
