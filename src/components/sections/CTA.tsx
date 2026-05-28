import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-border bg-card p-10 lg:p-16 text-center">
          <div className="absolute inset-0 bg-gradient-mesh opacity-60" />
          <div className="relative">
            <h2 className="text-3xl lg:text-5xl font-bold max-w-3xl mx-auto">
              Ready to <span className="text-gradient-primary">boost your Flipkart sales?</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Talk to our experts today and get a free, no-obligation account audit.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/contact">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-elegant gap-2">
                  Get Free Consultation <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="outline" className="border-2">See Pricing</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
