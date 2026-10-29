import type { ReactNode } from "react";
import { Reveal } from "@/components/luxury/Reveal";

/** Centered editorial heading for shop listings: eyebrow, large serif title, optional intro. */
export function ListingHeader({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <header className="mx-auto max-w-2xl pt-8 pb-14 text-center sm:pt-14 sm:pb-20">
      <Reveal as="p" className="text-[10px] tracking-[0.35em] text-lux-stone uppercase">
        {kicker}
      </Reveal>
      <Reveal variant="text" as="h1" delay={100} className="mt-4 font-serif text-5xl leading-tight font-light sm:text-6xl">
        {title}
      </Reveal>
      {children && (
        <Reveal as="div" delay={350} className="mt-6 leading-relaxed font-light text-lux-stone">
          {children}
        </Reveal>
      )}
    </header>
  );
}
