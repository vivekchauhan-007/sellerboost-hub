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

type Post = {
  id?: string; slug: string; title: string; excerpt: string; content: string;
  category: string; author: string; cover_image_url: string; published: boolean;
};
const EMPTY: Post = { slug: "", title: "", excerpt: "", content: "", category: "General", author: "SellerBoost Team", cover_image_url: "", published: false };

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);

export const Route = createFileRoute("/_authenticated/admin/blog")({ component: BlogAdmin });

function BlogAdmin() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Post | null>(null);
  const { data: rows = [] } = useQuery({
    queryKey: ["admin", "blog_posts"],
    queryFn: async () => { const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false }); if (error) throw error; return data as Post[]; },
  });
  const save = useMutation({
    mutationFn: async (p: Post) => {
      const payload = { ...p, published_at: p.published ? new Date().toISOString() : null };
      if (p.id) { const { error } = await supabase.from("blog_posts").update(payload).eq("id", p.id); if (error) throw error; }
      else { const { id, ...ins } = payload; const { error } = await supabase.from("blog_posts").insert(ins); if (error) throw error; }
    },
    onSuccess: () => { toast.success("Saved"); setEditing(null); qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] }); qc.invalidateQueries({ queryKey: ["public", "blog_posts"] }); },
    onError: (e: Error) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("blog_posts").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin", "blog_posts"] }); qc.invalidateQueries({ queryKey: ["public", "blog_posts"] }); },
  });

  return (
    <AdminShell title="Blog Posts" actions={<Button size="sm" onClick={() => setEditing({ ...EMPTY })}><Plus className="size-4 mr-1" />New Post</Button>}>
      <div className="bg-card border border-border rounded-xl divide-y">
        {rows.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">No posts yet. Click "New Post" to start.</p>}
        {rows.map((p) => (
          <div key={p.id} className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold truncate">{p.title}</h3>
                <span className={`text-xs px-2 py-0.5 rounded ${p.published ? "bg-success/15 text-success" : "bg-secondary"}`}>{p.published ? "Published" : "Draft"}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">/{p.slug} • {p.category}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditing({ ...p })}><Edit2 className="size-4" /></Button>
            <Button variant="ghost" size="icon" onClick={() => confirm("Delete?") && del.mutate(p.id!)}><Trash2 className="size-4 text-destructive" /></Button>
          </div>
        ))}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit" : "New"} Post</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div><Label>Title</Label><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></div>
              <div><Label>Slug</Label><Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></div>
                <div><Label>Author</Label><Input value={editing.author} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></div>
              </div>
              <div><Label>Cover Image URL</Label><Input value={editing.cover_image_url} onChange={(e) => setEditing({ ...editing, cover_image_url: e.target.value })} /></div>
              <div><Label>Excerpt</Label><Textarea rows={2} value={editing.excerpt} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} /></div>
              <div><Label>Content (Markdown / HTML)</Label><Textarea rows={10} value={editing.content} onChange={(e) => setEditing({ ...editing, content: e.target.value })} /></div>
              <div className="flex items-center justify-between"><Label>Published</Label><Switch checked={editing.published} onCheckedChange={(v) => setEditing({ ...editing, published: v })} /></div>
            </div>
          )}
          <DialogFooter><Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button><Button onClick={() => editing && save.mutate(editing)}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
