"use client";

import { useRef, useState } from "react";
import { ProductImage } from "@/components/product/ProductImage";
import { Alert, Button, errorMessage } from "@/components/ui";
import { api } from "@/lib/api";
import type { ApiItem } from "@/lib/types";

const MAX_IMAGES = 10;

export function ImageUploader({ images, onChange }: { images: string[]; onChange(images: string[]): void }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    const added: string[] = [];
    try {
      for (const file of Array.from(files).slice(0, MAX_IMAGES - images.length)) {
        const form = new FormData();
        form.append("image", file);
        const { data } = await api<ApiItem<{ url: string }>>("/admin/uploads", { method: "POST", body: form });
        added.push(data.url);
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      if (added.length) onChange([...images, ...added]);
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  const move = (from: number, to: number) => {
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div>
      <p className="mb-1 text-sm font-semibold">Images</p>
      <p className="mb-3 text-xs text-brand-brown">The first image is the main photo. JPEG, PNG, WebP or GIF, up to 5 MB each.</p>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {images.map((src, i) => (
          <div key={src} className="group relative overflow-hidden rounded-md border border-brand-brown/20">
            <ProductImage src={src} alt={`Image ${i + 1}`} sizes="120px" />
            {i === 0 && <span className="absolute top-1 left-1 rounded bg-brand-flame px-1.5 text-[10px] font-bold">MAIN</span>}
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-brand-charcoal/70 px-1 text-xs text-white">
              <button type="button" disabled={i === 0} onClick={() => move(i, i - 1)} className="px-1 disabled:opacity-30" aria-label="Move left">←</button>
              <button type="button" onClick={() => onChange(images.filter((_, j) => j !== i))} className="px-1 hover:text-brand-flame" aria-label="Remove image">✕</button>
              <button type="button" disabled={i === images.length - 1} onClick={() => move(i, i + 1)} className="px-1 disabled:opacity-30" aria-label="Move right">→</button>
            </div>
          </div>
        ))}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple hidden onChange={(e) => upload(e.target.files)} />
      <div className="mt-3 flex items-center gap-3">
        <Button type="button" variant="outline" disabled={uploading || images.length >= MAX_IMAGES} onClick={() => input.current?.click()}>
          {uploading ? "Uploading…" : "Upload images"}
        </Button>
        <span className="text-xs text-brand-brown">{images.length}/{MAX_IMAGES}</span>
      </div>
      {error && <div className="mt-2"><Alert>{error}</Alert></div>}
    </div>
  );
}
