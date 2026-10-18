import Image from "next/image";

// Temporary themed landing page — replaced once the storefront is built.
export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-brand-red text-brand-cream">
      <header className="mx-auto flex w-full max-w-6xl items-center gap-3 px-4 py-4">
        <Image
          src="/brand/logo.png"
          alt="MatchBox logo"
          width={44}
          height={44}
          className="rounded-md"
          priority
        />
        <span className="font-display text-2xl tracking-wide">MATCHBOX</span>
      </header>

      <section className="mx-auto w-full max-w-6xl flex-1 px-4 pb-12">
        <div className="overflow-hidden rounded-xl border-2 border-brand-cream/80">
          <Image
            src="/brand/cover.png"
            alt="MatchBox — a row of matches with one lit"
            width={3280}
            height={1248}
            className="h-auto w-full"
            priority
          />
        </div>
        <p className="mt-8 text-center text-lg text-brand-cream/90">
          Cigarettes, lighters &amp; accessories —{" "}
          <span className="font-semibold text-brand-flame">coming soon</span>.
        </p>
      </section>
    </main>
  );
}
