import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { LuxBottomBar } from "@/components/luxury/LuxBottomBar";
import { LuxHeader } from "@/components/luxury/LuxHeader";
import { LuxProductCard } from "@/components/luxury/LuxProductCard";
import { Reveal } from "@/components/luxury/Reveal";
import { ArrowLine, BoxLine, FlameMark, HandLine, SealLine } from "@/components/luxury/icons";
import { whatsappHref } from "@/lib/contact";
import { getCategories, getProductList, getStoreSettings } from "@/lib/store-data";

// Sample photography (Unsplash) until MatchBox has its own; see public/preview/CREDITS.txt.
const PHOTOS = ["/preview/lighter-open.jpg", "/preview/cigar-glass.jpg", "/preview/lighter-brass.jpg", "/preview/lighter-wood.jpg", "/preview/smoke.jpg"];

const eyebrow = "text-[10px] tracking-[0.35em] uppercase";
const outlineButton =
  "group inline-flex items-center gap-3 border px-8 py-4 whitespace-nowrap text-[11px] tracking-[0.3em] uppercase transition-colors duration-500";

export default function LuxuryHomePreview() {
  return (
    <>
      <Suspense fallback={<LuxHeader links={[]} />}>
        <Header />
      </Suspense>
      <main className="flex-1">
        <Hero />
        <Intro />
        <Suspense fallback={<div className="h-[60vh]" />}>
          <Collections />
        </Suspense>
        <Suspense fallback={<div className="h-[80vh]" />}>
          <Curated />
        </Suspense>
        <Editorial />
        <Services />
        <Quote />
        <Suspense fallback={null}>
          <Concierge />
        </Suspense>
      </main>
      <Footer />
      <div aria-hidden className="h-[calc(4rem+env(safe-area-inset-bottom))] bg-lux-ink md:hidden" />
      <LuxBottomBar />
    </>
  );
}

async function Header() {
  const categories = await getCategories();
  return <LuxHeader links={[{ href: "/products", label: "Shop" }, ...categories.slice(0, 3).map((c) => ({ href: `/categories/${c.slug}`, label: c.name }))]} />;
}

function Hero() {
  const lines = ["The quiet", "art of the"];
  return (
    <section className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-lux-ink text-lux-ivory">
      <Image src="/preview/hero-flame.jpg" alt="" fill preload sizes="100vw" className="lux-drift object-cover object-[60%_center] opacity-95" />
      <div className="absolute inset-0 bg-gradient-to-t from-lux-ink via-lux-ink/10 to-lux-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-lux-ink/70 to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8 sm:pb-28">
        <p className={`${eyebrow} lux-up text-lux-brass-light`} style={{ animationDelay: "300ms" }}>
          MatchBox &nbsp;·&nbsp; Dhaka
        </p>
        <h1 className="mt-6 font-serif text-[clamp(3.2rem,9vw,7.5rem)] leading-[0.95] font-light">
          {lines.map((line, i) => (
            <span key={line} className="block overflow-hidden pb-1">
              <span className="lux-rise block" style={{ animationDelay: `${450 + i * 140}ms` }}>
                {line}
              </span>
            </span>
          ))}
          <span className="block overflow-hidden pb-2">
            <span className="lux-rise block text-lux-brass-light italic" style={{ animationDelay: "730ms" }}>
              flame.
            </span>
          </span>
        </h1>
        <p className="lux-up mt-8 max-w-md text-base leading-relaxed font-light text-lux-ivory/80" style={{ animationDelay: "1100ms" }}>
          Lighters, tobacco and smoking accessories, chosen for their craft and delivered with discretion.
        </p>
        <div className="lux-up mt-10 flex flex-wrap items-center gap-6" style={{ animationDelay: "1300ms" }}>
          <Link href="/products" className={`${outlineButton} border-lux-ivory/60 hover:border-lux-ivory hover:bg-lux-ivory hover:text-lux-ink`}>
            Explore the collection
            <ArrowLine className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="lux-fade absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex" style={{ animationDelay: "1800ms" }}>
        <span className="text-[9px] tracking-[0.35em] text-lux-ivory/60 uppercase">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-lux-ivory/15">
          <span className="lux-cue absolute inset-0 bg-lux-brass" />
        </span>
      </div>
    </section>
  );
}

