import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Services } from "@/components/sections/Services";
import { CTA } from "@/components/sections/CTA";
import { Section } from "@/components/Section";

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
      <Section
        className="pt-32"
        eyebrow="Services"
        title={<>Everything to <span className="text-gradient-primary">scale on Flipkart</span></>}
        subtitle="Pick what you need or let us handle it end-to-end."
      >
        <div />
      </Section>
      <Services />
      <CTA />
    </Layout>
  );
}
