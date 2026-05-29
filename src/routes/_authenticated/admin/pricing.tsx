import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Plan = {
  id?: string;
  name: string; tagline: string; price_inr: number; period: string;
  features: string[]; highlighted: boolean; is_active: boolean; sort_order: number;
  cta_label: string; cta_url: string; payment_url: string;
};

const EMPTY: Plan = { name: "", tagline: "", price_inr: 0, period: "month", features: [], highlighted: false, is_active: true, sort_order: 0, cta_label: "Get Started", cta_url: "/contact", payment_url: "" };

export const Route = createFileRoute("/_authenticated/admin/pricing")({ component: PricingAdmin });

function PricingAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Plan | null>(null);
  const { data: plans = [] } = useQuery({
    queryKey: ["admin", "pricing_plans"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pricing_plans").select("*").order("sort_order");
      if (error) throw error;
      return data as Plan[];
    },
  });

  const save = useMutation({
    mutationFn: async (p: Plan) => {
      const payload = { ...p, features: p.features.filter(Boolean) };
      if (p.id) {
        const { error } = await supabase.from("pricing_plans").update(payload).eq("id", p.id);
        if (error) throw error;
      } else {
        const { id, ...ins } = payload;
        const { error } = await supabase.from("pricing_plans").insert(ins);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin", "pricing_plans"] }); qc.invalidateQueries({ queryKey: ["public", "pricing_plans"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("pricing_plans").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "pricing_plans"] }); qc.invalidateQueries({ queryKey: ["public", "pricing_plans"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell title="Pricing Plans" actions={<Button size="sm" onClick={() => setEditing({ ...EMPTY })}><Plus className="size-4 mr-1" />Add Plan</Button>}>
      <div className="grid gap-3">
        {plans.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{p.name}</h3>
                {p.highlighted && <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded">Featured</span>}
                {!p.is_active && <span className="text-xs bg-secondary px-2 py-0.5 rounded">Inactive</span>}
              </div>
              <p className="text-sm text-muted-foreground">{p.tagline}</p>
              <p className="text-sm mt-1">₹{p.price_inr.toLocaleString("en-IN")}/{p.period} • {p.features.length} features</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditing({ ...p })}><Edit2 className="size-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => confirm(`Delete ${p.name}?`) && del.mutate(p.id!)}><Trash2 className="size-4 text-destructive" /></Button>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Pricing Plan</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Tagline</Label><Input value={editing.tagline} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Price (INR)</Label><Input type="number" value={editing.price_inr} onChange={(e) => setEditing({ ...editing, price_inr: +e.target.value })} /></div>
                <div><Label>Period</Label><Input value={editing.period} onChange={(e) => setEditing({ ...editing, period: e.target.value })} /></div>
              </div>
              <div><Label>Features (one per line)</Label>
                <Textarea rows={6} value={editing.features.join("\n")} onChange={(e) => setEditing({ ...editing, features: e.target.value.split("\n") })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>CTA Label</Label><Input value={editing.cta_label} onChange={(e) => setEditing({ ...editing, cta_label: e.target.value })} /></div>
                <div><Label>CTA URL</Label><Input value={editing.cta_url} onChange={(e) => setEditing({ ...editing, cta_url: e.target.value })} /></div>
              </div>
              <div><Label>Payment URL (optional)</Label><Input value={editing.payment_url} onChange={(e) => setEditing({ ...editing, payment_url: e.target.value })} placeholder="https://razorpay.com/..." /></div>
              <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: +e.target.value })} /></div>
              <div className="flex items-center justify-between"><Label>Featured / Most Popular</Label><Switch checked={editing.highlighted} onCheckedChange={(v) => setEditing({ ...editing, highlighted: v })} /></div>
              <div className="flex items-center justify-between"><Label>Active</Label><Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => editing && save.mutate(editing)} disabled={save.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
