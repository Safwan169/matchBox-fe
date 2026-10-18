"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { assetUrl } from "@/lib/assets";
import type { Promotion } from "@/lib/types";

const INTERVAL_MS = 6000;

function CtaLink({ href, children }: { href: string; children: ReactNode }) {
  const className =
    "inline-block rounded-md bg-brand-flame px-4 py-2 text-sm font-bold text-brand-charcoal shadow hover:bg-brand-flame-light sm:px-6 sm:py-2.5 sm:text-base";
  return href.startsWith("/") ? (
    <Link href={href} className={className}>{children}</Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>{children}</a>
  );
}

/** Rotating promotion banners. Pauses on hover/focus and when the user prefers reduced motion. */
export function HeroCarousel({ promotions }: { promotions: Promotion[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = promotions.length;

  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  return (
    <div
      className="relative overflow-hidden rounded-xl bg-brand-red"
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${index * 100}%)` }}>
        {promotions.map((p, i) => (
          <div
            key={p.id}
            className="relative aspect-[1640/624] w-full shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={i !== index}
            inert={i !== index}
          >
            <Image
              src={assetUrl(p.image)}
              alt={p.title}
              fill
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover"
              unoptimized
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : "auto"}
            />
            {p.showText ? (
              <div className="absolute inset-0 flex flex-col items-start justify-center gap-2 bg-linear-to-r from-brand-charcoal/75 via-brand-charcoal/35 to-transparent p-5 sm:gap-3 sm:p-12">
                <h2 className="max-w-[70%] font-display text-xl leading-tight text-brand-cream sm:text-4xl lg:text-5xl">{p.title}</h2>
                {p.subtitle && <p className="max-w-[60%] text-sm text-brand-cream/90 sm:text-lg">{p.subtitle}</p>}
                {p.link && p.buttonText && (
                  <div className="mt-1 sm:mt-3">
                    <CtaLink href={p.link}>{p.buttonText}</CtaLink>
                  </div>
                )}
              </div>
            ) : (
              p.link && (
                <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2">
                  <CtaLink href={p.link}>{p.buttonText || "Shop now"}</CtaLink>
                </div>
              )
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={() => go(index - 1)}
            aria-label="Previous promotion"
            className="absolute top-1/2 left-2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream/80 text-lg font-bold text-brand-charcoal hover:bg-brand-cream sm:flex"
          >
            ‹
          </button>
          <button
            onClick={() => go(index + 1)}
            aria-label="Next promotion"
            className="absolute top-1/2 right-2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-cream/80 text-lg font-bold text-brand-charcoal hover:bg-brand-cream sm:flex"
          >
            ›
          </button>
          <div className="absolute inset-x-0 bottom-2 flex justify-center gap-2 sm:bottom-3">
            {promotions.map((p, i) => (
              <button
                key={p.id}
                onClick={() => go(i)}
                aria-label={`Show promotion ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all ${i === index ? "w-6 bg-brand-flame" : "w-2.5 bg-brand-cream/70 hover:bg-brand-cream"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
