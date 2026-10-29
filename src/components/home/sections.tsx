import Image from "next/image";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { ArrowLine, BoxLine, FlameMark, HandLine, SealLine } from "@/components/luxury/icons";
import { Reveal } from "@/components/luxury/Reveal";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/ProductCard";
import { assetUrl, isUpload } from "@/lib/assets";
import { whatsappHref } from "@/lib/contact";
import { getCategories, getProductList, getPromotions, getStoreSettings } from "@/lib/store-data";
import type { HomeSection } from "@/lib/types";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";

// Built-in editorial photography (Unsplash, see public/images/CREDITS.txt), used until the
// owner uploads their own.
const PHOTOS = ["/images/lighter-open.jpg", "/images/cigar-glass.jpg", "/images/lighter-brass.jpg", "/images/lighter-wood.jpg", "/images/smoke.jpg"];

const eyebrow = "text-[10px] tracking-[0.35em] uppercase";
const outlineButton =
  "group inline-flex items-center gap-3 border px-8 py-4 text-[11px] tracking-[0.3em] whitespace-nowrap uppercase transition-colors duration-500";
const arrow = <ArrowLine className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />;

/** An image path from the admin ("/uploads/…" or https) or a built-in "/images/…" photo. */
function Photo({ src, alt, sizes, className = "" }: { src: string; alt: string; sizes: string; className?: string }) {
  const builtIn = src.startsWith("/images/");
  return <Image src={builtIn ? src : assetUrl(src)} alt={alt} fill sizes={sizes} unoptimized={!builtIn && !isUpload(src)} className={`object-cover ${className}`} />;
}

function SmartLink({ href, className, children }: { href: string; className: string; children: ReactNode }) {
  return href.startsWith("/") ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}

