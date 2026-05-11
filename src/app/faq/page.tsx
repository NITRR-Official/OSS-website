import { Container } from "@/components/layout/Container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { FAQ } from "@/types/faq";
import faqData from "@/data/faq.json";

export const metadata = {
  title: "FAQ - NITRR OSS",
  description: "Frequently asked questions about NITRR Open Source Society",
};

export default function FAQPage() {
  const faqs = faqData as unknown as FAQ[];

  // Group FAQs by category
  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <Container className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Frequently Asked Questions</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find answers to common questions about contributing, joining, and participating in NITRR
          Open Source Society.
        </p>
      </div>

      {/* FAQ by Category */}
      <div className="space-y-8">
        {categories.map((category) => {
          const categoryFaqs = faqs.filter((faq) => faq.category === category);
          return (
            <Card key={category} className="p-6">
              <h2 className="text-2xl font-bold mb-4">{category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {categoryFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          );
        })}
      </div>

      {/* Still have questions */}
      <Card className="mt-8 p-8 text-center bg-muted/50">
        <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
        <p className="text-muted-foreground mb-4">
          Can&apos;t find what you&apos;re looking for? Reach out to us on Discord or via email.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a
            href="https://discord.gg/your-invite-link"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Join our Discord
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="mailto:opensource@nitrr.ac.in" className="text-primary hover:underline">
            Email us
          </a>
        </div>
      </Card>
    </Container>
  );
}
