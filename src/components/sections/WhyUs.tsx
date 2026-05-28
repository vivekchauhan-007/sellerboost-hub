import { Award, LineChart, Headphones, FileText, Target } from "lucide-react";
import { Section } from "@/components/Section";

const features = [
  { icon: Award, title: "Experienced Flipkart Experts", desc: "Ex-Flipkart category managers and seasoned ad specialists on every account." },
  { icon: LineChart, title: "Data-driven Growth", desc: "Every decision is backed by Flipkart insights, search trends and conversion data." },
  { icon: Headphones, title: "Fast, Reliable Support", desc: "Response in under 2 hours during business hours, WhatsApp + email + call." },
  { icon: FileText, title: "Transparent Reporting", desc: "Detailed weekly reports with revenue, ROAS, ranking and inventory KPIs." },
  { icon: Target, title: "ROI-Focused Optimization", desc: "We tune every listing and campaign to deliver measurable return on investment." },
];

export function WhyUs() {
  return (
    <Section
      eyebrow="Why SellerBoost"
      title={<>Sellers choose us for one reason — <span className="text-gradient-primary">results</span></>}
      subtitle="Premium service, certified experts and a process built around your growth."
      className="bg-secondary/40"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <div
            key={f.title}
            className="bg-card rounded-2xl p-6 border border-border hover:shadow-elegant transition-all animate-fade-up"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="flex items-start gap-4">
              <div className="size-11 rounded-xl bg-accent/10 grid place-items-center shrink-0">
                <f.icon className="size-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
