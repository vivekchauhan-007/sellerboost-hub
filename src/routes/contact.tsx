import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(120),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile"),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SellerBoost" },
      { name: "description", content: "Get in touch with SellerBoost for Flipkart account management, audits and growth consultations." },
      { property: "og:title", content: "Contact — SellerBoost" },
      { property: "og:description", content: "Talk to India's leading Flipkart seller agency." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [done, setDone] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = schema.safeParse({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      message: String(fd.get("message") ?? ""),
    });
    if (!r.success) {
      toast.error(r.error.issues[0].message);
      return;
    }
    setDone(true);
    toast.success("Message sent! We'll get back within 24 hours.");
  };

  return (
    <Layout>
      <Section
        className="pt-32"
        eyebrow="Contact"
        title={<>Let's <span className="text-gradient-primary">talk growth</span></>}
        subtitle="Reach out for a free consultation or ask anything about Flipkart selling."
      >
        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: MapPin, t: "Office", d: "WeWork Galaxy, Residency Road, Bengaluru 560025" },
              { icon: Phone, t: "Phone", d: "+91 98765 43210" },
              { icon: Mail, t: "Email", d: "hello@sellerboost.in" },
              { icon: MessageCircle, t: "WhatsApp", d: "Chat with an expert instantly" },
            ].map((c) => (
              <div key={c.t} className="bg-card border border-border rounded-2xl p-5 flex gap-4 hover:shadow-soft transition">
                <div className="size-11 rounded-xl bg-gradient-primary grid place-items-center shrink-0">
                  <c.icon className="size-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold">{c.t}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{c.d}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 bg-card border border-border rounded-2xl p-7 shadow-soft">
            {done ? (
              <div className="text-center py-14">
                <div className="size-14 mx-auto rounded-full bg-success/10 grid place-items-center">
                  <CheckCircle2 className="size-7 text-success" />
                </div>
                <h3 className="mt-4 text-xl font-bold">Message sent!</h3>
                <p className="mt-2 text-sm text-muted-foreground">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" required maxLength={80} className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" type="tel" required maxLength={10} className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required maxLength={120} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="message">How can we help?</Label>
                  <Textarea id="message" name="message" required maxLength={1000} rows={5} className="mt-1.5" />
                </div>
                <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90">
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </Section>
    </Layout>
  );
}
