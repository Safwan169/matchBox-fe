import Image from "next/image";
import { assetUrl } from "@/lib/assets";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

// Square product image. Falls back to a branded matchstick illustration.
export function ProductImage({ src, alt, className = "", sizes = "(min-width: 768px) 25vw, 50vw", priority }: Props) {
  return (
    <div className={`relative aspect-square overflow-hidden bg-brand-red ${className}`}>
      {src ? (
        // Images are served by our API; skip the optimizer, which blocks local hosts.
        <Image src={assetUrl(src)} alt={alt} fill sizes={sizes} className="object-cover" unoptimized priority={priority} />
      ) : (
        <svg viewBox="0 0 100 100" role="img" aria-label={alt} className="h-full w-full">
          <rect x="47" y="38" width="6" height="40" rx="2" fill="var(--brand-wood)" />
          <ellipse cx="50" cy="36" rx="6" ry="7" fill="var(--brand-charcoal)" />
          <path d="M50 14 C57 22 58 28 50 32 C42 28 43 22 50 14Z" fill="var(--brand-flame)" />
          <path d="M50 22 C53 26 53 28 50 30 C47 28 47 26 50 22Z" fill="var(--brand-flame-light)" />
        </svg>
      )}
    </div>
  );
}
