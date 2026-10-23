import type { Metadata } from "next";
import { Ultra, Work_Sans } from "next/font/google";
import { AGE_GATE_SCRIPT, AgeGate } from "@/components/AgeGate";
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
          {/* The shop's header and footer live in (store)/layout; admin has its own. */}
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <AgeGate />
      </body>
    </html>
  );
}
