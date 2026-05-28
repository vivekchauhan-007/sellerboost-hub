import { Star } from "lucide-react";
import { Section } from "@/components/Section";

const testimonials = [
  {
    name: "Rahul Mehta",
    role: "Founder, UrbanWear India",
    text: "SellerBoost took our monthly Flipkart revenue from ₹3L to ₹14L in 5 months. Their ad optimization is just incredible.",
    initials: "RM",
  },
  {
    name: "Priya Sharma",
    role: "Director, Saanvi Crafts",
    text: "We finally got out of account violations and our listings rank on page 1. Worth every rupee — best Flipkart agency in India.",
    initials: "PS",
  },
  {
    name: "Arjun Reddy",
    role: "CEO, TechBuy Electronics",
    text: "The team is super responsive and reports are crystal clear. ROAS jumped from 2.1x to 6.4x within 60 days.",
    initials: "AR",
  },
  {
    name: "Neha Gupta",
    role: "Owner, GlowKart Beauty",
    text: "From cataloging to brand store setup, everything was handled. My sales doubled in the first quarter itself.",
    initials: "NG",
  },
  {
    name: "Vikram Singh",
    role: "Founder, FitNest Sports",
    text: "Truly data-driven. They explain every move and you can actually see the impact in dashboards.",
    initials: "VS",
  },
  {
    name: "Ananya Iyer",
    role: "Director, Aroma Living",
    text: "Account health was a nightmare before SellerBoost. Now we get only growth conversations, not violation emails.",
    initials: "AI",
  },
];

export function Testimonials() {
  return (
    <Section
      eyebrow="Testimonials"
      title={<>Loved by <span className="text-gradient-primary">500+ Flipkart sellers</span></>}
      subtitle="Real feedback from Indian sellers we've helped scale."
      className="bg-secondary/40"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <div
            key={t.name}
            className="bg-card rounded-2xl border border-border p-6 hover:shadow-elegant transition-all animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex gap-0.5 text-accent mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className="size-4 fill-current" />
              ))}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">"{t.text}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="size-11 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                {t.initials}
              </div>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
