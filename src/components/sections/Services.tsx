import {
  ListChecks, FolderKanban, Megaphone, Boxes,
  PackageCheck, HeartPulse, Search, Store,
} from "lucide-react";
import { Section } from "@/components/Section";

const services = [
  { icon: ListChecks, title: "Product Listing Optimization", desc: "Keyword-rich titles, bullets and A+ content that rank and convert." },
  { icon: FolderKanban, title: "Catalog Management", desc: "Bulk uploads, variants and error-free catalog operations at scale." },
  { icon: Megaphone, title: "Sponsored Ads Management", desc: "PCA & PLA campaigns optimized daily for maximum ROAS." },
  { icon: Boxes, title: "Inventory Management", desc: "Smart restocking, FBF coordination, zero stock-out planning." },
  { icon: PackageCheck, title: "Order & Return Handling", desc: "Reduce RTO, manage returns and protect your seller rating." },
  { icon: HeartPulse, title: "Account Health Management", desc: "Resolve violations, appeals and keep your seller score healthy." },
  { icon: Search, title: "Product SEO Optimization", desc: "Search rank improvements with data from Flipkart insights." },
  { icon: Store, title: "Brand Store Setup", desc: "Beautiful, conversion-focused brand storefronts on Flipkart." },
];

export function Services() {
  return (
    <Section
      id="services"
      eyebrow="What We Do"
      title={<>Everything you need to <span className="text-gradient-primary">scale on Flipkart</span></>}
      subtitle="A complete suite of Flipkart seller services — managed by certified experts."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((s, i) => (
          <div
            key={s.title}
            className="group relative bg-card rounded-2xl border border-border p-6 hover:shadow-elegant hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center shadow-elegant group-hover:scale-110 transition-transform">
              <s.icon className="size-6 text-primary-foreground" />
            </div>
            <h3 className="mt-5 font-semibold text-lg">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>
    </Section>
  );
}
