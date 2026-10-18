import Link from "next/link";
import { Suspense } from "react";
import { formatPhone, getStoreSettings, telHref, whatsappHref } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="bg-brand-charcoal text-brand-cream/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl text-brand-cream">MATCHBOX</p>
          <p className="mt-2 text-sm">Cigarettes, lighters &amp; smoking accessories.</p>
        </div>
        <div>
          <p className="font-semibold text-brand-cream">Shop</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li><Link href="/products" className="hover:text-brand-flame">All products</Link></li>
            <li><Link href="/cart" className="hover:text-brand-flame">Cart</Link></li>
            <li><Link href="/orders" className="hover:text-brand-flame">My orders</Link></li>
          </ul>
        </div>
        <Suspense fallback={<div />}>
          <FooterContact />
        </Suspense>
        <div className="text-sm">
          <p className="font-semibold text-brand-cream">Notice</p>
          <p className="mt-2">
            Sales are restricted to adults aged 18 and over. Smoking seriously harms your health.
          </p>
        </div>
      </div>
      <div className="border-t border-brand-cream/10 py-4 text-center text-xs">
        © MatchBox. All rights reserved.
      </div>
    </footer>
  );
}

async function FooterContact() {
  const s = await getStoreSettings();
  if (!s.phone && !s.whatsapp && !s.email && !s.address && !s.facebookUrl) return <div />;

  return (
    <div className="text-sm">
      <p className="font-semibold text-brand-cream">Contact us</p>
      <ul className="mt-2 space-y-1">
        {s.phone && <li>Phone: <a href={telHref(s.phone)} className="hover:text-brand-flame">{formatPhone(s.phone)}</a></li>}
        {s.whatsapp && (
          <li>
            WhatsApp:{" "}
            <a href={whatsappHref(s.whatsapp)} target="_blank" rel="noopener noreferrer" className="hover:text-brand-flame">
              {formatPhone(s.whatsapp)}
            </a>
          </li>
        )}
        {s.email && <li>Email: <a href={`mailto:${s.email}`} className="hover:text-brand-flame">{s.email}</a></li>}
        {s.address && <li className="whitespace-pre-line">{s.address}</li>}
        {s.facebookUrl && (
          <li>
            <a href={s.facebookUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-flame">
              Facebook page ↗
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}
