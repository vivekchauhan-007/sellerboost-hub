import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, Tag, Wrench, Star, BarChart3, Newspaper,
  Settings, Inbox, LogOut, TrendingUp, Menu, X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/pricing", label: "Pricing Plans", icon: Tag },
  { to: "/admin/services", label: "Services", icon: Wrench },
  { to: "/admin/testimonials", label: "Testimonials", icon: Star },
  { to: "/admin/results", label: "Results & Stats", icon: BarChart3 },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/submissions", label: "Submissions", icon: Inbox },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
] as const;

export function AdminShell({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  const onSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  const SidebarBody = (
    <div className="flex flex-col h-full">
      <div className="px-5 h-16 flex items-center gap-2 border-b border-border">
        <div className="size-8 rounded-lg bg-gradient-primary grid place-items-center">
          <TrendingUp className="size-4 text-primary-foreground" />
        </div>
        <span className="font-bold">SellerBoost</span>
        <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-secondary text-muted-foreground ml-auto">Admin</span>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map((n) => {
          const active = n.exact ? path === n.to : path === n.to || path.startsWith(n.to + "/");
          return (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <n.icon className="size-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-border">
        <p className="text-xs text-muted-foreground px-2 truncate mb-2">{user?.email}</p>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={onSignOut}>
          <LogOut className="size-4" /> Sign out
        </Button>
        <Link to="/" className="block mt-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1">
          ← View website
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/30">
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-30">
        {SidebarBody}
      </aside>
      {open && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 lg:hidden">{SidebarBody}</aside>
        </>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b border-border h-16 flex items-center px-4 lg:px-8 gap-3">
          <button className="lg:hidden p-2 rounded hover:bg-secondary" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="size-5" />
          </button>
          <h1 className="text-lg font-semibold">{title}</h1>
          <div className="ml-auto flex items-center gap-2">{actions}</div>
        </header>
        <main className="p-4 lg:p-8 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
