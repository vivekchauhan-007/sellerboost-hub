import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Section } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";

type T = { id: string; name: string; role: string | null; quote: string; initials: string | null; rating: number };

export function Testimonials() {
  const { data: items = [] } = useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: async (): Promise<T[]> => {
      const { data } = await supabase.from("testimonials").select("*").eq("is_active", true).order("sort_order");
      return (data ?? []) as T[];
    },
  });

  return (
    <Section
      eyebrow="Testimonials"
      title={<>Loved by <span className="text-gradient-primary">500+ Flipkart sellers</span></>}
      subtitle="Real feedback from Indian sellers we've helped scale."
      className="bg-secondary/40"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((t, i) => (
          <div
            key={t.id}
            className="bg-card rounded-2xl border border-border p-6 hover:shadow-elegant transition-all animate-fade-up"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex gap-0.5 text-accent mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (<Star key={j} className="size-4 fill-current" />))}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">"{t.quote}"</p>
            <div className="mt-5 flex items-center gap-3">
              <div className="size-11 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                {t.initials || t.name.slice(0, 2).toUpperCase()}
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
