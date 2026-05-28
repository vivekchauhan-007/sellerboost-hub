import { Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles, TrendingUp, Users, BarChart3, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-mesh opacity-70 pointer-events-none" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border shadow-soft text-xs font-medium">
              <Sparkles className="size-3.5 text-accent" />
              India's #1 Flipkart Growth Agency
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
              Grow Your <span className="text-gradient-primary">Flipkart Sales</span> Without Managing Everything Yourself
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              From listing optimization to ads, cataloging, inventory and account health —
              our experts handle your Flipkart store end-to-end so you can focus on growth.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant gap-2">
                  Get Free Consultation <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-2">View Plans</Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
              {[
                { icon: ShieldCheck, label: "Verified Partner" },
                { icon: Users, label: "500+ Sellers" },
                { icon: Star, label: "4.9/5 Rating" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <b.icon className="size-4 text-primary" />
                  <span className="font-medium">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dashboard mockup */}
          <div className="relative animate-fade-up" style={{ animationDelay: "150ms" }}>
            <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative bg-card rounded-2xl border border-border shadow-elegant p-5 lg:p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-xs text-muted-foreground">Flipkart Dashboard</p>
                  <p className="font-semibold">Sales Performance</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success font-medium">
                  +47% MoM
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { icon: TrendingUp, label: "Revenue", value: "₹12.4L", color: "text-primary" },
                  { icon: Package, label: "Orders", value: "2,847", color: "text-accent" },
                  { icon: BarChart3, label: "ROAS", value: "5.8x", color: "text-success" },
                ].map((s) => (
                  <div key={s.label} className="bg-secondary rounded-xl p-3">
                    <s.icon className={`size-4 ${s.color} mb-2`} />
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="font-bold text-sm">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-40 rounded-xl bg-gradient-to-br from-secondary to-background border border-border p-4 relative overflow-hidden">
                <svg viewBox="0 0 300 120" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.52 0.22 260)" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="oklch(0.52 0.22 260)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,90 C30,70 50,80 80,60 C120,30 150,55 180,40 C220,20 250,35 300,15 L300,120 L0,120 Z" fill="url(#g1)" />
                  <path d="M0,90 C30,70 50,80 80,60 C120,30 150,55 180,40 C220,20 250,35 300,15" fill="none" stroke="oklch(0.52 0.22 260)" strokeWidth="2.5" />
                </svg>
              </div>

              <div className="mt-4 space-y-2">
                {[
                  { name: "Cotton Kurta - Blue", sales: "₹84,200", up: true },
                  { name: "Wireless Earbuds Pro", sales: "₹62,890", up: true },
                ].map((p) => (
                  <div key={p.name} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2.5">
                      <div className="size-8 rounded-lg bg-gradient-accent" />
                      <span className="text-sm font-medium">{p.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-success">{p.sales}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* floating chips */}
            <div className="hidden sm:flex absolute -left-6 top-1/3 bg-card rounded-xl shadow-elegant border border-border p-3 items-center gap-2 animate-float">
              <div className="size-9 rounded-lg bg-success/10 grid place-items-center">
                <TrendingUp className="size-4 text-success" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Conversion</p>
                <p className="text-sm font-bold">+62%</p>
              </div>
            </div>
            <div className="hidden sm:flex absolute -right-4 bottom-12 bg-card rounded-xl shadow-elegant border border-border p-3 items-center gap-2 animate-float" style={{ animationDelay: "1s" }}>
              <div className="size-9 rounded-lg bg-accent/10 grid place-items-center">
                <Star className="size-4 text-accent" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Rating</p>
                <p className="text-sm font-bold">4.8 ★</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
