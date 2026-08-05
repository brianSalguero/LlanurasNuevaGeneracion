"use client";

import { ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
}: ModalProps) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full
          max-w-3xl
          max-h-[85vh]
          overflow-y-auto
          rounded-2xl
          bg-white
          dark:bg-slate-900
          border
          border-slate-200
          dark:border-slate-700
          shadow-2xl
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              w-10
              h-10
              rounded-full
              hover:bg-slate-100
              dark:hover:bg-slate-800
              transition
              text-2xl
            "
          >
            ×
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="
              bg-amber-500
              hover:bg-amber-600
              text-white
              font-semibold
              px-6
              py-2
              rounded-xl
              transition
            "
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}