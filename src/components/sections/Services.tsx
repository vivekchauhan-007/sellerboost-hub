import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/iconMap";

type Svc = { id: string; title: string; description: string; icon: string };

export function Services() {
  const { data: services = [] } = useQuery({
    queryKey: ["public", "services"],
    queryFn: async (): Promise<Svc[]> => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      return (data ?? []) as Svc[];
    },
  });

  return (
    <Section
      id="services"
      eyebrow="What We Do"
      title={<>Everything you need to <span className="text-gradient-primary">scale on Flipkart</span></>}
      subtitle="A complete suite of Flipkart seller services — managed by certified experts."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((s, i) => {
          const Icon = getIcon(s.icon);
          return (
            <div
              key={s.id}
              className="group relative bg-card rounded-2xl border border-border p-6 hover:shadow-elegant hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="size-12 rounded-xl bg-gradient-primary grid place-items-center shadow-elegant group-hover:scale-110 transition-transform">
                <Icon className="size-6 text-primary-foreground" />
              </div>
              <h3 className="mt-5 font-semibold text-lg">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              <div className="absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
    </Section>
  );
}
