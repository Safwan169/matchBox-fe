import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Our story",
  description: "MatchBox: fine lighters, tobacco and smoking accessories from Dhaka.",
};

export default function AboutPage() {
  return (
    <InfoPage kicker="About" title="Our story" intro="A small shop in Dhaka, built around a simple idea: the ritual deserves good things.">
      <p>
        MatchBox began with a love of the small details — the weight of a well-made lighter, the click of a good case, the calm of a moment
        taken slowly. We bring together pieces chosen for their craft rather than their price tag, and deliver them with care and discretion.
      </p>
      <p>
        Every product we sell is genuine and sourced from trusted distributors. Orders are packed plainly, delivered across Bangladesh and paid
        for on arrival, so you never pay for something you haven’t received.
      </p>
      <p>
        We serve adults aged 18 and over only, and we ask that you enjoy responsibly. <Link href="/products">Explore the collection</Link>.
      </p>
    </InfoPage>
  );
}
