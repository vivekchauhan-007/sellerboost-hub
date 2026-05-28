import { Link } from "@tanstack/react-router";
import { TrendingUp, Mail, Phone, MapPin, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="size-9 rounded-xl bg-gradient-primary grid place-items-center">
                <TrendingUp className="size-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">SellerBoost</span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              India's trusted Flipkart seller account management agency. We help sellers scale with data-driven growth strategies.
            </p>
            <div className="flex gap-3 mt-5">
              {[Facebook, Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="size-9 rounded-lg bg-background/10 hover:bg-accent hover:text-accent-foreground transition-colors grid place-items-center"
                  aria-label="Social link"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/pricing", label: "Pricing" },
                { to: "/about", label: "About Us" },
                { to: "/blog", label: "Blog" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-accent transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>Product Listing Optimization</li>
              <li>Sponsored Ads Management</li>
              <li>Catalog Management</li>
              <li>Account Health</li>
              <li>Brand Store Setup</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="size-4 mt-0.5 shrink-0 text-accent" />
                <span>Bengaluru, Karnataka, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4 text-accent" />
                <a href="tel:+919876543210" className="hover:text-accent">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 text-accent" />
                <a href="mailto:hello@sellerboost.in" className="hover:text-accent">hello@sellerboost.in</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-background/60">
          <p>© {new Date().getFullYear()} SellerBoost. All rights reserved.</p>
          <p>Not affiliated with Flipkart Internet Pvt Ltd.</p>
        </div>
      </div>
    </footer>
  );
}
