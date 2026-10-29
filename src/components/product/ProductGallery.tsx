"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { assetUrl, isUpload } from "@/lib/assets";
import { ProductImage } from "./ProductImage";

const ZOOM = 2.5;

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const src = images[active];

  // Hover zoom for mouse/pen only; touch devices use the full-screen viewer instead.
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  const step = (delta: number) => setActive((i) => (i + delta + images.length) % images.length);

  if (!src) return <ProductImage alt={name} aspect="aspect-[4/5]" />;

  return (
    <div>
      <button
        type="button"
        onClick={() => dialog.current?.showModal()}
        aria-label={`View ${name} full screen`}
        className="relative block aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-(--placeholder-bg)"
      >
        <div className="absolute inset-0" onPointerMove={onPointerMove} onPointerLeave={() => setZoom(null)}>
          <Image
            src={assetUrl(src)}
            alt={name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            unoptimized={!isUpload(src)}
            loading="eager"
            fetchPriority="high"
            className="object-cover transition-transform duration-150 ease-out"
            style={zoom ? { transform: `scale(${ZOOM})`, transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
          />
        </div>
        <span className="pointer-events-none absolute right-2 bottom-2 rounded bg-brand-charcoal/70 px-2 py-1 text-xs text-brand-cream">
          {zoom ? "Click to enlarge" : "Hover to zoom · tap to enlarge"}
        </span>
      </button>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`overflow-hidden rounded-md border-2 ${i === active ? "border-brand-red" : "border-transparent"}`}
            >
              <ProductImage src={img} alt="" sizes="10vw" />
            </button>
          ))}
        </div>
      )}

      {/* Native <dialog>: focus trapping and Esc-to-close come built in. */}
      <dialog
        ref={dialog}
        aria-label={`${name} images`}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto max-h-none max-w-none bg-transparent p-0 backdrop:bg-brand-charcoal/90"
      >
        <div className="relative h-[90vh] w-[94vw] max-w-5xl">
          <Image src={assetUrl(src)} alt={name} fill sizes="94vw" unoptimized={!isUpload(src)} className="object-contain" />
          <button
            type="button"
            onClick={() => dialog.current?.close()}
            aria-label="Close"
            className="absolute top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand-cream text-xl font-bold text-brand-charcoal"
          >
            ×
          </button>
          {images.length > 1 && (
            <>
              <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="absolute top-1/2 left-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream/90 text-xl font-bold">
                ‹
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next image" className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream/90 text-xl font-bold">
                ›
              </button>
              <p className="absolute inset-x-0 bottom-2 text-center text-sm text-brand-cream">
                {active + 1} / {images.length}
              </p>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
