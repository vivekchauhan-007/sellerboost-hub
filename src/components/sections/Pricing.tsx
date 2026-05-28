import { Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";

const plans = [
  {
    name: "Basic",
    price: "2,999",
    tagline: "For new Flipkart sellers",
    features: ["20 product listings", "Inventory updates", "Basic catalog support", "Email support", "Monthly report"],
  },
  {
    name: "Growth",
    price: "7,999",
    tagline: "Most chosen by growing brands",
    popular: true,
    features: ["100 product listings", "Sponsored Ads management", "Weekly performance reports", "Account health monitoring", "Priority chat support"],
  },
  {
    name: "Premium",
    price: "14,999",
    tagline: "Full done-for-you service",
    features: ["Unlimited listings", "Full account management", "Dedicated account manager", "Daily ad optimization", "24/7 support + WhatsApp"],
  },
];

export function Pricing() {
  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title={<>Simple, transparent <span className="text-gradient-accent">pricing</span></>}
      subtitle="Choose a plan that fits your stage. No hidden fees, cancel anytime."
    >
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((p, i) => (
          <div
            key={p.name}
            className={`relative rounded-2xl p-7 border transition-all duration-300 animate-fade-up ${
              p.popular
                ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border-transparent shadow-elegant scale-[1.02] lg:scale-105"
                : "bg-card border-border hover:shadow-elegant hover:-translate-y-1"
            }`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-accent">
                <Sparkles className="size-3" /> Most Popular
              </span>
            )}
            <h3 className="font-semibold text-xl">{p.name} Plan</h3>
            <p className={`text-sm mt-1 ${p.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.tagline}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="text-4xl font-bold">₹{p.price}</span>
              <span className={`text-sm ${p.popular ? "text-primary-foreground/80" : "text-muted-foreground"}`}>/month</span>
            </div>
            <ul className="mt-6 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className={`size-4 mt-0.5 shrink-0 ${p.popular ? "text-accent-glow" : "text-success"}`} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/contact" className="block mt-7">
              <Button
                className={`w-full ${
                  p.popular
                    ? "bg-accent text-accent-foreground hover:bg-accent/90"
                    : "bg-gradient-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                Get Started
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </Section>
  );
}
