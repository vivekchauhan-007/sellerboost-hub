import { useQuery } from "@tanstack/react-query";
import { Section } from "@/components/Section";
import { supabase } from "@/integrations/supabase/client";
import { getIcon } from "@/lib/iconMap";

type Stat = { id: string; value: string; label: string; description: string | null; icon: string; tone: string };

const toneMap: Record<string, string> = {
  primary: "from-primary to-primary-glow",
  accent: "from-accent to-accent-glow",
  success: "from-[oklch(0.65_0.17_155)] to-[oklch(0.75_0.15_155)]",
};

export function Results() {
  const { data: stats = [] } = useQuery({
    queryKey: ["public", "results_stats"],
    queryFn: async (): Promise<Stat[]> => {
      const { data } = await supabase.from("results_stats").select("*").eq("is_active", true).order("sort_order");
      return (data ?? []) as Stat[];
    },
  });

  return (
    <Section
      eyebrow="Real Results"
      title={<>Numbers our clients <span className="text-gradient-accent">love to share</span></>}
      subtitle="Aggregated performance across 500+ Flipkart sellers we've managed."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = getIcon(s.icon);
          const tone = toneMap[s.tone] ?? toneMap.primary;
          return (
            <div
              key={s.id}
              className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 hover:shadow-elegant transition-all animate-fade-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br ${tone} opacity-10`} />
              <div className={`size-11 rounded-xl bg-gradient-to-br ${tone} grid place-items-center shadow-elegant`}>
                <Icon className="size-5 text-white" />
              </div>
              <p className="mt-5 text-4xl font-bold tracking-tight">{s.value}</p>
              <p className="font-semibold mt-1">{s.label}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.description}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
