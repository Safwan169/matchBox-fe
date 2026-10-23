import { WhatsAppIcon } from "@/components/icons";
import { getStoreSettings, whatsappHref } from "@/lib/contact";

/** Floating "chat on WhatsApp" button (desktop; phones get it in the bottom bar). */
export async function WhatsAppButton() {
  const { whatsapp } = await getStoreSettings();
  if (!whatsapp) return null;

  return (
    <a
      href={whatsappHref(whatsapp, "Hi MatchBox! I have a question.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed right-4 bottom-4 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 sm:right-6 sm:bottom-6 md:flex"
    >
      <WhatsAppIcon className="h-8 w-8" />
    </a>
  );
}
