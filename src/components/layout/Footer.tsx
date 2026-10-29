import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import {
  FacebookMark,
  FlameMark,
  InstagramMark,
  TikTokMark,
} from "@/components/luxury/icons";
import { Reveal } from "@/components/luxury/Reveal";
import { formatPhone, telHref, whatsappHref } from "@/lib/contact";
import { getCategories, getStoreSettings } from "@/lib/store-data";

const heading = "text-[11px] tracking-[0.35em] text-lux-ink uppercase";
const linkClass =
  "text-[15px] font-light text-lux-stone transition-colors duration-300 hover:text-lux-ink";

// Cached so the static shell doesn't read the clock on every render (cacheComponents).
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

type Social = {
  href: string;
  label: string;
  icon: ReactNode;
  className: string;
};

/** Footer: logo, brand line and social buttons, three link columns, a faint wordmark behind, words rising in. */
export async function Footer() {
  const [settings, categories, year] = await Promise.all([
    getStoreSettings(),
    getCategories(),
    currentYear(),
  ]);

  // The first configured network gets the full-width button, the rest share a row.
  const socials = (
    [
      settings.tiktokUrl && {
        href: settings.tiktokUrl,
        label: "TikTok",
        icon: <TikTokMark />,
        className: "bg-black text-white",
      },
      settings.instagramUrl && {
        href: settings.instagramUrl,
        label: "Instagram",
        icon: <InstagramMark />,
        className:
          "bg-[linear-gradient(45deg,#f58529,#dd2a7b_50%,#8134af)] text-white",
      },
      settings.facebookUrl && {
        href: settings.facebookUrl,
        label: "Facebook",
        icon: <FacebookMark />,
        className: "bg-[#0e5fd8] text-white",
      },
      settings.whatsapp && {
        href: whatsappHref(settings.whatsapp, "Hello MatchBox!"),
        label: "WhatsApp",
        icon: <WhatsAppIcon className="h-4 w-4" />,
        className: "bg-[#075e54] text-white",
      },
    ] as (Social | "")[]
  ).filter((s): s is Social => s !== "");

  const contactHref = settings.whatsapp
    ? whatsappHref(settings.whatsapp, "Hello MatchBox!")
    : settings.phone
      ? telHref(settings.phone)
      : "/faq";

  const columns: {
    title: string;
    links: { label: string; href: string; external?: boolean }[];
  }[] = [
    {
      title: "Shop",
      links: [
        { label: "All pieces", href: "/products" },
        ...categories
          .slice(0, 4)
          .map((c) => ({ label: c.name, href: `/categories/${c.slug}` })),
        { label: "Offers", href: "/products?onSale=true" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Delivery & returns", href: "/delivery" },
        { label: "Track my order", href: "/orders" },
        {
          label: "Contact us",
          href: contactHref,
          external: contactHref.startsWith("http"),
        },
      ],
    },
    {
      title: "About",
      links: [
        { label: "Our story", href: "/about" },
        { label: "My account", href: "/account" },
        { label: "Privacy policy", href: "/privacy" },
        { label: "Terms of sale", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="relative flex flex-col overflow-hidden border-t border-lux-ink/10 bg-lux-ivory text-lux-ink">
      <div className="relative flex-1">
        {/* The wordmark, whole and faint behind the columns across the full width, fading towards the bottom. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-4 px-4 select-none"
        >
          <Reveal>
            <p className="bg-linear-to-b from-lux-ink/[0.1] via-lux-ink/[0.06] to-lux-ink/0 bg-clip-text pl-[0.06em] text-center font-serif text-[min(20rem,calc((100vw-2rem)/6.5))] leading-[0.8] font-normal tracking-[0.06em] whitespace-nowrap text-transparent">
              MATCHBOX
            </p>
          </Reveal>
        </div>

        <div className="lux-footer-main relative mx-auto max-w-7xl px-6 pt-24 pb-28 sm:px-8 lg:pt-28 lg:pb-40">
          <div className="relative grid gap-16 lg:grid-cols-[1.1fr_2fr] lg:gap-20">
            {/* Brand, contact and social */}
            <div className="max-w-md">
              <Reveal>
                <Link
                  href="/"
                  aria-label="MatchBox home"
                  className="inline-flex flex-col items-start gap-2"
                >
                  <FlameMark className="h-6 w-6 text-lux-brass" />
                  <span className="font-serif text-2xl tracking-[0.42em]">
                    MATCHBOX
                  </span>
                </Link>
              </Reveal>
              <Reveal
                as="p"
                variant="text"
                delay={150}
                stagger={35}
                className="mt-8 text-[15px] leading-relaxed font-light text-lux-stone"
              >
                Fine lighters, tobacco and smoking accessories — chosen for
                their craft and delivered with discretion across Bangladesh.
              </Reveal>
              {(settings.phone || settings.email || settings.address) && (
                <Reveal delay={250}>
                  <ul className="mt-6 space-y-1.5 text-sm font-light text-lux-stone">
                    {settings.phone && (
                      <li>
                        <a
                          href={telHref(settings.phone)}
                          className="hover:text-lux-ink"
                        >
                          {formatPhone(settings.phone)}
                        </a>
                      </li>
                    )}
                    {settings.email && (
                      <li>
                        <a
                          href={`mailto:${settings.email}`}
                          className="hover:text-lux-ink"
                        >
                          {settings.email}
                        </a>
                      </li>
                    )}
                    {settings.address && (
                      <li className="whitespace-pre-line">
                        {settings.address}
                      </li>
                    )}
                  </ul>
                </Reveal>
              )}

              <Reveal
                as="p"
                variant="text"
                delay={300}
                className={`${heading} mt-12`}
              >
                {socials.length > 0 ? "Follow us" : "Talk to us"}
              </Reveal>
              <Reveal delay={400}>
                {socials.length > 0 ? (
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {socials.map((s, i) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center gap-2 py-4 text-[11px] tracking-[0.15em] uppercase transition-opacity duration-300 hover:opacity-85 ${s.className} ${i === 0 ? "col-span-3" : ""}`}
                      >
                        {s.icon}
                        {s.label}
                      </a>
                    ))}
                  </div>
                ) : (
                  <a
                    href={contactHref}
                    target={
                      contactHref.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      contactHref.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group mt-5 inline-flex items-center gap-3 bg-lux-ink px-8 py-4 text-[11px] tracking-[0.3em] text-lux-ivory uppercase transition-colors duration-500 hover:bg-lux-coal"
                  >
                    Contact us
                    <span className="h-px w-6 bg-current transition-all duration-500 group-hover:w-10" />
                  </a>
                )}
              </Reveal>
            </div>

            {/* Link columns */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:gap-10 lg:pt-1">
              {columns.map((col, c) => (
                <nav key={col.title} aria-label={col.title}>
                  <Reveal
                    as="p"
                    variant="text"
                    delay={c * 120}
                    className={heading}
                  >
                    {col.title}
                  </Reveal>
                  <ul className="mt-8 space-y-5">
                    {col.links.map((l, i) => (
                      <Reveal
                        as="li"
                        key={l.label}
                        delay={c * 120 + (i + 1) * 70}
                      >
                        {l.external ? (
                          <a
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={linkClass}
                          >
                            {l.label}
                          </a>
                        ) : (
                          <Link href={l.href} className={linkClass}>
                            {l.label}
                          </Link>
                        )}
                      </Reveal>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="lux-footer-bar relative border-t border-lux-ink/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-xs font-light text-lux-stone sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p>
            © {year} MatchBox. For adults aged 18 and over — please smoke
            responsibly.
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="/privacy" className="hover:text-lux-ink">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-lux-ink">
              Terms
            </Link>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-lux-brass" />
              Authentic · Discreet · Cash on delivery
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
