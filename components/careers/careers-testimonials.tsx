"use client";

import { InlineEditable } from "@/components/editor/inline-editable";
import type { TestimonialItem } from "@/types/company";

type Layout = "grid-2" | "grid-3";

const AVATAR_COLORS = [
  "#6366f1","#f59e0b","#10b981","#ef4444","#8b5cf6","#06b6d4",
];

export function CareersTestimonials({
  heading,
  items,
  layout = "grid-3",
  alternate = false,
  onHeadingChange,
}: {
  heading: string;
  items: TestimonialItem[];
  layout?: Layout;
  alternate?: boolean;
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

        <div className={`mt-10 grid grid-cols-1 gap-5 ${layout === "grid-2" ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
          {items.map((item, i) => {
            const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
            return (
              <div
                key={item.id}
                className="flex flex-col gap-4 rounded-xl border border-black/[0.06] bg-card p-5 dark:border-white/[0.06]"
              >
                <span className="text-3xl leading-none text-muted-foreground/20 select-none">&ldquo;</span>
                <p className="flex-1 text-sm leading-relaxed text-foreground/80">{item.quote}</p>
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
                    style={{ backgroundColor: color }}
                  >
                    {item.avatarInitials || item.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
