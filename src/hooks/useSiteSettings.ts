import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  id: number;
  business_name: string;
  tagline: string | null;
  phone: string;
  email: string;
  whatsapp_number: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  twitter_url: string;
  disclaimer: string;
};

const DEFAULTS: SiteSettings = {
  id: 1,
  business_name: "SellerBoost",
  tagline: "",
  phone: "+91 98765 43210",
  email: "hello@sellerboost.in",
  whatsapp_number: "919876543210",
  address: "Bengaluru, Karnataka, India",
  facebook_url: "#",
  instagram_url: "#",
  linkedin_url: "#",
  twitter_url: "#",
  disclaimer: "SellerBoost is an independent third-party service provider and is not affiliated with, endorsed by, or part of Flipkart Internet Pvt. Ltd.",
};

export function useSiteSettings() {
  const { data } = useQuery({
    queryKey: ["site_settings"],
    queryFn: async (): Promise<SiteSettings> => {
      const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
      if (error || !data) return DEFAULTS;
      return { ...DEFAULTS, ...data } as SiteSettings;
    },
    staleTime: 60_000,
  });
  return data ?? DEFAULTS;
}
