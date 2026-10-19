import type { Metadata } from "next";
import { Ultra, Work_Sans } from "next/font/google";
import { Suspense } from "react";
import { AGE_GATE_SCRIPT, AgeGate } from "@/components/AgeGate";
import { Footer } from "@/components/layout/Footer";
import { ContactStrip } from "@/components/layout/ContactStrip";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

// Ultra is the heavy slab serif matching the MATCHBOX wordmark.
const ultra = Ultra({
  variable: "--font-ultra",
  weight: "400",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "MatchBox", template: "%s · MatchBox" },
  description: "Cigarettes, lighters and smoking accessories.",
  icons: { icon: "/brand/logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the age-gate script may add data-age-ok before React loads.
    <html lang="en" className={`${ultra.variable} ${workSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: AGE_GATE_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <ContactStrip />
            </Suspense>
            <Header />
            <main className="flex min-h-screen flex-1 flex-col">{children}</main>
            <Footer />
            <Suspense fallback={null}>
              <WhatsAppButton />
            </Suspense>
          </CartProvider>
        </AuthProvider>
        <AgeGate />
      </body>
    </html>
  );
}
