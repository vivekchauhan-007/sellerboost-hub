import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminGate, AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/testimonials")({
  component: () => (
    <AdminGate>
      <AdminShell title="Testimonials">
        <TestimonialsAdmin />
      </AdminShell>
    </AdminGate>
  ),
});

type T = {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  rating: number;
  initials: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

const empty: Partial<T> = { name: "", role: "", quote: "", rating: 5, initials: "", image_url: "", sort_order: 0, is_active: true };

function TestimonialsAdmin() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<T>>(empty);

  const { data: items = [] } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase.from("testimonials").select("*").order("sort_order");
      if (error) throw error;
      return data as T[];
    },
  });

  const save = async () => {
    if (!editing.name || !editing.quote) return toast.error("Name and quote required");
    const { error } = editing.id
      ? await supabase.from("testimonials").update(editing).eq("id", editing.id)
      : await supabase.from("testimonials").insert(editing as any);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setOpen(false);
    qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
  };

  const toggle = async (t: T) => {
    await supabase.from("testimonials").update({ is_active: !t.is_active }).eq("id", t.id);
    qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("testimonials").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => { setEditing(empty); setOpen(true); }}><Plus className="h-4 w-4 mr-2" /> Add</Button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map((t) => (
          <Card key={t.id} className={t.is_active ? "" : "opacity-60"}>
            <CardContent className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  {t.image_url ? <img src={t.image_url} className="w-10 h-10 rounded-full object-cover" alt={t.name} /> : <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium">{t.initials || t.name[0]}</div>}
                  <div>
                    <div className="font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Switch checked={t.is_active} onCheckedChange={() => toggle(t)} />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">"{t.quote}"</p>
              <div className="flex justify-end gap-1">
                <Button size="icon" variant="ghost" onClick={() => { setEditing(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(t.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {items.length === 0 && <div className="col-span-full text-center text-sm text-muted-foreground py-8">No testimonials.</div>}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing.id ? "Edit" : "Add"} testimonial</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name</Label><Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></div>
              <div><Label>Role</Label><Input value={editing.role || ""} onChange={(e) => setEditing({ ...editing, role: e.target.value })} /></div>
            </div>
            <div><Label>Quote</Label><Textarea rows={4} value={editing.quote || ""} onChange={(e) => setEditing({ ...editing, quote: e.target.value })} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label>Initials</Label><Input value={editing.initials || ""} onChange={(e) => setEditing({ ...editing, initials: e.target.value })} /></div>
              <div><Label>Rating</Label><Input type="number" min={1} max={5} value={editing.rating ?? 5} onChange={(e) => setEditing({ ...editing, rating: Number(e.target.value) })} /></div>
              <div><Label>Order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} /></div>
            </div>
            <div><Label>Image URL</Label><Input value={editing.image_url || ""} onChange={(e) => setEditing({ ...editing, image_url: e.target.value })} /></div>
            <div className="flex items-center gap-2">
              <Switch checked={!!editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
              <Label>Visible</Label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
