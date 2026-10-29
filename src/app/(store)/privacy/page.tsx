import type { Metadata } from "next";
import { InfoPage } from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What MatchBox collects, why, and how it is used.",
};

// Plain-language summary of what the site actually stores. The owner should have it reviewed.
export default function PrivacyPage() {
  return (
    <InfoPage kicker="About" title="Privacy policy" intro="We collect only what we need to deliver your order.">
      <h2>What we collect</h2>
      <ul>
        <li>Your account details: name, email, phone number and date of birth (to confirm you are 18 or over).</li>
        <li>Your delivery address, if you choose to save it.</li>
        <li>Your orders and any reviews you write.</li>
      </ul>

      <h2>How we use it</h2>
      <p>
        To process and deliver your orders, contact you about them, and keep your account secure. We do not sell your information. Your name,
        phone number and address are shared with the courier only to deliver your order.
      </p>

      <h2>Cookies</h2>
      <p>
        We use one essential cookie to keep you signed in, and your browser stores your bag and age confirmation on your device. We do not use
        advertising cookies.
      </p>

      <h2>Your choices</h2>
      <p>You can update your details at any time in My account, or contact us to have your account removed.</p>
    </InfoPage>
  );
}
