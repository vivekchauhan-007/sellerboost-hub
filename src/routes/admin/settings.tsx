import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminGate, AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: () => (
    <AdminGate>
      <AdminShell title="Site Settings">
        <SettingsAdmin />
      </AdminShell>
    </AdminGate>
  ),
});

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data: s } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => (await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle()).data,
  });
  const [form, setForm] = useState<any>({});
  useEffect(() => { if (s) setForm(s); }, [s]);

  const save = async () => {
    const { id, updated_at, ...rest } = form;
    const { error } = await supabase.from("site_settings").upsert({ id: 1, ...rest });
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
    qc.invalidateQueries({ queryKey: ["admin-site-settings"] });
    qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <div className="space-y-4 max-w-3xl">
      <Card>
        <CardHeader><CardTitle>Business</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div><Label>Business name</Label><Input value={form.business_name || ""} onChange={(e) => set("business_name", e.target.value)} /></div>
          <div><Label>Tagline</Label><Input value={form.tagline || ""} onChange={(e) => set("tagline", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Disclaimer</Label><Textarea rows={2} value={form.disclaimer || ""} onChange={(e) => set("disclaimer", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div><Label>Phone</Label><Input value={form.phone || ""} onChange={(e) => set("phone", e.target.value)} /></div>
          <div><Label>WhatsApp number</Label><Input value={form.whatsapp_number || ""} onChange={(e) => set("whatsapp_number", e.target.value)} /></div>
          <div><Label>Email</Label><Input value={form.email || ""} onChange={(e) => set("email", e.target.value)} /></div>
          <div className="sm:col-span-2"><Label>Address</Label><Textarea rows={2} value={form.address || ""} onChange={(e) => set("address", e.target.value)} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Social</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          <div><Label>Instagram</Label><Input value={form.instagram_url || ""} onChange={(e) => set("instagram_url", e.target.value)} /></div>
          <div><Label>Facebook</Label><Input value={form.facebook_url || ""} onChange={(e) => set("facebook_url", e.target.value)} /></div>
          <div><Label>LinkedIn</Label><Input value={form.linkedin_url || ""} onChange={(e) => set("linkedin_url", e.target.value)} /></div>
          <div><Label>Twitter</Label><Input value={form.twitter_url || ""} onChange={(e) => set("twitter_url", e.target.value)} /></div>
        </CardContent>
      </Card>

      <div className="flex justify-end"><Button onClick={save}>Save settings</Button></div>
    </div>
  );
}
