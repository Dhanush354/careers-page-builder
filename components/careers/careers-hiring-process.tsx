"use client";

import { InlineEditable } from "@/components/editor/inline-editable";
import type { HiringStep } from "@/types/company";

type Layout = "horizontal" | "vertical";

export function CareersHiringProcess({
  heading,
  steps,
  layout = "horizontal",
  alternate = false,
  primaryColor,
  onHeadingChange,
}: {
  heading: string;
  steps: HiringStep[];
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

        {layout === "horizontal" && (
          <div className="relative mt-12">
            <div
              className="absolute left-0 right-0 top-5 hidden h-px sm:block"
              style={{ backgroundColor: `${accent}30` }}
            />
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, i) => (
                <div key={step.id} className="relative flex flex-col items-center text-center">
                  <div
                    className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                    style={{ backgroundColor: accent }}
                  >
                    {i + 1}
                  </div>
                  <p className="mt-4 font-semibold text-foreground">{step.title}</p>
                  {step.duration && (
                    <span
                      className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: `${accent}15`, color: accent }}
                    >
                      {step.duration}
                    </span>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {layout === "vertical" && (
          <div className="relative mt-12 flex flex-col gap-0">
            {steps.map((step, i) => (
              <div key={step.id} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ backgroundColor: accent }}
                  >
                    {i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="my-2 w-px flex-1" style={{ backgroundColor: `${accent}30` }} />
                  )}
                </div>
                <div className="pb-8">
                  <p className="font-semibold text-foreground">{step.title}</p>
                  {step.duration && (
                    <span
                      className="mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                      style={{ backgroundColor: `${accent}15`, color: accent }}
                    >
                      {step.duration}
                    </span>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
