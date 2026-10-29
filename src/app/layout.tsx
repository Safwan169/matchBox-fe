import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Ultra, Work_Sans } from "next/font/google";
import { AGE_GATE_SCRIPT, AgeGate } from "@/components/AgeGate";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

// Admin fonts: Ultra (the slab wordmark) and Work Sans. Not preloaded; the shop doesn't use them.
const ultra = Ultra({
  variable: "--font-ultra",
  preload: false,
  weight: "400",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-body",
  preload: false,
  subsets: ["latin"],
});

// Shop fonts (.theme-lux): a light serif for display and a clean sans for everything else.
const luxSerif = Cormorant_Garamond({
  variable: "--font-lux-serif",
  subsets: ["latin"],
});

// Italics (a few accent words and quotes) share the family name but aren't preloaded, so
// they don't compete with the fonts the first paint needs.
const luxSerifItalic = Cormorant_Garamond({
  variable: "--font-lux-serif-italic",
  style: ["italic"],
  subsets: ["latin"],
  preload: false,
});

const luxSans = Jost({
  variable: "--font-lux-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "MatchBox", template: "%s · MatchBox" },
  description: "Fine lighters, tobacco and smoking accessories, delivered with discretion across Bangladesh.",
  icons: { icon: "/brand/logo.png" },
};

// "cover" lets the mobile bottom bar pad itself above the iPhone home indicator.
export const viewport: Viewport = { viewportFit: "cover", themeColor: "#0f0d0b" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the age-gate script may add data-age-ok before React loads.
    <html lang="en" className={`${ultra.variable} ${workSans.variable} ${luxSerif.variable} ${luxSerifItalic.variable} ${luxSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: AGE_GATE_SCRIPT }} />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla) add attributes to <body>. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <AuthProvider>
          {/* The shop's header and footer live in (store)/layout; admin has its own. */}
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <AgeGate />
      </body>
    </html>
  );
}
