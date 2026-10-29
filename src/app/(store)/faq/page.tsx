import type { Metadata } from "next";
import Link from "next/link";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about ordering, delivery, payment and age checks at MatchBox.",
};

export default function FaqPage() {
  return (
    <InfoPage kicker="Help" title="Frequently asked questions" intro="Everything you need to know before you order.">
      <h2>How do I pay?</h2>
      <p>We currently accept cash on delivery only. You pay the courier when your order arrives — nothing is charged online.</p>

      <h2>How much is delivery?</h2>
      <p>
        Delivery is ৳60 inside Dhaka and ৳120 elsewhere in Bangladesh, and complimentary on orders of ৳3,000 or more. The exact amount is
        shown at checkout before you confirm.
      </p>

      <h2>Who can order?</h2>
      <p>
        Only adults aged 18 and over. We ask for your date of birth when you create an account, and the courier may ask for ID on delivery.
      </p>

      <h2>How do I know where my order is?</h2>
      <p>
        Sign in and open <Link href="/orders">My orders</Link> to see each order and its status — pending, confirmed, shipped or delivered.
      </p>

      <h2>Can I cancel an order?</h2>
      <p>
        Please contact us as soon as possible. Orders that haven’t shipped yet can be cancelled. See <Link href="/delivery">Delivery &amp; returns</Link>.
      </p>

      <h2>Are your products genuine?</h2>
      <p>Yes. We sell authentic products only, sourced from trusted distributors.</p>
    </InfoPage>
  );
}
