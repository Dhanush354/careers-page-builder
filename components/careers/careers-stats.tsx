"use client";

import { InlineEditable } from "@/components/editor/inline-editable";
import { cn } from "@/lib/utils";
import type { StatItem } from "@/types/company";

type Layout = "row" | "large";

export function CareersStats({
  heading,
  items,
  layout = "row",
  alternate = false,
  onHeadingChange,
}: {
  heading: string;
  items: StatItem[];
  layout?: Layout;
  alternate?: boolean;
  onHeadingChange?: (v: string) => void;
}) {
  return (
    <section className={cn("w-full", alternate && "bg-muted/30")}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        <InlineEditable
          as="h2"
          value={heading}
          onChange={onHeadingChange ?? (() => {})}
          className="text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
        />

        {layout === "row" && (
          <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4 sm:divide-x sm:divide-border">
            {items.map((item) => (
              <div key={item.id} className="text-center sm:px-6">
                <p className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  {item.value}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {layout === "large" && (
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-black/[0.06] bg-card p-8 text-center dark:border-white/[0.06]"
              >
                <p className="text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
                  {item.value}
                </p>
                <p className="mt-3 text-base text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
