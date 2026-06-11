import { TrendingUp, Eye, RotateCcw, BadgeIndianRupee } from "lucide-react";
import { Section } from "@/components/Section";

const stats = [
  { icon: TrendingUp, value: "+312%", label: "Avg. Sales Growth", desc: "in first 90 days across active clients", tone: "primary" },
  { icon: Eye, value: "+185%", label: "Product Visibility", desc: "improvement in Flipkart search rankings", tone: "accent" },
  { icon: RotateCcw, value: "-42%", label: "Return Rate", desc: "reduction through catalog & QC improvements", tone: "success" },
  { icon: BadgeIndianRupee, value: "5.8x", label: "Avg. ROAS", desc: "from optimized Sponsored Ads campaigns", tone: "primary" },
];

const toneMap: Record<string, string> = {
  primary: "from-primary to-primary-glow",
  accent: "from-accent to-accent-glow",
  success: "from-[oklch(0.65_0.17_155)] to-[oklch(0.75_0.15_155)]",
};

export function Results() {
  return (
    <Section
      eyebrow="Real Results"
      title={<>Numbers our clients <span className="text-gradient-accent">love to share</span></>}
      subtitle="Aggregated performance across 500+ Flipkart sellers we've managed."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 hover:shadow-elegant transition-all animate-fade-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className={`absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br ${toneMap[s.tone]} opacity-10`} />
            <div className={`size-11 rounded-xl bg-gradient-to-br ${toneMap[s.tone]} grid place-items-center shadow-elegant`}>
              <s.icon className="size-5 text-white" />
            </div>
            <p className="mt-5 text-4xl font-bold tracking-tight">{s.value}</p>
            <p className="font-semibold mt-1">{s.label}</p>
            <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