/** Eyebrow + serif heading (words rise in) + optional "view all" link. */
function SectionHeading({ kicker, title, href, linkText = "View all", center = false }: { kicker: string; title: string; href?: string; linkText?: string; center?: boolean }) {
  if (center) {
    return (
      <div className="text-center">
        <Reveal as="p" className={`${eyebrow} text-lux-stone`}>
          {kicker}
        </Reveal>
        {title && (
          <Reveal variant="text" as="h2" delay={100} className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            {title}
          </Reveal>
        )}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <Reveal as="p" className={`${eyebrow} text-lux-stone`}>
          {kicker}
        </Reveal>
        {title && (
          <Reveal variant="text" as="h2" delay={100} className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            {title}
          </Reveal>
        )}
      </div>
      {href && (
        <Reveal delay={300}>
          <Link href={href} className="group flex items-center gap-3 text-[11px] tracking-[0.3em] whitespace-nowrap uppercase">
            {linkText} {arrow}
          </Link>
        </Reveal>
      )}
    </div>
  );
}

/** Renders one admin-configured section. `first` lets a hero sit under the transparent header. */
export function HomeSectionView({ section, first = false }: { section: HomeSection; first?: boolean }) {
  const { type, title, config } = section;
  const limit = config.limit ?? 8;

  switch (type) {
    case "hero":
      return (
        <Suspense fallback={<DefaultHero overlay={first} />}>
          <Hero overlay={first} />
        </Suspense>
      );
    case "categories":
      return (
        <section className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
          <SectionHeading kicker="Explore" title={title} href="/categories" linkText="All collections" />
          <Suspense fallback={<div className="mt-12 aspect-[4/1] bg-lux-ink/5" />}>
            <CategoryTiles />
          </Suspense>
        </section>
      );
    case "featured_products":
      return <ProductsSection kicker="Selected for you" title={title} query={`featured=true&limit=${limit}`} href="/products" count={limit} tinted />;
    case "new_arrivals":
      return <ProductsSection kicker="Just arrived" title={title} query={`sort=newest&limit=${limit}`} href="/products?sort=newest" count={limit} />;
    case "on_sale":
      return <ProductsSection kicker="Offers" title={title} query={`onSale=true&limit=${limit}`} href="/products?onSale=true" count={limit} />;
    case "category_products":
      return config.categorySlug ? (
        <ProductsSection
          kicker="The collection"
          title={title}
          query={`category=${encodeURIComponent(config.categorySlug)}&limit=${limit}`}
          href={`/categories/${config.categorySlug}`}
          count={limit}
        />
      ) : null;
    case "banner":
      return config.image ? <Banner image={config.image} link={config.link ?? ""} title={title} /> : null;
    case "text":
      return <Statement title={title} body={config.body ?? ""} />;
    case "editorial":
      return <Editorial title={title} body={config.body ?? ""} image={config.image || "/images/cigar-glass.jpg"} link={config.link ?? ""} linkText={config.linkText ?? ""} />;
    case "services":
      return <Services title={title} />;
    case "quote":
      return <Quote text={config.body ?? ""} image={config.image || "/images/smoke.jpg"} />;
    case "contact":
      return (
        <Suspense fallback={null}>
          <Concierge title={title} body={config.body ?? ""} />
        </Suspense>
      );
    default:
      return null;
  }
}

// ---------- Hero ----------

const BRAND_SLIDE: HeroSlide = {
  id: "brand",
  image: "/images/hero-flame.jpg",
  alt: "A lighter flame glowing in the dark",
  eyebrow: "MatchBox · Dhaka",
  title: "The quiet art of the",
  accent: "flame.",
  subtitle: "Lighters, tobacco and smoking accessories, chosen for their craft and delivered with discretion.",
  buttonText: "Explore the collection",
  link: "/products",
  showText: true,
};

async function Hero({ overlay }: { overlay: boolean }) {
  const promotions = await getPromotions();
  // The brand slide always leads; promotions from Admin → Promotions follow it.
  const slides: HeroSlide[] = [
    BRAND_SLIDE,
    ...promotions.map((p) => ({
      id: p.id,
      image: p.image,
      alt: p.title,
      title: p.title,
      subtitle: p.subtitle,
      buttonText: p.buttonText,
      link: p.link,
      showText: p.showText,
    })),
  ];
  return <HeroCarousel slides={slides} overlay={overlay} />;
}

export function DefaultHero({ overlay = true }: { overlay?: boolean }) {
  return <HeroCarousel slides={[BRAND_SLIDE]} overlay={overlay} />;
}

// ---------- Collections and products ----------

export async function CategoryTiles() {
  const categories = await getCategories();
  if (categories.length === 0) return <p className="mt-12 text-lux-stone">Collections are coming soon.</p>;

  return (
    <div className="-mx-6 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
      {categories.map((c, i) => (
        <Reveal key={c.id} variant="card" delay={(i % 4) * 150} className="w-[72vw] shrink-0 snap-start sm:w-auto">
          <Link href={`/categories/${c.slug}`} className="group relative block aspect-[3/4] overflow-hidden bg-lux-coal">
            <div className="lux-card-media absolute inset-0">
              <Photo
                src={c.image ?? PHOTOS[i % PHOTOS.length]}
                alt=""
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 72vw"
                className="opacity-85 transition-[scale,opacity] duration-[1800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07] group-hover:opacity-100"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-lux-ink/85 via-lux-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-lux-ivory">
              <p className="text-[10px] tracking-[0.3em] text-lux-brass-light uppercase">{String(i + 1).padStart(2, "0")}</p>
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
  );
}

function ProductsSection({ kicker, title, query, href, count, tinted = false }: { kicker: string; title: string; query: string; href: string; count: number; tinted?: boolean }) {
  return (
    <section className={tinted ? "bg-lux-linen/60" : ""}>
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
        <SectionHeading kicker={kicker} title={title} center />
        <div className="mt-14">
          <Suspense fallback={<ProductGridSkeleton count={Math.min(count, 4)} />}>
            <ProductsFor query={query} />
          </Suspense>
        </div>
        <Reveal delay={200} className="mt-16 text-center">
          <Link href={href} className={`${outlineButton} border-lux-ink/40 hover:border-lux-ink hover:bg-lux-ink hover:text-lux-ivory`}>
            View all {arrow}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

async function ProductsFor({ query }: { query: string }) {
  const products = await getProductList(query);
  if (products.length === 0) return <p className="text-center text-lux-stone">New pieces are on their way.</p>;
  return <ProductGrid products={products} />;
}

// ---------- Editorial blocks ----------

function Banner({ image, link, title }: { image: string; link: string; title: string }) {
  const img = (
    <Reveal variant="card" className="relative aspect-[16/7] overflow-hidden bg-lux-coal sm:aspect-[16/5]">
      <div className="lux-card-media absolute inset-0">
        <Photo src={image} alt={title || "Promotion"} sizes="(min-width: 1280px) 1216px, 100vw" />
      </div>
    </Reveal>
  );
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-12 sm:px-8">
      {link ? (
        <SmartLink href={link} className="block transition-opacity duration-500 hover:opacity-90">
          {img}
        </SmartLink>
      ) : (
        img
      )}
    </section>
  );
}

function Statement({ title, body }: { title: string; body: string }) {
  return (
    <section className="px-6 py-24 text-center sm:py-32">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <FlameMark className="mx-auto h-6 w-6 text-lux-brass" />
        </Reveal>
        {title && (
          <Reveal as="p" delay={100} className={`${eyebrow} mt-8 text-lux-stone`}>
            {title}
          </Reveal>
        )}
        <Reveal variant="text" as="p" stagger={28} delay={150} className="mt-6 font-serif text-[clamp(1.6rem,3.6vw,2.6rem)] leading-snug font-light whitespace-pre-line">
          {body}
        </Reveal>
        <Reveal delay={600}>
          <span className="mx-auto mt-10 block h-px w-16 bg-lux-brass" />
        </Reveal>
      </div>
    </section>
  );
}

function Editorial({ title, body, image, link, linkText }: { title: string; body: string; image: string; link: string; linkText: string }) {
  return (
    <section className="bg-lux-ink text-lux-ivory">
      <div className="mx-auto grid max-w-7xl items-center lg:grid-cols-2">
        <Reveal variant="card" className="relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:h-[720px]">
          <div className="lux-card-media absolute inset-0">
            <Photo src={image} alt="" sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        </Reveal>
        <div className="px-6 py-20 sm:px-16 lg:py-0">
          <Reveal as="p" delay={200} className={`${eyebrow} text-lux-brass-light`}>
            The Ritual
          </Reveal>
          {title && (
            <Reveal variant="text" as="h2" delay={300} className="mt-5 font-serif text-[clamp(2.4rem,4.5vw,3.8rem)] leading-[1.05] font-light">
              {title}
            </Reveal>
          )}
          {body && (
            <Reveal as="p" delay={700} className="mt-8 max-w-md leading-relaxed font-light whitespace-pre-line text-lux-ivory/75">
              {body}
            </Reveal>
          )}
          {link && (
            <Reveal delay={850}>
              <SmartLink href={link} className="group mt-10 inline-flex items-center gap-3 text-[11px] tracking-[0.3em] text-lux-brass-light uppercase">
                {linkText || "Discover"}
                <span className="h-px w-8 bg-lux-brass-light transition-all duration-700 group-hover:w-14" />
              </SmartLink>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

const PROMISES = [
  { icon: <SealLine className="h-8 w-8" />, title: "Authenticity", text: "Genuine products only, sourced from trusted distributors." },
  { icon: <BoxLine className="h-8 w-8" />, title: "Discreet delivery", text: "Plain, sealed packaging to your door across Bangladesh." },
  { icon: <HandLine className="h-8 w-8" />, title: "Cash on delivery", text: "Pay only when your order is in your hands." },
];

function Services({ title }: { title: string }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-32">
      {title && (
        <Reveal variant="text" as="h2" className="mb-16 text-center font-serif text-4xl font-light sm:text-5xl">
          {title}
        </Reveal>
      )}
      <div className="grid gap-14 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-lux-ink/10">
        {PROMISES.map((it, i) => (
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

function Quote({ text, image }: { text: string; image: string }) {
  return (
    <section className="relative overflow-hidden bg-lux-ink py-36 text-center text-lux-ivory sm:py-48">
      <Photo src={image} alt="" sizes="100vw" className="opacity-45" />
      <div className="absolute inset-0 bg-lux-ink/40" />
      <div className="relative mx-auto max-w-4xl px-6">
        <Reveal variant="text" as="p" stagger={90} className="font-serif text-[clamp(2rem,5vw,4rem)] leading-tight font-light italic">
          {`“${text.replace(/^[“"]|[”"]$/g, "")}”`}
        </Reveal>
        <Reveal delay={900}>
          <span className="mx-auto mt-10 block h-px w-16 bg-lux-brass" />
        </Reveal>
      </div>
    </section>
  );
}

async function Concierge({ title, body }: { title: string; body: string }) {
  const { whatsapp } = await getStoreSettings();
  return (
    <section className="px-6 py-24 text-center sm:py-32">
      <div className="mx-auto max-w-2xl">
        <Reveal as="p" className={`${eyebrow} text-lux-stone`}>
          Private client service
        </Reveal>
        <Reveal variant="text" as="h2" delay={100} className="mt-4 font-serif text-4xl font-light sm:text-5xl">
          {title || "At your service"}
        </Reveal>
        <Reveal as="p" delay={400} className="mt-6 leading-relaxed font-light text-lux-stone">
          {body || "Looking for something particular, or a gift? Our team will gladly help you choose."}
        </Reveal>
        <Reveal delay={550} className="mt-10">
          <SmartLink
            href={whatsapp ? whatsappHref(whatsapp, "Hello MatchBox, I'd like some help choosing.") : "/products"}
            className={`${outlineButton} border-lux-ink bg-lux-ink text-lux-ivory hover:bg-transparent hover:text-lux-ink`}
          >
            {whatsapp ? "Message us on WhatsApp" : "Browse the collection"} {arrow}
          </SmartLink>
        </Reveal>
      </div>
    </section>
  );
}
