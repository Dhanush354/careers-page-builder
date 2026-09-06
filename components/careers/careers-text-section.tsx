"use client";

import { InlineEditable } from "@/components/editor/inline-editable";
import { cn } from "@/lib/utils";

export function CareersTextSection({
  heading,
  body,
  layout = "centered",
  alternate = false,
  onHeadingChange,
  onBodyChange,
}: {
  heading: string;
  body: string;
  layout?: "centered" | "split";
  alternate?: boolean;
  onHeadingChange?: (v: string) => void;
  onBodyChange?: (v: string) => void;
}) {
  return (
    <section className={cn("w-full", alternate && "bg-muted/30")}>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        {layout === "split" ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
            <InlineEditable
              as="h2"
              value={heading}
              onChange={onHeadingChange ?? (() => {})}
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            />
            <InlineEditable
              as="p"
              value={body}
              onChange={onBodyChange ?? (() => {})}
              multiline
              className="whitespace-pre-line text-base leading-8 text-muted-foreground sm:text-lg"
            />
          </div>
        ) : (
          <div className="mx-auto max-w-3xl text-center">
            <InlineEditable
              as="h2"
              value={heading}
              onChange={onHeadingChange ?? (() => {})}
              className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            />
            <InlineEditable
              as="p"
              value={body}
              onChange={onBodyChange ?? (() => {})}
              multiline
              className="mt-6 whitespace-pre-line text-base leading-8 text-muted-foreground sm:text-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}
