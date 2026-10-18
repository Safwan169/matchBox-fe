"use client";

import { useState } from "react";
import { ProductImage } from "./ProductImage";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <ProductImage
        src={images[active]}
        alt={name}
        className="rounded-lg"
        sizes="(min-width: 768px) 50vw, 100vw"
        priority
      />
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              className={`overflow-hidden rounded-md border-2 ${i === active ? "border-brand-red" : "border-transparent"}`}
            >
              <ProductImage src={src} alt="" sizes="10vw" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
