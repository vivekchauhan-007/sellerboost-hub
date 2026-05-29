import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";

type Plan = {
  id: string; name: string; tagline: string | null; price_inr: number; period: string;
  features: string[]; highlighted: boolean; cta_label: string; cta_url: string; payment_url: string | null;
};

export function Pricing() {
  const { data: plans = [] } = useQuery({
    queryKey: ["public", "pricing_plans"],
    queryFn: async (): Promise<Plan[]> => {
      const { data } = await supabase.from("pricing_plans").select("*").eq("is_active", true).order("sort_order");
      return (data ?? []) as Plan[];
    },
  });

  return (
    <Section
      id="pricing"
      eyebrow="Pricing"
      title={<>Simple, transparent <span className="text-gradient-accent">pricing</span></>}
      subtitle="Choose a plan that fits your stage. No hidden fees, cancel anytime."
    >
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((p, i) => {
          const url = p.payment_url || p.cta_url || "/contact";
          const external = url.startsWith("http");
          const ButtonInner = (
            <Button className={`w-full ${p.highlighted ? "bg-accent text-accent-foreground hover:bg-accent/90" : "bg-gradient-primary text-primary-foreground hover:opacity-90"}`}>
              {p.cta_label || "Get Started"}
            </Button>
          );
          return (
            <div
              key={p.id}
              className={`relative rounded-2xl p-7 border transition-all duration-300 animate-fade-up ${
                p.highlighted
                  ? "bg-gradient-to-br from-primary to-primary-glow text-primary-foreground border-transparent shadow-elegant scale-[1.02] lg:scale-105"
                  : "bg-card border-border hover:shadow-elegant hover:-translate-y-1"
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {p.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-accent">
                  <Sparkles className="size-3" /> Most Popular
                </span>
              )}
              <h3 className="font-semibold text-xl">{p.name} Plan</h3>
              <p className={`text-sm mt-1 ${p.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{p.tagline}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹{p.price_inr.toLocaleString("en-IN")}</span>
                <span className={`text-sm ${p.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>/{p.period}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className={`size-4 mt-0.5 shrink-0 ${p.highlighted ? "text-accent-glow" : "text-success"}`} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="block mt-7">
                {external ? <a href={url} target="_blank" rel="noopener noreferrer">{ButtonInner}</a> : <Link to={url}>{ButtonInner}</Link>}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
