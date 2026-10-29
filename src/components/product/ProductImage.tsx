import Image from "next/image";
import { assetUrl, isUpload } from "@/lib/assets";

interface Props {
  src?: string;
  alt: string;
  className?: string;
  sizes?: string;
  /** Aspect ratio class; square by default (the shop's cards use 4:5). */
  aspect?: string;
  /** Load immediately with high priority (for the main, above-the-fold image). */
  eager?: boolean;
  /** Slow, slight zoom when a parent with the `group` class is hovered (product cards). */
  hoverZoom?: boolean;
}

// Product image. Falls back to a matchstick illustration (--placeholder-bg: red in admin, linen in the shop).
export function ProductImage({ src, alt, className = "", sizes = "(min-width: 768px) 25vw, 50vw", aspect = "aspect-square", eager, hoverZoom }: Props) {
  return (
    <div className={`relative ${aspect} overflow-hidden bg-(--placeholder-bg) ${className}`}>
      {src ? (
        <Image
          src={assetUrl(src)}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-cover ${hoverZoom ? "transition-[scale] duration-[1600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]" : ""}`}
          unoptimized={!isUpload(src)}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
        />
      ) : (
        <svg viewBox="-25 -25 150 150" role="img" aria-label={alt} className="h-full w-full">
          <rect x="48.5" y="40" width="3" height="36" rx="1.5" fill="var(--brand-wood)" />
          <ellipse cx="50" cy="38" rx="4" ry="5" fill="var(--brand-charcoal)" />
          <path d="M50 20 C55 26 56 31 50 34 C44 31 45 26 50 20Z" fill="var(--brand-flame)" />
          <path d="M50 26 C52 29 52 31 50 32.5 C48 31 48 29 50 26Z" fill="var(--brand-flame-light)" />
        </svg>
      )}
    </div>
  );
}
