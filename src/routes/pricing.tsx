import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — SellerBoost Flipkart Plans" },
      { name: "description", content: "Transparent monthly pricing for Flipkart account management. Plans start at ₹2,999/month with no hidden fees." },
      { property: "og:title", content: "Pricing — SellerBoost" },
      { property: "og:description", content: "Affordable Flipkart seller management plans for every stage of business." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
  }),
  component: () => (
    <Layout>
      <div className="pt-24" />
      <Pricing />
      <FAQ />
    </Layout>
  ),
});
