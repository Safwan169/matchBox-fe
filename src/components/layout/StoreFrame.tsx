import { Suspense, type ReactNode } from "react";
import { ContactStrip } from "./ContactStrip";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { WhatsAppButton } from "./WhatsAppButton";

/** The shop's header, footer and contact buttons. Not used in the admin area. */
export function StoreFrame({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <ContactStrip />
      </Suspense>
      <Header />
      <main className="flex min-h-screen flex-1 flex-col">{children}</main>
      <Footer />
      {/* Keeps the end of the footer above the fixed bottom bar on phones. */}
      <div aria-hidden className="h-[calc(4rem+env(safe-area-inset-bottom))] md:hidden" />
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
      {/* Reads the URL (usePathname), so it must sit inside Suspense. */}
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>
    </>
  );
}
