import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Delivery & returns",
  description: "Delivery fees, discreet packaging and returns at MatchBox.",
};

export default function DeliveryPage() {
  return (
    <InfoPage kicker="Help" title="Delivery & returns" intro="Discreetly packed, delivered to your door, paid on arrival.">
      <h2>Delivery fees</h2>
      <ul>
        <li>Inside Dhaka: ৳60</li>
        <li>Outside Dhaka: ৳120</li>
        <li>Orders of ৳3,000 or more: complimentary, anywhere in Bangladesh</li>
      </ul>

      <h2>Packaging</h2>
      <p>Every order is sent in plain, sealed packaging with nothing on the outside to show what is inside.</p>

      <h2>Payment</h2>
      <p>Cash on delivery. Please have the exact amount ready if you can; the courier may ask to see ID confirming you are 18 or over.</p>

      <h2>Problems with an order</h2>
      <p>
        If something arrives damaged, incorrect or incomplete, contact us as soon as possible with your order number and we will make it
        right. For hygiene and safety reasons, opened tobacco products can’t be returned.
      </p>
    </InfoPage>
  );
}
