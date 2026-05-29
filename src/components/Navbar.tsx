import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-9 sm:top-10 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center shadow-elegant group-hover:scale-105 transition-transform">
              <TrendingUp className="size-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">
              Seller<span className="text-gradient-accent">Boost</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                activeProps={{ className: "text-foreground bg-secondary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Admin</Button>
            </Link>
            <Link to="/contact">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant">
                Get Free Audit
              </Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>

        {open && (
          <div className="lg:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary"
                  activeProps={{ className: "bg-secondary text-primary" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              ))}
              <Link to="/contact" onClick={() => setOpen(false)} className="mt-2">
                <Button className="w-full bg-gradient-primary text-primary-foreground">
                  Get Free Audit
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
