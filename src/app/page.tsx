import Image from "next/image";

// Temporary home page — replaced by the storefront home in the next task.
export default function Home() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="overflow-hidden rounded-xl border-2 border-brand-red">
        <Image
          src="/brand/cover.png"
          alt="MatchBox — a row of matches with one lit"
          width={3280}
          height={1248}
          className="h-auto w-full"
          priority
        />
      </div>
    </section>
  );
}
