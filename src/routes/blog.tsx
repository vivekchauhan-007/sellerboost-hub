import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  { title: "10 Flipkart Listing Hacks That Doubled Our Clients' Sales", date: "May 12, 2026", cat: "Listings", excerpt: "Title structure, keyword placement, image strategy — the playbook we use every day." },
  { title: "Sponsored PLA vs PCA: Which Should You Run First?", date: "May 4, 2026", cat: "Ads", excerpt: "A practical breakdown for sellers spending under ₹50K/month on Flipkart ads." },
  { title: "How to Reduce Flipkart Return Rate by 40%", date: "Apr 22, 2026", cat: "Operations", excerpt: "Catalog QA, product descriptions and packaging tips that cut RTO drastically." },
  { title: "Brand Store Setup: A Step-by-Step Guide", date: "Apr 10, 2026", cat: "Branding", excerpt: "Turn casual visitors into loyal customers with a high-converting Flipkart brand store." },
  { title: "Account Health 101: Avoiding Violations on Flipkart", date: "Mar 28, 2026", cat: "Compliance", excerpt: "The 7 metrics Flipkart watches and how to stay in the green zone." },
  { title: "Festive Sale Prep: Inventory Planning That Wins", date: "Mar 15, 2026", cat: "Inventory", excerpt: "How top sellers forecast demand for Big Billion Days and avoid stock-outs." },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Flipkart Seller Insights | SellerBoost" },
      { name: "description", content: "Actionable Flipkart seller tips on listings, ads, catalog, inventory and account health from SellerBoost experts." },
      { property: "og:title", content: "Blog — SellerBoost" },
      { property: "og:description", content: "Expert insights for Flipkart sellers in India." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <Layout>
      <Section
        className="pt-32"
        eyebrow="Blog"
        title={<>Insights to <span className="text-gradient-primary">sell smarter on Flipkart</span></>}
        subtitle="Tactical guides written by sellers and ad specialists — not generic content."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p, i) => (
            <article
              key={p.title}
              className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-elegant hover:-translate-y-1 transition-all animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="aspect-[16/9] bg-gradient-to-br from-primary/20 via-accent/15 to-primary-glow/20 relative">
                <span className="absolute top-3 left-3 text-xs px-2.5 py-1 rounded-full bg-background/90 backdrop-blur font-medium">{p.cat}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="size-3.5" /> {p.date}
                </div>
                <h3 className="mt-2 font-semibold text-lg leading-snug group-hover:text-primary transition-colors">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read more <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
