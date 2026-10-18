import type { Metadata } from "next";
import { Ultra, Work_Sans } from "next/font/google";
import { AgeGate } from "@/components/AgeGate";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
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
    <html lang="en" className={`${ultra.variable} ${workSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <AgeGate />
      </body>
    </html>
  );
}
