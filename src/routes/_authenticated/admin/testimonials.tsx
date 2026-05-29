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
import { Plus, Edit2, Trash2, Star } from "lucide-react";
import { toast } from "sonner";

type T = { id?: string; name: string; role: string; quote: string; initials: string; rating: number; sort_order: number; is_active: boolean };
const EMPTY: T = { name: "", role: "", quote: "", initials: "", rating: 5, sort_order: 0, is_active: true };

export const Route = createFileRoute("/_authenticated/admin/testimonials")({ component: TAdmin });

function TAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<T | null>(null);
  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: async () => { const { data, error } = await supabase.from("testimonials").select("*").order("sort_order"); if (error) throw error; return data as T[]; },
  });
  const save = useMutation({
    mutationFn: async (t: T) => {
      if (t.id) { const { error } = await supabase.from("testimonials").update(t).eq("id", t.id); if (error) throw error; }
      else { const { id, ...ins } = t; const { error } = await supabase.from("testimonials").insert(ins); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin", "testimonials"] }); qc.invalidateQueries({ queryKey: ["public", "testimonials"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("testimonials").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "testimonials"] }); qc.invalidateQueries({ queryKey: ["public", "testimonials"] }); },
  });

  return (
    <AdminShell title="Testimonials" actions={<Button size="sm" onClick={() => setEditing({ ...EMPTY })}><Plus className="size-4 mr-1" />Add</Button>}>
      <div className="grid sm:grid-cols-2 gap-3">
        {rows.map((t) => (
          <div key={t.id} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold text-sm">{t.initials || t.name.slice(0,2).toUpperCase()}</div>
              <div className="flex-1"><p className="font-semibold text-sm">{t.name}</p><p className="text-xs text-muted-foreground">{t.role}</p></div>
              <div className="flex">{Array.from({length: t.rating}).map((_,i)=><Star key={i} className="size-3 fill-accent text-accent"/>)}</div>
            </div>
            <p className="text-sm mt-3 line-clamp-3">"{t.quote}"</p>
            <div className="flex gap-1 mt-3 justify-end">
              {!t.is_active && <span className="text-xs bg-secondary px-2 py-0.5 rounded mr-auto self-center">Inactive</span>}
              <Button variant="ghost" size="icon" onClick={() => setEditing({ ...t })}><Edit2 className="size-4"/></Button>
              <Button variant="ghost" size="icon" onClick={() => confirm("Delete?") && del.mutate(t.id!)}><Trash2 className="size-4 text-destructive"/></Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Testimonial</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Name</Label><Input value={editing.name} onChange={(e)=>setEditing({...editing,name:e.target.value})}/></div>
                <div><Label>Initials</Label><Input maxLength={3} value={editing.initials} onChange={(e)=>setEditing({...editing,initials:e.target.value})}/></div>
              </div>
              <div><Label>Role</Label><Input value={editing.role} onChange={(e)=>setEditing({...editing,role:e.target.value})}/></div>
              <div><Label>Quote</Label><Textarea rows={4} value={editing.quote} onChange={(e)=>setEditing({...editing,quote:e.target.value})}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Rating (1-5)</Label><Input type="number" min={1} max={5} value={editing.rating} onChange={(e)=>setEditing({...editing,rating:+e.target.value})}/></div>
                <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e)=>setEditing({...editing,sort_order:+e.target.value})}/></div>
              </div>
              <div className="flex items-center justify-between"><Label>Active</Label><Switch checked={editing.is_active} onCheckedChange={(v)=>setEditing({...editing,is_active:v})}/></div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={()=>setEditing(null)}>Cancel</Button><Button onClick={()=>editing && save.mutate(editing)}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
