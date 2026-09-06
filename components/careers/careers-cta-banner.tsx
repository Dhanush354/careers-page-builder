"use client";

import { InlineEditable } from "@/components/editor/inline-editable";

type Background = "brand" | "dark" | "light";
type Layout = "centered" | "split";

export function CareersCtaBanner({
  heading,
  subtext,
  buttonLabel,
  buttonLink,
  background = "brand",
  layout = "centered",
  primaryColor,
  onHeadingChange,
  onSubtextChange,
  onButtonLabelChange,
}: {
  heading: string;
  subtext: string;
  buttonLabel: string;
  buttonLink: string;
  background?: Background;
  layout?: Layout;
  primaryColor?: string;
  onHeadingChange?: (v: string) => void;
  onSubtextChange?: (v: string) => void;
  onButtonLabelChange?: (v: string) => void;
}) {
  const accent = primaryColor ?? "#6366f1";

  const sectionStyle: React.CSSProperties =
    background === "brand"
      ? { backgroundColor: accent }
      : background === "dark"
        ? { backgroundColor: "#111827" }
        : {};

  const sectionClass = background === "light" ? "bg-muted/40" : "";
  const headingColor = background === "light" ? "text-foreground" : "text-white";
  const subtextColor = background === "light" ? "text-muted-foreground" : "text-white/75";

  const btnStyle: React.CSSProperties =
    background === "brand"
      ? { backgroundColor: "white", color: accent }
      : background === "dark"
        ? { backgroundColor: "white", color: "#111827" }
        : { backgroundColor: accent, color: "white" };

  return (
    <section className={`py-16 ${sectionClass}`} style={sectionStyle}>
      <div className="mx-auto max-w-5xl px-6">
        {layout === "centered" && (
          <div className="text-center">
            <InlineEditable
              as="h2"
              value={heading}
              onChange={onHeadingChange ?? (() => {})}
              className={`text-2xl font-bold tracking-tight sm:text-3xl ${headingColor}`}
            />
            {subtext && (
              <InlineEditable
                as="p"
                value={subtext}
                onChange={onSubtextChange ?? (() => {})}
                multiline
                className={`mx-auto mt-4 max-w-xl text-base ${subtextColor}`}
              />
            )}
            {buttonLabel && buttonLink && (
              <a
                href={buttonLink}
                className="mt-8 inline-block rounded-lg px-6 py-3 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
                style={btnStyle}
              >
                <InlineEditable
                  as="span"
                  value={buttonLabel}
                  onChange={onButtonLabelChange ?? (() => {})}
                />
              </a>
            )}
          </div>
        )}

        {layout === "split" && (
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <InlineEditable
                as="h2"
                value={heading}
                onChange={onHeadingChange ?? (() => {})}
                className={`text-2xl font-bold tracking-tight ${headingColor}`}
              />
              {subtext && (
                <InlineEditable
                  as="p"
                  value={subtext}
                  onChange={onSubtextChange ?? (() => {})}
                  multiline
                  className={`mt-2 text-base ${subtextColor}`}
                />
              )}
            </div>
            {buttonLabel && buttonLink && (
              <a
                href={buttonLink}
                className="inline-block shrink-0 rounded-lg px-6 py-3 text-sm font-semibold shadow-sm transition-opacity hover:opacity-90"
                style={btnStyle}
              >
                <InlineEditable
                  as="span"
                  value={buttonLabel}
                  onChange={onButtonLabelChange ?? (() => {})}
                />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
