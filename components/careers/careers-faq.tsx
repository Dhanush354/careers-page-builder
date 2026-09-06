"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InlineEditable } from "@/components/editor/inline-editable";
import { cn } from "@/lib/utils";
import type { FaqItem } from "@/types/company";

export function CareersFaq({
  heading,
  items,
  alternate = false,
  onHeadingChange,
}: {
  heading: string;
  items: FaqItem[];
  alternate?: boolean;
  onHeadingChange?: (v: string) => void;
}) {
  return (
    <section className={cn("w-full", alternate && "bg-muted/30")}>
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        <InlineEditable
          as="h2"
          value={heading}
          onChange={onHeadingChange ?? (() => {})}
          className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        />
        <Accordion type="single" collapsible className="mt-10">
          {items.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="py-5 text-base font-medium sm:text-lg">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
