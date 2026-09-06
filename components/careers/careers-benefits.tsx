"use client";

import { InlineEditable } from "@/components/editor/inline-editable";
import type { BenefitItem } from "@/types/company";

type Layout = "grid-2" | "grid-3" | "grid-4" | "list";

const GRID_CLASSES: Record<Layout, string> = {
  "grid-2": "grid grid-cols-1 gap-4 sm:grid-cols-2",
  "grid-3": "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
  "grid-4": "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
  list: "flex flex-col gap-3",
};

export function CareersBenefits({
  heading,
  items,
  layout = "grid-3",
  alternate = false,
  primaryColor,
  onHeadingChange,
}: {
  heading: string;
  items: BenefitItem[];
  layout?: Layout;
  alternate?: boolean;
  primaryColor?: string;
  onHeadingChange?: (v: string) => void;
}) {
  return (
    <section className={`py-16 ${alternate ? "bg-muted/40" : "bg-background"}`}>
      <div className="mx-auto max-w-5xl px-6">
        <InlineEditable
          as="h2"
          value={heading}
          onChange={onHeadingChange ?? (() => {})}
          className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        />

        <div className={`mt-10 ${GRID_CLASSES[layout]}`}>
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex gap-4 rounded-xl border border-black/[0.06] bg-card p-5 dark:border-white/[0.06] ${layout === "list" ? "items-start" : ""}`}
            >
              <span className="text-3xl leading-none">{item.emoji}</span>
              <div>
                <p className="font-semibold text-foreground">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
