import { Suspense, type ReactNode } from "react";
import { FlameMark } from "@/components/luxury/icons";
import { RevealObserver } from "@/components/luxury/RevealObserver";
import { ShutterWatcher } from "@/components/luxury/ShutterWatcher";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileNav } from "./MobileNav";
import { WhatsAppButton } from "./WhatsAppButton";

/** Same size and look as the header, for the moment before it streams in. */
function HeaderFallback({ className }: { className: string }) {
  return (
    <div aria-hidden className={`fixed inset-x-0 top-0 z-50 ${className}`}>
      <div className="h-8 bg-lux-ink" />
      <div className="lux-header-bar flex h-16 flex-col items-center justify-center gap-1 sm:h-20">
        <FlameMark className="h-4 w-4 text-lux-brass" />
        <span className="font-serif text-xl tracking-[0.42em] sm:text-2xl">MATCHBOX</span>
      </div>
    </div>
  );
}

/**
 * The shop's frame: luxury theme (.theme-lux), fixed header, shutter footer and phone bottom bar.
 * Not used in the admin area. `mobileChrome={false}` hides the header and footer on phones
 * (app-style pages that bring their own top bar, like My account); the bottom bar stays.
 */
export function StoreFrame({ children, mobileChrome = true }: { children: ReactNode; mobileChrome?: boolean }) {
  const desktopOnly = mobileChrome ? "" : "hidden md:block";
  return (
    <div className="theme-lux flex min-h-screen flex-col bg-background font-sans text-foreground">
      {/* The header reads the URL (usePathname), so it must sit inside Suspense. */}
      <Suspense fallback={<HeaderFallback className={desktopOnly} />}>
        <Header className={desktopOnly} />
      </Suspense>
      {/* The page is the "shutter": it scrolls up to uncover the footer fixed behind it (see .lux-shutter). */}
      <div className="lux-page relative z-10 flex flex-1 flex-col bg-background">
        {/* Room for the fixed header; a home hero pulls itself up under it (data-header-overlay). */}
        <div aria-hidden className={`h-(--header-h) shrink-0 ${desktopOnly}`} />
        <main className="flex min-h-screen flex-1 flex-col">{children}</main>
      </div>
      {/* Scroll room for uncovering the footer; its words rise once 30% of it is uncovered. */}
      <div aria-hidden id="footer-shutter" className="lux-shutter-space" />
      <div className={`lux-shutter ${desktopOnly}`} data-reveal-by="footer-shutter">
        <Footer />
      </div>
      {/* Keeps the end of the page above the fixed bottom bar on phones. */}
      <div aria-hidden className="h-[calc(4rem+env(safe-area-inset-bottom))] shrink-0 md:hidden" />
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
      <Suspense fallback={null}>
        <MobileNav />
      </Suspense>
      <RevealObserver />
      <ShutterWatcher spacerId="footer-shutter" />
      {/* Without JavaScript nothing would reveal, so show everything. */}
      <noscript>
        <style>{".lux-reveal-inner,.lux-reveal-card .lux-card-media,.lux-word{opacity:1!important;transform:none!important;clip-path:none!important}"}</style>
      </noscript>
    </div>
  );
}
