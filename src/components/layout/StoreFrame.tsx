import { Suspense, type ReactNode } from "react";
import { ContactStrip } from "./ContactStrip";
import { Footer } from "./Footer";
import { Header } from "./Header";
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
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
    </>
  );
}
