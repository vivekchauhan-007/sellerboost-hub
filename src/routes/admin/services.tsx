import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminGate, AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/services")({
  component: () => (
    <AdminGate>
      <AdminShell title="Services & Pricing">
        <ServicesAdmin />
      </AdminShell>
    </AdminGate>
  ),
});

function ServicesAdmin() {
  return (
    <div className="space-y-8">
      <ServicesSection />
      <PricingSection />
    </div>
  );
}

type Service = { id: string; title: string; description: string; icon: string; sort_order: number; is_active: boolean };
const emptyService: Partial<Service> = { title: "", description: "", icon: "Sparkles", sort_order: 0, is_active: true };

function ServicesSection() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Partial<Service>>(emptyService);
  const { data: items = [] } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => (await supabase.from("services").select("*").order("sort_order")).data as Service[],
  });

  const save = async () => {
    if (!edit.title) return toast.error("Title required");
    const { error } = edit.id
      ? await supabase.from("services").update(edit).eq("id", edit.id)
      : await supabase.from("services").insert(edit as any);
    if (error) return toast.error(error.message);
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-services"] });
  };
  const remove = async (id: string) => { if (confirm("Delete?")) { await supabase.from("services").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-services"] }); } };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Services</CardTitle>
        <Button size="sm" onClick={() => { setEdit(emptyService); setOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add</Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((s) => (
          <div key={s.id} className="flex items-center justify-between gap-3 p-3 border rounded-lg">
            <div className="min-w-0">
              <div className="font-medium">{s.title}</div>
              <div className="text-xs text-muted-foreground line-clamp-1">{s.description}</div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => { setEdit(s); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(s.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center text-sm text-muted-foreground py-4">No services.</div>}
      </CardContent>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{edit.id ? "Edit" : "Add"} service</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Title</Label><Input value={edit.title || ""} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Icon (Lucide name)</Label><Input value={edit.icon || ""} onChange={(e) => setEdit({ ...edit, icon: e.target.value })} /></div>
              <div><Label>Order</Label><Input type="number" value={edit.sort_order ?? 0} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} /></div>
            </div>
            <div className="flex items-center gap-2"><Switch checked={!!edit.is_active} onCheckedChange={(v) => setEdit({ ...edit, is_active: v })} /><Label>Active</Label></div>
            <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

type Plan = { id: string; name: string; price_inr: number; period: string; tagline: string | null; features: string[]; cta_label: string; cta_url: string; payment_url: string | null; highlighted: boolean; is_active: boolean; sort_order: number };
const emptyPlan: Partial<Plan> = { name: "", price_inr: 0, period: "month", tagline: "", features: [], cta_label: "Get started", cta_url: "/contact", payment_url: "", highlighted: false, is_active: true, sort_order: 0 };

function PricingSection() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Partial<Plan>>(emptyPlan);
  const [featuresText, setFeaturesText] = useState("");

  const { data: items = [] } = useQuery({
    queryKey: ["admin-pricing"],
    queryFn: async () => (await supabase.from("pricing_plans").select("*").order("sort_order")).data as Plan[],
  });

  const openEdit = (p: Partial<Plan>) => {
    setEdit(p);
    setFeaturesText((p.features || []).join("\n"));
    setOpen(true);
  };

  const save = async () => {
    if (!edit.name || edit.price_inr == null) return toast.error("Name and price required");
    const payload = { ...edit, features: featuresText.split("\n").map((f) => f.trim()).filter(Boolean) };
    const { error } = edit.id
      ? await supabase.from("pricing_plans").update(payload).eq("id", edit.id)
      : await supabase.from("pricing_plans").insert(payload as any);
    if (error) return toast.error(error.message);
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-pricing"] });
  };

  const remove = async (id: string) => { if (confirm("Delete plan?")) { await supabase.from("pricing_plans").delete().eq("id", id); qc.invalidateQueries({ queryKey: ["admin-pricing"] }); } };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pricing plans</CardTitle>
        <Button size="sm" onClick={() => openEdit(emptyPlan)}><Plus className="h-4 w-4 mr-2" />Add plan</Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 p-3 border rounded-lg">
            <div>
              <div className="font-medium">{p.name} {p.highlighted && <span className="text-xs text-blue-600 ml-1">(Featured)</span>}</div>
              <div className="text-xs text-muted-foreground">₹{p.price_inr.toLocaleString()} / {p.period}</div>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => openEdit(p)}><Pencil className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" onClick={() => remove(p.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-center text-sm text-muted-foreground py-4">No plans.</div>}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{edit.id ? "Edit" : "Add"} pricing plan</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name</Label><Input value={edit.name || ""} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></div>
              <div><Label>Price (INR)</Label><Input type="number" value={edit.price_inr ?? 0} onChange={(e) => setEdit({ ...edit, price_inr: Number(e.target.value) })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Period</Label><Input value={edit.period || ""} onChange={(e) => setEdit({ ...edit, period: e.target.value })} /></div>
              <div><Label>Sort order</Label><Input type="number" value={edit.sort_order ?? 0} onChange={(e) => setEdit({ ...edit, sort_order: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Tagline</Label><Input value={edit.tagline || ""} onChange={(e) => setEdit({ ...edit, tagline: e.target.value })} /></div>
            <div><Label>Features (one per line)</Label><Textarea rows={5} value={featuresText} onChange={(e) => setFeaturesText(e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>CTA label</Label><Input value={edit.cta_label || ""} onChange={(e) => setEdit({ ...edit, cta_label: e.target.value })} /></div>
              <div><Label>CTA URL</Label><Input value={edit.cta_url || ""} onChange={(e) => setEdit({ ...edit, cta_url: e.target.value })} /></div>
            </div>
            <div>
              <Label>Payment Gateway URL (Razorpay / Stripe link)</Label>
              <Input value={edit.payment_url || ""} onChange={(e) => setEdit({ ...edit, payment_url: e.target.value })} placeholder="https://rzp.io/l/..." />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2"><Switch checked={!!edit.highlighted} onCheckedChange={(v) => setEdit({ ...edit, highlighted: v })} /><Label>Featured</Label></div>
              <div className="flex items-center gap-2"><Switch checked={!!edit.is_active} onCheckedChange={(v) => setEdit({ ...edit, is_active: v })} /><Label>Active</Label></div>
            </div>
            <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