function Intro() {
  return (
    <section className="px-6 py-28 text-center sm:py-36">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <FlameMark className="mx-auto h-6 w-6 text-lux-brass" />
        </Reveal>
        <Reveal variant="text" as="p" stagger={28} className="mt-8 font-serif text-[clamp(1.6rem,3.6vw,2.6rem)] leading-snug font-light">
          A considered selection for those who appreciate the <em className="text-lux-oxblood">ritual</em> — from the weight of a fine lighter to the
          last detail of the case it rests in.
        </Reveal>
        <Reveal delay={600}>
          <span className="mx-auto mt-10 block h-px w-16 bg-lux-brass" />
        </Reveal>
      </div>
    </section>
  );
}

async function Collections() {
  const categories = (await getCategories()).slice(0, 4);
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-28 sm:px-8 sm:pb-36">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Reveal as="p" className={`${eyebrow} text-lux-stone`}>
            Explore
          </Reveal>
          <Reveal variant="text" as="h2" delay={100} className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            The Collections
          </Reveal>
        </div>
        <Reveal delay={300}>
          <Link href="/categories" className="group flex items-center gap-3 text-[11px] tracking-[0.3em] whitespace-nowrap uppercase">
            All collections <ArrowLine className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>

      <div className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {categories.map((c, i) => (
          <Reveal key={c.id} variant="card" delay={i * 150} className="w-[72vw] shrink-0 snap-start sm:w-auto">
            <Link href={`/categories/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-lux-coal">
              <div className="lux-card-media absolute inset-0">
                <Image
                  src={PHOTOS[i % PHOTOS.length]}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 72vw"
                  className="object-cover opacity-85 transition-[scale,opacity] duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07] group-hover:opacity-100"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-lux-ink/85 via-lux-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-lux-ivory">
                <p className="text-[10px] tracking-[0.3em] text-lux-brass-light uppercase">0{i + 1}</p>
                <h3 className="mt-2 font-serif text-3xl font-light">{c.name}</h3>
                <span className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase">
                  Discover
                  <span className="h-px w-6 bg-lux-ivory transition-all duration-700 group-hover:w-12" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

async function Curated() {
  const [featured, categories] = await Promise.all([getProductList("featured=true&limit=4"), getCategories()]);
  const products = featured.length > 0 ? featured : await getProductList("limit=4");
  if (products.length === 0) return null;
  const categoryName = new Map(categories.map((c) => [c.id, c.name]));

  return (
    <section className="bg-lux-linen/60 py-28 sm:py-36">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="text-center">
          <Reveal as="p" className={`${eyebrow} text-lux-stone`}>
            Selected for you
          </Reveal>
          <Reveal variant="text" as="h2" delay={100} className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            The Curated Edit
          </Reveal>
        </div>
        <div className="-mx-6 mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {products.map((p, i) => (
            <Reveal key={p.id} variant="card" delay={i * 150} className="w-[68vw] shrink-0 snap-start sm:w-auto">
              <LuxProductCard product={p} category={categoryName.get(p.categoryId)} sample={PHOTOS[(i + 2) % PHOTOS.length]} preferSample />
            </Reveal>
          ))}
        </div>
        <Reveal delay={300} className="mt-16 text-center">
          <Link href="/products" className={`${outlineButton} border-lux-ink/40 hover:border-lux-ink hover:bg-lux-ink hover:text-lux-ivory`}>
            View all pieces
            <ArrowLine className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Editorial() {
  return (
    <section className="bg-lux-ink text-lux-ivory">
      <div className="mx-auto grid max-w-7xl items-center lg:grid-cols-2">
        <Reveal variant="card" className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[720px]">
          <div className="lux-card-media absolute inset-0">
            <Image src="/preview/cigar-glass.jpg" alt="A cigar resting across a glass" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
        <div className="px-6 py-20 sm:px-16 lg:py-0">
          <Reveal as="p" delay={200} className={`${eyebrow} text-lux-brass-light`}>
            The Ritual
          </Reveal>
          <Reveal variant="text" as="h2" delay={300} className="mt-5 font-serif text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[1.05] font-light">
            Made for the moments worth <em className="text-lux-brass-light">slowing down</em> for.
          </Reveal>
          <Reveal as="p" delay={700} className="mt-8 max-w-md leading-relaxed font-light text-lux-ivory/75">
            Every piece in our collection is chosen by hand — refillable lighters built to last a lifetime, cases that age beautifully, and the
            accessories that complete the ritual.
          </Reveal>
          <Reveal delay={850}>
            <Link href="/products" className="group mt-10 inline-flex items-center gap-3 text-[11px] tracking-[0.3em] text-lux-brass-light uppercase">
              Discover the lighters
              <span className="h-px w-8 bg-lux-brass-light transition-all duration-700 group-hover:w-14" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    { icon: <SealLine className="h-8 w-8" />, title: "Authenticity", text: "Genuine products only, sourced from trusted distributors." },
    { icon: <BoxLine className="h-8 w-8" />, title: "Discreet delivery", text: "Plain, sealed packaging to your door across Bangladesh." },
    { icon: <HandLine className="h-8 w-8" />, title: "Cash on delivery", text: "Pay only when your order is in your hands." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
      <div className="grid gap-14 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-lux-ink/10">
        {items.map((it, i) => (
          <div key={it.title} className="px-6 text-center sm:px-10">
            <Reveal delay={i * 150}>
              <span className="inline-block text-lux-brass">{it.icon}</span>
            </Reveal>
            <Reveal variant="text" as="h3" delay={i * 150 + 150} className="mt-6 font-serif text-2xl font-light">
              {it.title}
            </Reveal>
            <Reveal as="p" delay={i * 150 + 300} className="mx-auto mt-3 max-w-xs text-sm leading-relaxed font-light text-lux-stone">
              {it.text}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}

function Quote() {
  return (
    <section className="relative overflow-hidden bg-lux-ink py-36 text-center text-lux-ivory sm:py-48">
      <Image src="/preview/smoke.jpg" alt="" fill sizes="100vw" className="object-cover opacity-45" />
      <div className="absolute inset-0 bg-lux-ink/40" />
      <div className="relative mx-auto max-w-4xl px-6">
        <Reveal variant="text" as="p" stagger={90} className="font-serif text-[clamp(2rem,5vw,4rem)] leading-tight font-light italic">
          “Some pleasures are meant to be savoured slowly.”
        </Reveal>
        <Reveal delay={900}>
          <span className="mx-auto mt-10 block h-px w-16 bg-lux-brass" />
        </Reveal>
      </div>
    </section>
  );
}

async function Concierge() {
  const { whatsapp } = await getStoreSettings();
  return (
    <section className="px-6 py-28 text-center sm:py-36">
      <div className="mx-auto max-w-2xl">
        <Reveal as="p" className={`${eyebrow} text-lux-stone`}>
          Private client service
        </Reveal>
        <Reveal variant="text" as="h2" delay={100} className="mt-4 font-serif text-4xl font-light sm:text-5xl">
          At your service
        </Reveal>
        <Reveal as="p" delay={400} className="mt-6 leading-relaxed font-light text-lux-stone">
          Looking for something particular, or a gift? Our team will gladly help you choose — usually within the hour.
        </Reveal>
        <Reveal delay={550} className="mt-10">
          <a
            href={whatsapp ? whatsappHref(whatsapp, "Hello MatchBox, I'd like some help choosing.") : "/products"}
            target={whatsapp ? "_blank" : undefined}
            rel={whatsapp ? "noopener noreferrer" : undefined}
            className={`${outlineButton} border-lux-ink bg-lux-ink text-lux-ivory hover:bg-transparent hover:text-lux-ink`}
          >
            {whatsapp ? "Message us on WhatsApp" : "Browse the collection"}
            <ArrowLine className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  const columns = [
    { title: "Shop", links: [["All pieces", "/products"], ["Collections", "/categories"], ["Offers", "/products?onSale=true"]] },
    { title: "Client care", links: [["My account", "/account"], ["My orders", "/orders"], ["Bag", "/cart"]] },
  ] as const;
  return (
    <footer className="bg-lux-ink text-lux-ivory/70">
      <div className="mx-auto max-w-7xl px-6 pt-20 pb-10 sm:px-8">
        <div className="grid gap-12 border-b border-lux-ivory/10 pb-16 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <FlameMark className="h-5 w-5 text-lux-brass" />
            <p className="mt-4 font-serif text-3xl tracking-[0.35em] text-lux-ivory">MATCHBOX</p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed font-light">Lighters, tobacco and smoking accessories. Dhaka, Bangladesh.</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[10px] tracking-[0.35em] text-lux-brass-light uppercase">{col.title}</p>
              <ul className="mt-6 space-y-3 text-sm font-light">
                {col.links.map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="transition-colors duration-300 hover:text-lux-ivory">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3 pt-8 text-[11px] tracking-wide font-light sm:flex-row sm:justify-between">
          <p>© MatchBox. All rights reserved.</p>
          <p>For adults aged 18 and over. Please smoke responsibly.</p>
        </div>
      </div>
    </footer>
  );
}
