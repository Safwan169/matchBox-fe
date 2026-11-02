import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";
import { getStoreSettings } from "@/lib/store-data";
import { formatDeliveryFee } from "@/lib/format";

export const metadata: Metadata = {
  title: "Delivery & returns",
  description: "Delivery fees, discreet packaging and returns at MatchBox.",
};

export default async function DeliveryPage() {
  const settings = await getStoreSettings();
  // Older deployed API versions may not include deliveryTiers yet.
  const tiers = (Array.isArray(settings.deliveryTiers) ? [...settings.deliveryTiers] : []).sort((a, b) => a.minItems - b.minItems);
  return (
    <InfoPage kicker="Help" title="Delivery & returns" intro="Discreetly packed, delivered to your door, paid on arrival.">
      <h2>Delivery fees</h2>
      <p>We currently deliver within Dhaka. Your delivery fee depends on the number of items in your cart. Adding items may unlock a lower fee.</p>
      <ul>{tiers.map((tier) => <li key={tier.minItems}>Cart with {tier.minItems}{tier.minItems > 1 ? "+" : ""} {tier.minItems === 1 ? "item" : "items"}: {formatDeliveryFee(tier.insideDhakaFee)} within Dhaka</li>)}</ul>
      <p>The cart shows your current fee and any savings available by adding another item. Your final delivery charge is confirmed at checkout.</p>

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
