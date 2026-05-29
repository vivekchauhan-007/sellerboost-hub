import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Mail, Phone, Eye, CheckCheck } from "lucide-react";
import { toast } from "sonner";

type Sub = {
  id: string; name: string; email: string | null; phone: string | null;
  business: string | null; sales_range: string | null; message: string | null;
  source: string; is_read: boolean; created_at: string;
};

export const Route = createFileRoute("/_authenticated/admin/submissions")({ component: SubsAdmin });

function SubsAdmin() {
  const qc = useQueryClient();
  const [viewing, setViewing] = useState<Sub | null>(null);
  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "submissions"],
    queryFn: async () => { const { data, error } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }); if (error) throw error; return data as Sub[]; },
  });
  const markRead = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => { const { error } = await supabase.from("contact_submissions").update({ is_read }).eq("id", id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "submissions"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("contact_submissions").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "submissions"] }); },
  });

  const view = (s: Sub) => { setViewing(s); if (!s.is_read) markRead.mutate({ id: s.id, is_read: true }); };

  return (
    <AdminShell title="Form Submissions">
      <div className="bg-card border border-border rounded-xl divide-y">
        {rows.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">No submissions yet.</p>}
        {rows.map((s) => (
          <div key={s.id} className={`p-4 flex items-center gap-4 ${!s.is_read ? "bg-primary/5" : ""}`}>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {!s.is_read && <span className="size-2 rounded-full bg-primary" />}
                <h3 className="font-semibold">{s.name}</h3>
                <span className="text-xs bg-secondary px-2 py-0.5 rounded uppercase">{s.source}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1 flex gap-3 flex-wrap">
                {s.email && <span className="flex items-center gap-1"><Mail className="size-3"/>{s.email}</span>}
                {s.phone && <span className="flex items-center gap-1"><Phone className="size-3"/>{s.phone}</span>}
                {s.business && <span>{s.business}</span>}
                <span>{new Date(s.created_at).toLocaleString()}</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => view(s)}><Eye className="size-4"/></Button>
            <Button variant="ghost" size="icon" onClick={() => markRead.mutate({ id: s.id, is_read: !s.is_read })}><CheckCheck className={`size-4 ${s.is_read ? "text-muted-foreground" : ""}`}/></Button>
            <Button variant="ghost" size="icon" onClick={() => confirm("Delete?") && del.mutate(s.id)}><Trash2 className="size-4 text-destructive"/></Button>
          </div>
        ))}
      </div>

      <Dialog open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{viewing?.name}</DialogTitle></DialogHeader>
          {viewing && (
            <div className="space-y-2 text-sm">
              <p><b>Source:</b> {viewing.source}</p>
              {viewing.email && <p><b>Email:</b> <a href={`mailto:${viewing.email}`} className="text-primary">{viewing.email}</a></p>}
              {viewing.phone && <p><b>Phone:</b> <a href={`tel:${viewing.phone}`} className="text-primary">{viewing.phone}</a></p>}
              {viewing.business && <p><b>Business:</b> {viewing.business}</p>}
              {viewing.sales_range && <p><b>Monthly Sales:</b> {viewing.sales_range}</p>}
              {viewing.message && <div><b>Message:</b><p className="mt-1 whitespace-pre-wrap p-3 bg-secondary rounded">{viewing.message}</p></div>}
              <p className="text-xs text-muted-foreground pt-2">Received {new Date(viewing.created_at).toLocaleString()}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
