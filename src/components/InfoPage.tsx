import type { ReactNode } from "react";
import { Reveal } from "@/components/luxury/Reveal";

/** Simple editorial page for policies and help: eyebrow, serif title, readable text. */
export function InfoPage({ kicker, title, intro, children }: { kicker: string; title: string; intro?: string; children: ReactNode }) {
  return (
    <article className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
      <Reveal as="p" className="text-[10px] tracking-[0.35em] text-lux-stone uppercase">
        {kicker}
      </Reveal>
      <Reveal variant="text" as="h1" delay={100} className="mt-4 font-serif text-5xl leading-tight font-light sm:text-6xl">
        {title}
      </Reveal>
      {intro && (
        <Reveal as="p" delay={300} className="mt-8 font-serif text-2xl leading-snug font-light text-lux-stone">
          {intro}
        </Reveal>
      )}
      <Reveal delay={400}>
        <span className="mt-12 block h-px w-16 bg-lux-brass" />
      </Reveal>
      <Reveal
        delay={450}
        className="mt-12 space-y-6 leading-relaxed font-light text-lux-ink/85 [&_a]:underline [&_a]:decoration-lux-brass [&_a]:underline-offset-4 [&_h2]:mt-14 [&_h2]:font-serif [&_h2]:text-3xl [&_h2]:font-light [&_h2]:text-lux-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2"
      >
        {children}
      </Reveal>
    </article>
  );
}
