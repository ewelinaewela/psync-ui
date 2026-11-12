import type { Metadata } from "next";
import { InfoPage } from "../components/InfoPage";
import { OperatorDetails } from "../components/OperatorDetails";

export const metadata: Metadata = { title: "Contact — Psync", description: "Product support, billing questions and privacy requests for Psync." };
export const dynamic = "force-static";

export default function ContactPage() {
  return <InfoPage eyebrow="Contact" title="How can we help?" intro="Contact Psync for product support, subscription assistance, refund requests or questions about your information.">
    <OperatorDetails />
    <section><h2>Product or license support</h2><p>Tell us what you were trying to do, the error message, and which browser and device you use. For purchase problems, include the purchase email address and order reference. Please remove private reflections from screenshots and do not send a journal backup, full license key, identity document or card information.</p></section>
    <section><h2>Billing and cancellation</h2><p>You can manage your subscription in the <a href="https://psync.lemonsqueezy.com/billing" target="_blank" rel="noreferrer">Lemon Squeezy billing portal</a>. If you need help, contact us or use the support details in your order receipt. If you want to cancel or request a refund, say so clearly in your message.</p></section>
    <section><h2>Privacy requests</h2><p>Tell us which information or request you are asking about. The operator cannot remotely view or restore your local journal. You can export and remove local entries from the app or clear the site&apos;s browser storage.</p></section>
  </InfoPage>;
}
