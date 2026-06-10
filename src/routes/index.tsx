import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Testimonials } from "@/components/sections/Testimonials";
import { AuditForm } from "@/components/sections/AuditForm";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SellerBoost — Flipkart Seller Account Management Agency in India" },
      { name: "description", content: "Grow your Flipkart sales with India's premium seller account management agency. Listing optimization, ads, cataloging, inventory and account health — done for you." },
      { property: "og:title", content: "SellerBoost — Flipkart Seller Account Management Agency" },
      { property: "og:description", content: "Done-for-you Flipkart growth services: listings, ads, catalog, inventory and account health." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <Layout>
      <Hero />
      <Services />
      <Testimonials />
      <AuditForm />
      <CTA />
    </Layout>
  );
}
