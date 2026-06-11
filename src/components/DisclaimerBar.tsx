import { Info } from "lucide-react";

export function DisclaimerBar() {
  return (
    <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-primary text-primary-foreground text-xs sm:text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-center gap-2 text-center">
        <Info className="size-3.5 sm:size-4 shrink-0" />
        <p className="font-medium leading-tight">
          SellerBoost is an independent third-party service provider and is not affiliated with, endorsed by, or part of Flipkart Internet Pvt. Ltd.
        </p>
      </div>
    </div>
  );
}
