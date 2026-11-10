"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function AdminDialog({ title, onClose, children, className = "" }: { title: string; onClose(): void; children: ReactNode; className?: string }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  if (typeof document === "undefined") return null;
  const portalTarget = document.querySelector(".admin-theme") ?? document.body;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-lux-ink/45 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title" className={`flex max-h-[92dvh] w-full flex-col overflow-hidden border border-lux-ink/15 bg-lux-ivory ${className || "max-w-lg"}`}>
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-lux-ink/10 px-5 py-4 sm:px-7">
          <h2 id="admin-dialog-title" className="font-serif text-2xl font-light text-lux-ink sm:text-3xl">{title}</h2>
          <button type="button" onClick={onClose} className="flex size-10 shrink-0 items-center justify-center border border-lux-ink/15 text-xl leading-none text-lux-stone transition-colors hover:border-lux-ink hover:text-lux-ink" aria-label="Close dialog">×</button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">{children}</div>
      </section>
    </div>,
    portalTarget,
  );
}
