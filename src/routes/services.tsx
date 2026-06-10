import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Services } from "@/components/sections/Services";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — SellerBoost Flipkart Agency" },
      { name: "description", content: "Full-stack Flipkart seller services: listing optimization, sponsored ads, cataloging, inventory, brand store setup and account health management." },
      { property: "og:title", content: "Services — SellerBoost" },
      { property: "og:description", content: "End-to-end Flipkart seller management services in India." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <Layout>
      <div className="pt-24" />
      <Services />
      <CTA />
    </Layout>
  );
}
