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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { iconNames, getIcon } from "@/lib/iconMap";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Svc = { id?: string; title: string; description: string; icon: string; is_active: boolean; sort_order: number };
const EMPTY: Svc = { title: "", description: "", icon: "ListChecks", is_active: true, sort_order: 0 };

export const Route = createFileRoute("/_authenticated/admin/services")({ component: ServicesAdmin });

function ServicesAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Svc | null>(null);
  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => {
      const { data, error } = await supabase.from("services").select("*").order("sort_order");
      if (error) throw error;
      return data as Svc[];
    },
  });
  const save = useMutation({
    mutationFn: async (s: Svc) => {
      if (s.id) { const { error } = await supabase.from("services").update(s).eq("id", s.id); if (error) throw error; }
      else { const { id, ...ins } = s; const { error } = await supabase.from("services").insert(ins); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin", "services"] }); qc.invalidateQueries({ queryKey: ["public", "services"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("services").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "services"] }); qc.invalidateQueries({ queryKey: ["public", "services"] }); },
  });

  return (
    <AdminShell title="Services" actions={<Button size="sm" onClick={() => setEditing({ ...EMPTY })}><Plus className="size-4 mr-1" />Add</Button>}>
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map((s) => {
          const Icon = getIcon(s.icon);
          return (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4 flex gap-3">
              <div className="size-10 rounded-lg bg-gradient-primary grid place-items-center shrink-0">
                <Icon className="size-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2"><h3 className="font-semibold">{s.title}</h3>{!s.is_active && <span className="text-xs bg-secondary px-2 py-0.5 rounded">Inactive</span>}</div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{s.description}</p>
              </div>
              <div className="flex flex-col">
                <Button variant="ghost" size="icon" onClick={() => setEditing({ ...s })}><Edit2 className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => confirm("Delete?") && del.mutate(s.id!)}><Trash2 className="size-4 text-destructive" /></Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Service</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></div>
              <div><Label>Description</Label><Textarea rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></div>
              <div><Label>Icon</Label>
                <Select value={editing.icon} onValueChange={(v) => setEditing({ ...editing, icon: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{iconNames.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: +e.target.value })} /></div>
              <div className="flex items-center justify-between"><Label>Active</Label><Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} /></div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={() => editing && save.mutate(editing)}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
