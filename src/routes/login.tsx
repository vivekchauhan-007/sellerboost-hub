import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { TrendingUp, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Admin Login — SellerBoost" }, { name: "robots", content: "noindex" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session && isAdmin) navigate({ to: "/admin" });
  }, [session, isAdmin, loading, navigate]);

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
  };

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      options: {
        emailRedirectTo: `${window.location.origin}/admin`,
        data: { full_name: String(fd.get("name") ?? "") },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created. Signing you in…");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-background/15 grid place-items-center">
            <TrendingUp className="size-5" />
          </div>
          <span className="font-bold text-lg">SellerBoost</span>
        </Link>
        <div>
          <Shield className="size-10 mb-4 opacity-90" />
          <h1 className="text-3xl font-bold leading-tight">Admin Control Panel</h1>
          <p className="mt-3 text-primary-foreground/80 max-w-sm">
            Manage pricing, services, blog posts, testimonials, site settings and inbound leads — all in one place.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/60">© {new Date().getFullYear()} SellerBoost</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-bold">Welcome</h2>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your admin account.</p>

          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={onSignIn} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required minLength={6} className="mt-1.5" />
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground">
                  {busy ? "Signing in…" : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={onSignUp} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name2">Full Name</Label>
                  <Input id="name2" name="name" required maxLength={80} className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="email2">Email</Label>
                  <Input id="email2" name="email" type="email" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="password2">Password</Label>
                  <Input id="password2" name="password" type="password" required minLength={6} className="mt-1.5" />
                </div>
                <Button type="submit" disabled={busy} className="w-full bg-gradient-primary text-primary-foreground">
                  {busy ? "Creating…" : "Create Account"}
                </Button>
                <p className="text-xs text-muted-foreground">First account automatically becomes the primary admin.</p>
              </form>
            </TabsContent>
          </Tabs>

          <Link to="/" className="block mt-6 text-xs text-muted-foreground hover:text-foreground text-center">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
