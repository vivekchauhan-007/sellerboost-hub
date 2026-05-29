import { useState } from "react";
import { z } from "zod";
import { MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  business: z.string().trim().min(2, "Enter your business name").max(120),
  sales: z.string().min(1, "Select monthly sales"),
});

export function AuditForm() {
  const settings = useSiteSettings();
  const [submitted, setSubmitted] = useState(false);
  const [sales, setSales] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      business: String(fd.get("business") ?? ""),
      sales,
    });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);

    setBusy(true);
    const { error } = await supabase.from("contact_submissions").insert({
      name: parsed.data.name, phone: parsed.data.phone, business: parsed.data.business,
      sales_range: parsed.data.sales, source: "audit",
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSubmitted(true);
    toast.success("Audit request received! We'll call you within 24 hours.");
  };

  return (
    <section id="audit" className="py-20 lg:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-primary-glow text-primary-foreground p-8 lg:p-14 shadow-elegant">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30 mix-blend-overlay" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div className="animate-fade-up">
              <span className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full bg-accent text-accent-foreground">
                Free Audit
              </span>
              <h2 className="mt-4 text-3xl lg:text-4xl font-bold leading-tight">
                Get a free Flipkart account audit worth ₹4,999
              </h2>
              <p className="mt-4 text-primary-foreground/85">
                Our experts will review your listings, ads, account health and reveal hidden growth opportunities — no commitment required.
              </p>
              <ul className="mt-6 space-y-2">
                {["Listing & SEO review", "Ad performance breakdown", "Catalog quality score", "30-day growth plan"].map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="size-4 text-accent-glow" /> {p}
                  </li>
                ))}
              </ul>
              <a
                href={`https://wa.me/${settings.whatsapp_number}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium underline-offset-4 hover:underline"
              >
                <MessageCircle className="size-4" /> Or chat with us on WhatsApp
              </a>
            </div>

            <div className="bg-background text-foreground rounded-2xl p-6 lg:p-8 shadow-elegant animate-fade-up" style={{ animationDelay: "100ms" }}>
              {submitted ? (
                <div className="text-center py-10">
                  <div className="size-14 mx-auto rounded-full bg-success/10 grid place-items-center">
                    <CheckCircle2 className="size-7 text-success" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold">Thanks! We've got your details.</h3>
                  <p className="mt-2 text-sm text-muted-foreground">A Flipkart expert will reach out within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" placeholder="Your name" required maxLength={80} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="10-digit mobile" required maxLength={10} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="business">Business Name</Label>
                    <Input id="business" name="business" placeholder="Your brand / store" required maxLength={120} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>Monthly Sales</Label>
                    <Select value={sales} onValueChange={setSales}>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select range" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="<1L">Below ₹1 Lakh</SelectItem>
                        <SelectItem value="1-5L">₹1L – ₹5L</SelectItem>
                        <SelectItem value="5-20L">₹5L – ₹20L</SelectItem>
                        <SelectItem value=">20L">Above ₹20L</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 gap-2">
                    {busy ? "Submitting…" : <>Request Free Audit <ArrowRight className="size-4" /></>}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">We respect your privacy. No spam ever.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
