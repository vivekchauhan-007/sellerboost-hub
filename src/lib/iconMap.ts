import {
  ListChecks, FolderKanban, Megaphone, Boxes, PackageCheck, HeartPulse,
  Search, Store, TrendingUp, Eye, RotateCcw, BadgeIndianRupee, Star,
  Award, LineChart, Headphones, FileText, Target, Sparkles, ShieldCheck,
  Users, BarChart3, Package, type LucideIcon,
} from "lucide-react";

export const iconMap: Record<string, LucideIcon> = {
  ListChecks, FolderKanban, Megaphone, Boxes, PackageCheck, HeartPulse,
  Search, Store, TrendingUp, Eye, RotateCcw, BadgeIndianRupee, Star,
  Award, LineChart, Headphones, FileText, Target, Sparkles, ShieldCheck,
  Users, BarChart3, Package,
};

export const iconNames = Object.keys(iconMap);

export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return ListChecks;
  return iconMap[name] ?? ListChecks;
}
