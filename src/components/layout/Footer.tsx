import { cacheLife } from "next/cache";
import Link from "next/link";
import type { ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { FacebookMark, FlameMark, InstagramMark, TikTokMark } from "@/components/luxury/icons";
import { formatPhone, telHref, whatsappHref } from "@/lib/contact";
import { getCategories, getStoreSettings } from "@/lib/store-data";

const heading = "text-[10px] tracking-[0.35em] text-lux-ink uppercase";
const linkClass = "text-sm font-light text-lux-stone transition-colors duration-300 hover:text-lux-ink";

// Cached so the static shell doesn't read the clock on every render (cacheComponents).
async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

type Social = { href: string; label: string; icon: ReactNode; className: string };

/** Footer: brand and social buttons, three link columns, and a large watermark behind. */
export async function Footer() {
  const [settings, categories, year] = await Promise.all([getStoreSettings(), getCategories(), currentYear()]);

  // The first configured network gets the full-width button, the rest share a row.
  const socials = ([
    settings.tiktokUrl && { href: settings.tiktokUrl, label: "TikTok", icon: <TikTokMark />, className: "bg-black text-white" },
    settings.instagramUrl && {
      href: settings.instagramUrl,
      label: "Instagram",
      icon: <InstagramMark />,
      className: "bg-[linear-gradient(45deg,#f58529,#dd2a7b_50%,#8134af)] text-white",
    },
    settings.facebookUrl && { href: settings.facebookUrl, label: "Facebook", icon: <FacebookMark />, className: "bg-[#0e5fd8] text-white" },
    settings.whatsapp && {
      href: whatsappHref(settings.whatsapp, "Hello MatchBox!"),
      label: "WhatsApp",
      icon: <WhatsAppIcon className="h-4 w-4" />,
      className: "bg-[#075e54] text-white",
    },
  ] as (Social | "")[]).filter((s): s is Social => s !== "");

  const contactHref = settings.whatsapp ? whatsappHref(settings.whatsapp, "Hello MatchBox!") : settings.phone ? telHref(settings.phone) : "/faq";

  const columns: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
    {
      title: "Shop",
      links: [
        { label: "All pieces", href: "/products" },
        ...categories.slice(0, 4).map((c) => ({ label: c.name, href: `/categories/${c.slug}` })),
        { label: "Offers", href: "/products?onSale=true" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "FAQ", href: "/faq" },
        { label: "Delivery & returns", href: "/delivery" },
        { label: "Track my order", href: "/orders" },
        { label: "Contact us", href: contactHref, external: contactHref.startsWith("http") },
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
    <footer className="relative overflow-hidden border-t border-lux-ink/10 bg-gradient-to-b from-lux-ivory to-lux-linen">
      {/* Watermark */}
      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-16 text-center font-serif text-[21vw] leading-none tracking-[0.06em] text-lux-ink/[0.035] select-none sm:bottom-10"
      >
        MATCHBOX
      </p>

      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 pt-20 pb-16 sm:px-8 lg:grid-cols-[1.35fr_3fr] lg:gap-10">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex flex-col items-start gap-2" aria-label="MatchBox home">
            <FlameMark className="h-6 w-6 text-lux-brass" />
            <span className="font-serif text-3xl tracking-[0.35em]">MATCHBOX</span>
          </Link>
          <p className="mt-6 text-sm leading-relaxed font-light text-lux-stone">
            Fine lighters, tobacco and smoking accessories — chosen for their craft and delivered with discretion across Bangladesh.
          </p>
          {(settings.phone || settings.email || settings.address) && (
            <ul className="mt-6 space-y-1.5 text-sm font-light text-lux-stone">
              {settings.phone && (
                <li>
                  <a href={telHref(settings.phone)} className="hover:text-lux-ink">
                    {formatPhone(settings.phone)}
                  </a>
                </li>
              )}
              {settings.email && (
                <li>
                  <a href={`mailto:${settings.email}`} className="hover:text-lux-ink">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.address && <li className="whitespace-pre-line">{settings.address}</li>}
            </ul>
          )}

          {socials.length > 0 && (
            <>
              <p className={`${heading} mt-10`}>Follow us</p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {socials.map((s, i) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 py-3.5 text-[11px] tracking-[0.15em] uppercase transition-opacity duration-300 hover:opacity-85 ${s.className} ${i === 0 ? "col-span-3" : ""}`}
                  >
                    {s.icon}
                    {s.label}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:gap-10">
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className={heading}>{col.title}</p>
              <ul className="mt-7 space-y-4">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="relative border-t border-lux-ink/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-7 text-xs font-light text-lux-stone sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <p>© {year} MatchBox. For adults aged 18 and over — please smoke responsibly.</p>
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
