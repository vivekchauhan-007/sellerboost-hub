import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section } from "@/components/Section";

const faqs = [
  { q: "How does Flipkart account management work?", a: "We get limited access to your seller panel via Flipkart's authorized partner workflow. Our team then handles listings, ads, inventory and account health while sharing weekly reports." },
  { q: "Are there any hidden charges beyond the monthly plan?", a: "No. Our monthly plan covers all service charges. You only pay Flipkart directly for ad spends, commission and shipping — these are not part of our fee." },
  { q: "How is Sponsored Ads (PLA/PCA) managed?", a: "Certified specialists set up, test and optimize campaigns daily — bid management, negative keywords, A/B testing — to maximize ROAS within your monthly budget." },
  { q: "What does seller onboarding look like?", a: "Day 1 — kickoff call & access. Day 2-3 — audit and 30-day plan. Day 4 onwards — execution begins. You get a dedicated WhatsApp group from day one." },
  { q: "When is your support available?", a: "Monday to Saturday, 10am to 8pm IST via email, chat and WhatsApp. Premium plan customers get 24/7 emergency support." },
  { q: "Do you work with new Flipkart sellers?", a: "Absolutely. The Basic plan is designed for sellers who are just starting out and need help with listings, catalog and getting their first sales." },
];

export function FAQ() {
  return (
    <Section
      id="faq"
      eyebrow="FAQ"
      title="Frequently asked questions"
      subtitle="Everything you need to know before partnering with SellerBoost."
    >
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="bg-card border border-border rounded-2xl px-5 data-[state=open]:shadow-soft data-[state=open]:border-primary/30"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Section>
  );
}
