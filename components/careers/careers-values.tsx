"use client";

import { InlineEditable } from "@/components/editor/inline-editable";
import type { ValueItem } from "@/types/company";

type Layout = "numbered" | "grid-2" | "grid-3";

export function CareersValues({
  heading,
  items,
  layout = "numbered",
  alternate = false,
  primaryColor,
  onHeadingChange,
}: {
  heading: string;
  items: ValueItem[];
  layout?: Layout;
  alternate?: boolean;
  primaryColor?: string;
  onHeadingChange?: (v: string) => void;
}) {
  const accent = primaryColor ?? "#6366f1";

  return (
    <section className={`py-16 ${alternate ? "bg-muted/40" : "bg-background"}`}>
      <div className="mx-auto max-w-5xl px-6">
        <InlineEditable
          as="h2"
          value={heading}
          onChange={onHeadingChange ?? (() => {})}
          className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
        />

        {layout === "numbered" && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {items.map((item, i) => (
              <div key={item.id} className="flex gap-4">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: accent }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {(layout === "grid-2" || layout === "grid-3") && (
          <div className={`mt-10 grid grid-cols-1 gap-5 ${layout === "grid-2" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-black/[0.06] bg-card p-5 dark:border-white/[0.06]"
              >
                <p className="font-semibold text-foreground">{item.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
