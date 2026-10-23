import { getStoreSettings, whatsappHref } from "@/lib/contact";
import { MobileNavBar } from "./MobileNavBar";

export async function MobileNav() {
  const { whatsapp } = await getStoreSettings();
  return <MobileNavBar whatsappLink={whatsapp ? whatsappHref(whatsapp, "Hi MatchBox! I have a question.") : null} />;
}
