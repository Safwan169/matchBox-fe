"use client";

import Image from "next/image";
import Link from "next/link";
import { Fragment, useCallback, useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { ArrowLine } from "@/components/luxury/icons";
import { assetUrl, isUpload } from "@/lib/assets";

export interface HeroSlide {
  id: string;
  image: string; // "/images/..." (built in) or an uploaded/https image
  alt: string;
  eyebrow?: string;
  title: string;
  /** Words to set in brass italics at the end of the title (the brand slide's "flame."). */
  accent?: string;
  subtitle?: string;
  buttonText?: string;
  link?: string;
  showText: boolean;
  textColor: "ivory" | "brass" | "ink";
  eyebrowColor: "ivory" | "brass" | "ink";
  accentColor: "ivory" | "brass" | "ink";
}

const INTERVAL_MS = 7000;

function Heading({ level, className, style, children }: { level: 1 | 2; className: string; style?: CSSProperties; children: ReactNode }) {
  return level === 1 ? <h1 className={className} style={style}>{children}</h1> : <h2 className={className} style={style}>{children}</h2>;
}
function Cta({ href, children, textColor }: { href: string; children: ReactNode; textColor: HeroSlide["textColor"] }) {
  const colorClass = textColor === "ink"
    ? "border-lux-ink/60 text-lux-ink hover:border-lux-ink hover:bg-lux-ink hover:text-lux-ivory"
    : textColor === "brass"
      ? "border-lux-brass-light/70 text-lux-brass-light hover:border-lux-brass-light hover:bg-lux-brass-light hover:text-lux-ink"
      : "border-lux-ivory/60 text-lux-ivory hover:border-lux-ivory hover:bg-lux-ivory hover:text-lux-ink";
  const outlineButton =
    `group inline-flex items-center gap-3 border px-8 py-4 text-[11px] tracking-[0.3em] whitespace-nowrap uppercase transition-colors duration-500 ${colorClass}`;
  const inner = (
    <>
      {children}
      <ArrowLine className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
    </>
  );
  return href.startsWith("/") ? (
    <Link href={href} className={outlineButton}>
      {inner}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={outlineButton}>
      {inner}
    </a>
  );
}

/**
 * Full-screen hero: slides cross-fade with a slow drift, and each slide's words rise in.
 * Pauses on hover/focus and when the visitor prefers reduced motion.
 */
export function HeroCarousel({ slides, overlay }: { slides: HeroSlide[]; overlay: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;
  const go = useCallback((i: number) => setIndex((i + count) % count), [count]);
  const textColors = {
    ivory: "var(--lux-ivory)",
    brass: "var(--lux-brass-light)",
    ink: "var(--lux-ink)",
  };
  const accentColors = {
    ivory: "var(--lux-ivory)",
    brass: "var(--lux-brass-light)",
    ink: "var(--lux-ink)",
  };

  useEffect(() => {
    if (count < 2 || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  // Next keeps a visited page in the DOM (hidden) after navigating away, so the header can't rely
  // on finding this section; flag the page while the hero is actually shown (see globals.css).
  useEffect(() => {
    if (!overlay) return;
    const root = document.documentElement;
    root.setAttribute("data-hero-overlay", "");
    return () => root.removeAttribute("data-hero-overlay");
  }, [overlay]);

  return (
    <section
      className={`relative grid overflow-hidden bg-lux-ink text-lux-ivory ${overlay ? "-mt-(--header-h) min-h-[100svh]" : "min-h-[80svh]"}`}
      data-header-overlay={overlay ? "" : undefined}
      role="region"
      aria-roledescription="carousel"
      aria-label="Highlights"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((s, i) => {
        const active = i === index;
        const builtIn = s.image.startsWith("/images/");
        const titleLines = s.title.split(/\r?\n/);
        const titleWordCount = titleLines.reduce((count, line) => count + line.split(/\s+/).filter(Boolean).length, 0);
        return (
          <div
            key={s.id}
            className={`relative col-start-1 row-start-1 flex flex-col transition-opacity duration-[1400ms] ease-in-out ${active ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${count}`}
            aria-hidden={!active}
            inert={!active}
          >
            {/* Re-keyed when it becomes active, so the drift and text replay. */}
            <div key={active ? `on-${index}` : "off"} className="relative flex flex-1 flex-col justify-end">
              <Image
                src={builtIn ? s.image : assetUrl(s.image)}
                alt={s.alt}
                fill
                sizes="100vw"
                unoptimized={!builtIn && !isUpload(s.image)}
                preload={i === 0}
                className={`object-cover object-[60%_center] opacity-95 ${active ? "lux-drift" : ""}`}
              />
              <div className={`absolute inset-0 ${s.textColor === "ink" ? "bg-gradient-to-t from-lux-ivory via-lux-ivory/15 to-lux-ivory/40" : "bg-gradient-to-t from-lux-ink via-lux-ink/10 to-lux-ink/30"}`} />
              <div className={`absolute inset-0 ${s.textColor === "ink" ? "bg-gradient-to-r from-lux-ivory/75 to-transparent" : "bg-gradient-to-r from-lux-ink/70 to-transparent"}`} />

              {s.showText && (
                <div className="relative">
                  {/* Top padding keeps the text clear of the fixed header on short screens. */}
                  <div className={`mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8 sm:pb-28 ${overlay ? "pt-[calc(var(--header-h)+2.5rem)]" : "pt-16"}`}>
                    {s.eyebrow && (
                      <p className="lux-up text-[10px] tracking-[0.35em] uppercase" style={{ animationDelay: "300ms", color: textColors[s.eyebrowColor] }}>
                        {s.eyebrow}
                      </p>
                    )}
                    {/* The first slide carries the page's h1. */}
                    <Heading level={i === 0 ? 1 : 2} className="mt-6 max-w-4xl font-serif text-[clamp(2.6rem,min(8vw,11svh),7rem)] leading-[0.98] font-light" style={{ color: textColors[s.textColor] }}>
                      {titleLines.map((line, lineIndex) => {
                        const wordOffset = titleLines.slice(0, lineIndex).reduce((count, previousLine) => count + previousLine.split(/\s+/).filter(Boolean).length, 0);
                        return (
                          <Fragment key={lineIndex}>
                            {lineIndex > 0 && <br />}
                            {line.split(/\s+/).filter(Boolean).map((w, wordIndex) => {
                              const animationIndex = wordOffset + wordIndex;
                              return (
                                <Fragment key={`${lineIndex}-${wordIndex}`}>
                                  {wordIndex > 0 && " "}
                                  <span className="lux-mask">
                                    <span className="lux-rise inline-block" style={{ animationDelay: `${450 + animationIndex * 110}ms` }}>
                                      {w}
                                    </span>
                                  </span>
                                </Fragment>
                              );
                            })}
                          </Fragment>
                        );
                      })}
                      {s.accent && (
                        <>
                          {" "}
                          <span className="lux-mask">
                            <span className="lux-rise inline-block italic" style={{ animationDelay: `${450 + titleWordCount * 110}ms`, color: accentColors[s.accentColor] }}>
                              {s.accent}
                            </span>
                          </span>
                        </>
                      )}
                    </Heading>
                    {s.subtitle && (
                      <p className="lux-up mt-8 max-w-md text-base leading-relaxed font-light whitespace-pre-line" style={{ animationDelay: "1100ms", color: textColors[s.textColor] }}>
                        {s.subtitle}
                      </p>
                    )}
                    {s.link && (
                      <div className="lux-up mt-10" style={{ animationDelay: "1300ms" }}>
                        <Cta href={s.link} textColor={s.textColor}>{s.buttonText || "Discover"}</Cta>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!s.showText && s.link && (
                <div className={`relative flex justify-center pb-24 ${overlay ? "pt-[calc(var(--header-h)+2.5rem)]" : "pt-16"}`}>
                  <Cta href={s.link} textColor={s.textColor}>{s.buttonText || "Discover"}</Cta>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {count > 1 && (
        <div className="absolute right-6 bottom-8 z-20 flex items-center gap-5 sm:right-8 sm:bottom-10">
          <span className="font-serif text-sm tracking-widest text-lux-ivory/80">
            {String(index + 1).padStart(2, "0")} <span className="text-lux-ivory/40">/ {String(count).padStart(2, "0")}</span>
          </span>
          <div className="flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => go(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                className="relative h-6 w-10 before:absolute before:inset-x-0 before:top-1/2 before:h-px before:bg-lux-ivory/30"
              >
                <span className={`absolute inset-x-0 top-1/2 h-px origin-left bg-lux-brass transition-transform duration-700 ${i === index ? "scale-x-100" : "scale-x-0"}`} />
              </button>
            ))}
          </div>
        </div>
      )}

      {count < 2 && (
        <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
          <span className="text-[9px] tracking-[0.35em] text-lux-ivory/60 uppercase">Scroll</span>
          <span className="relative h-12 w-px overflow-hidden bg-lux-ivory/15">
            <span className="lux-cue absolute inset-0 bg-lux-brass" />
          </span>
        </div>
      )}
    </section>
  );
}
