import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Terms of sale",
  description: "The terms that apply when you order from MatchBox.",
};

// Plain-language terms matching how the shop works. The owner should have them reviewed.
export default function TermsPage() {
  return (
    <InfoPage kicker="About" title="Terms of sale" intro="The short version: adults only, cash on delivery, and we’ll always be straight with you.">
      <h2>Age</h2>
      <p>You must be 18 or over to create an account or place an order. We may refuse or cancel an order if we can’t confirm your age.</p>

      <h2>Prices and payment</h2>
      <p>
        Prices are in Bangladeshi Taka. The final price, including delivery, is confirmed at checkout. Payment is cash on delivery.
      </p>

      <h2>Stock</h2>
      <p>Items are reserved when you place your order. If something becomes unavailable, we will contact you before shipping.</p>

      <h2>Cancellations</h2>
      <p>Orders can be cancelled until they are shipped. Please contact us as soon as possible.</p>

      <h2>Health</h2>
      <p>Smoking seriously harms you and others around you. Please enjoy responsibly.</p>
    </InfoPage>
  );
}
