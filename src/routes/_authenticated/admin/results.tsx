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

type S = { id?: string; value: string; label: string; description: string; icon: string; tone: string; sort_order: number; is_active: boolean };
const EMPTY: S = { value: "", label: "", description: "", icon: "TrendingUp", tone: "primary", sort_order: 0, is_active: true };

export const Route = createFileRoute("/_authenticated/admin/results")({ component: ResultsAdmin });

function ResultsAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<S | null>(null);
  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "results_stats"],
    queryFn: async () => { const { data, error } = await supabase.from("results_stats").select("*").order("sort_order"); if (error) throw error; return data as S[]; },
  });
  const save = useMutation({
    mutationFn: async (s: S) => {
      if (s.id) { const { error } = await supabase.from("results_stats").update(s).eq("id", s.id); if (error) throw error; }
      else { const { id, ...ins } = s; const { error } = await supabase.from("results_stats").insert(ins); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin", "results_stats"] }); qc.invalidateQueries({ queryKey: ["public", "results_stats"] }); },
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("results_stats").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "results_stats"] }); qc.invalidateQueries({ queryKey: ["public", "results_stats"] }); },
  });

  return (
    <AdminShell title="Results & Stats" actions={<Button size="sm" onClick={() => setEditing({ ...EMPTY })}><Plus className="size-4 mr-1" />Add</Button>}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((s) => {
          const Icon = getIcon(s.icon);
          return (
            <div key={s.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="size-10 rounded-lg bg-gradient-primary grid place-items-center shrink-0"><Icon className="size-5 text-primary-foreground" /></div>
                <div className="flex-1"><p className="text-2xl font-bold">{s.value}</p><p className="font-semibold text-sm">{s.label}</p><p className="text-xs text-muted-foreground">{s.description}</p></div>
              </div>
              <div className="flex gap-1 justify-end mt-2">
                <Button variant="ghost" size="icon" onClick={() => setEditing({ ...s })}><Edit2 className="size-4" /></Button>
                <Button variant="ghost" size="icon" onClick={() => confirm("Delete?") && del.mutate(s.id!)}><Trash2 className="size-4 text-destructive" /></Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Stat</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Value</Label><Input value={editing.value} onChange={(e)=>setEditing({...editing,value:e.target.value})} placeholder="+312%"/></div>
                <div><Label>Label</Label><Input value={editing.label} onChange={(e)=>setEditing({...editing,label:e.target.value})}/></div>
              </div>
              <div><Label>Description</Label><Textarea rows={2} value={editing.description} onChange={(e)=>setEditing({...editing,description:e.target.value})}/></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Icon</Label>
                  <Select value={editing.icon} onValueChange={(v)=>setEditing({...editing,icon:v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{iconNames.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Tone</Label>
                  <Select value={editing.tone} onValueChange={(v)=>setEditing({...editing,tone:v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="primary">primary</SelectItem><SelectItem value="accent">accent</SelectItem><SelectItem value="success">success</SelectItem></SelectContent>
                  </Select>
                </div>
              </div>
              <div><Label>Sort Order</Label><Input type="number" value={editing.sort_order} onChange={(e)=>setEditing({...editing,sort_order:+e.target.value})}/></div>
              <div className="flex items-center justify-between"><Label>Active</Label><Switch checked={editing.is_active} onCheckedChange={(v)=>setEditing({...editing,is_active:v})}/></div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={()=>setEditing(null)}>Cancel</Button><Button onClick={()=>editing && save.mutate(editing)}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
