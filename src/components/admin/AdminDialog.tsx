"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function AdminDialog({ title, onClose, children }: { title: string; onClose(): void; children: ReactNode }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title" className="w-full max-w-lg rounded-lg border border-brand-brown/20 bg-brand-cream p-6 shadow-2xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 id="admin-dialog-title" className="font-display text-2xl text-brand-red">{title}</h2>
          <button type="button" onClick={onClose} className="rounded px-2 py-1 text-xl leading-none text-brand-brown hover:bg-brand-brown/10" aria-label="Close dialog">×</button>
        </div>
        <div className="mt-5">{children}</div>
      </section>
    </div>,
    document.body,
  );
}
