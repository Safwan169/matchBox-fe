import type { Metadata } from "next";
import { Ultra, Work_Sans } from "next/font/google";
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
  title: "MatchBox",
  description: "Cigarettes, lighters and smoking accessories.",
  icons: { icon: "/brand/logo.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ultra.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
