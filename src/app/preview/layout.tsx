import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";

// Design previews for the owner to review; not part of the live shop.
export const metadata: Metadata = { title: "Design preview", robots: { index: false, follow: false } };

const serif = Cormorant_Garamond({ variable: "--font-lux-serif", weight: ["300", "400", "500"], style: ["normal", "italic"], subsets: ["latin"] });
const sans = Jost({ variable: "--font-lux-sans", weight: ["300", "400", "500"], subsets: ["latin"] });

export default function PreviewLayout({ children }: LayoutProps<"/preview">) {
  return <div className={`${serif.variable} ${sans.variable} flex min-h-screen flex-col bg-lux-ivory font-lux text-lux-ink`}>{children}</div>;
}
