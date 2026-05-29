import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type Settings = {
  business_name: string; tagline: string; phone: string; email: string;
  whatsapp_number: string; address: string;
  facebook_url: string; instagram_url: string; linkedin_url: string; twitter_url: string;
  disclaimer: string;
};

export const Route = createFileRoute("/_authenticated/admin/settings")({ component: SettingsAdmin });

function SettingsAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState<Settings | null>(null);
  const { data } = useQuery({
    queryKey: ["admin", "site_settings"],
    queryFn: async () => { const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle(); if (error) throw error; return data as Settings | null; },
  });
  useEffect(() => { if (data && !form) setForm(data); }, [data, form]);

  const save = useMutation({
    mutationFn: async (s: Settings) => {
      const { error } = await supabase.from("site_settings").update(s).eq("id", 1);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Settings saved"); qc.invalidateQueries({ queryKey: ["site_settings"] }); qc.invalidateQueries({ queryKey: ["admin", "site_settings"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!form) return <AdminShell title="Site Settings"><p className="text-sm text-muted-foreground">Loading…</p></AdminShell>;

  const F = (k: keyof Settings, label: string, multiline = false) => (
    <div>
      <Label>{label}</Label>
      {multiline
        ? <Textarea rows={3} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1.5" />
        : <Input value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="mt-1.5" />}
    </div>
  );

  return (
    <AdminShell title="Site Settings" actions={<Button size="sm" onClick={() => save.mutate(form)} disabled={save.isPending}>Save Changes</Button>}>
      <div className="bg-card border border-border rounded-xl p-6 space-y-5 max-w-2xl">
        <div className="grid sm:grid-cols-2 gap-4">
          {F("business_name", "Business Name")}
          {F("tagline", "Tagline")}
          {F("phone", "Phone")}
          {F("email", "Email")}
          {F("whatsapp_number", "WhatsApp Number (no +)")}
        </div>
        {F("address", "Address", true)}
        {F("disclaimer", "Third-party Disclaimer", true)}
        <div>
          <h3 className="font-semibold mt-4 mb-2">Social Links</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {F("facebook_url", "Facebook URL")}
            {F("instagram_url", "Instagram URL")}
            {F("linkedin_url", "LinkedIn URL")}
            {F("twitter_url", "Twitter / X URL")}
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
