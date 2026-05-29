import { Info } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function DisclaimerBar() {
  const s = useSiteSettings();
  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-primary text-primary-foreground text-xs sm:text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-center">
        <Info className="size-3.5 sm:size-4 shrink-0" />
        <p className="font-medium leading-tight">{s.disclaimer}</p>
      </div>
    </div>
  );
}
