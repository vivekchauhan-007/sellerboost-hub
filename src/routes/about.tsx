import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { WhyUs } from "@/components/sections/WhyUs";
import { Results } from "@/components/sections/Results";
import { CTA } from "@/components/sections/CTA";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SellerBoost Flipkart Agency" },
      { name: "description", content: "SellerBoost is India's premium Flipkart seller management agency built by ex-Flipkart category managers and growth specialists." },
      { property: "og:title", content: "About — SellerBoost" },
      { property: "og:description", content: "Meet the team behind India's trusted Flipkart growth agency." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Layout>
      <Section
        className="pt-32"
        eyebrow="Our Story"
        title={<>We exist to make Flipkart sellers <span className="text-gradient-accent">profitable</span></>}
        subtitle="Founded in 2021 by ex-Flipkart category managers, SellerBoost has helped 500+ Indian brands turn their seller account into a real growth engine."
      >
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { k: "500+", v: "Sellers Managed" },
            { k: "₹120Cr+", v: "Revenue Driven" },
            { k: "50+", v: "Certified Experts" },
          ].map((s) => (
            <div key={s.v} className="bg-card border border-border rounded-2xl p-8 text-center shadow-soft">
              <p className="text-4xl font-bold text-gradient-primary">{s.k}</p>
              <p className="mt-2 text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </Section>
      <WhyUs />
      <Results />
      <CTA />
    </Layout>
  );
}
