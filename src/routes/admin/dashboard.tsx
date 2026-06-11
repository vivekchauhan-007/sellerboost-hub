import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminGate, AdminShell } from "@/components/admin/AdminShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, Phone, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: () => (
    <AdminGate>
      <AdminShell title="Dashboard">
        <Dashboard />
      </AdminShell>
    </AdminGate>
  ),
});

function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const [total, todayCount, consult, contact] = await Promise.all([
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("source", "audit"),
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("source", "contact"),
      ]);
      return {
        total: total.count ?? 0,
        today: todayCount.count ?? 0,
        consultations: consult.count ?? 0,
        inquiries: contact.count ?? 0,
      };
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["admin-recent"],
    queryFn: async () => {
      const { data } = await supabase
        .from("contact_submissions")
        .select("id, name, email, phone, source, created_at, status")
        .order("created_at", { ascending: false })
        .limit(8);
      return data ?? [];
    },
  });

  const cards = [
    { label: "Total Leads", value: stats?.total ?? "—", icon: Users, color: "bg-blue-500" },
    { label: "Leads Today", value: stats?.today ?? "—", icon: Calendar, color: "bg-emerald-500" },
    { label: "Consultations Booked", value: stats?.consultations ?? "—", icon: Phone, color: "bg-purple-500" },
    { label: "Website Inquiries", value: stats?.inquiries ?? "—", icon: MessageSquare, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`${c.color} text-white p-3 rounded-lg`}>
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">{c.value}</div>
                <div className="text-xs text-muted-foreground">{c.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {recent?.length ? recent.map((r) => (
              <div key={r.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{r.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{r.email || r.phone || "—"} · {r.source}</div>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString()}
                </div>
              </div>
            )) : <div className="py-6 text-center text-sm text-muted-foreground">No recent leads yet.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
