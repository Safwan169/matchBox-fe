import { WhatsAppIcon } from "@/components/icons";
import { getStoreSettings, whatsappHref } from "@/lib/contact";

/** Floating "chat on WhatsApp" button (desktop; phones get it in the bottom bar). */
export async function WhatsAppButton() {
  const { whatsapp } = await getStoreSettings();
  if (!whatsapp) return null;

  return (
    <a
      href={whatsappHref(whatsapp, "Hello MatchBox! I have a question.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-6 bottom-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-lux-brass/40 bg-lux-ink text-lux-brass-light shadow-[0_10px_30px_rgb(0_0_0/0.25)] transition-[transform,background-color] duration-500 hover:-translate-y-1 hover:bg-lux-coal md:flex"
    >
      <WhatsAppIcon className="h-6 w-6" />
    </a>
  );
}
