import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Tag, Wrench, Star, Newspaper, Inbox, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminHome,
});

function useCount(table: "pricing_plans" | "services" | "testimonials" | "blog_posts" | "contact_submissions" | "results_stats", unreadOnly = false) {
  return useQuery({
    queryKey: ["count", table, unreadOnly],
    queryFn: async () => {
      const base = supabase.from(table).select("*", { count: "exact", head: true });
      const q = unreadOnly && table === "contact_submissions"
        ? supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("is_read", false)
        : base;
      const { count } = await q;
      return count ?? 0;
    },
  });
}

function AdminHome() {
  const pricing = useCount("pricing_plans");
  const services = useCount("services");
  const testimonials = useCount("testimonials");
  const results = useCount("results_stats");
  const blog = useCount("blog_posts");
  const subs = useCount("contact_submissions");
  const unread = useCount("contact_submissions", true);

  const cards = [
    { to: "/admin/pricing", label: "Pricing Plans", icon: Tag, count: pricing.data },
    { to: "/admin/services", label: "Services", icon: Wrench, count: services.data },
    { to: "/admin/testimonials", label: "Testimonials", icon: Star, count: testimonials.data },
    { to: "/admin/results", label: "Stats", icon: BarChart3, count: results.data },
    { to: "/admin/blog", label: "Blog Posts", icon: Newspaper, count: blog.data },
    { to: "/admin/submissions", label: `Submissions${unread.data ? ` (${unread.data} new)` : ""}`, icon: Inbox, count: subs.data },
  ];

  return (
    <AdminShell title="Dashboard">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="bg-card border border-border rounded-2xl p-5 hover:shadow-elegant hover:-translate-y-0.5 transition"
          >
            <div className="flex items-center justify-between">
              <div className="size-10 rounded-lg bg-gradient-primary grid place-items-center">
                <c.icon className="size-5 text-primary-foreground" />
              </div>
              <span className="text-3xl font-bold">{c.count ?? "—"}</span>
            </div>
            <p className="mt-3 font-semibold">{c.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Manage →</p>
          </Link>
        ))}
      </div>
    </AdminShell>
  );
}
