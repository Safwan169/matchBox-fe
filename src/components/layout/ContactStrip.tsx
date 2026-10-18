import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { formatPhone, getStoreSettings, telHref, whatsappHref } from "@/lib/contact";

/** Thin bar above the header with the store's phone and WhatsApp. Hidden if neither is set. */
export async function ContactStrip() {
  const { phone, whatsapp } = await getStoreSettings();
  if (!phone && !whatsapp) return null;

  return (
    <div className="bg-brand-charcoal text-xs text-brand-cream/90">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-x-5 gap-y-1 px-4 py-1.5">
        {phone && (
          <a href={telHref(phone)} className="flex items-center gap-1.5 hover:text-brand-flame">
            <PhoneIcon className="h-3.5 w-3.5" /> Call {formatPhone(phone)}
          </a>
        )}
        {whatsapp && (
          <a href={whatsappHref(whatsapp)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-flame">
            <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp {formatPhone(whatsapp)}
          </a>
        )}
      </div>
    </div>
  );
}
