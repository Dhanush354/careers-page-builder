"use client";

import { InlineEditable } from "@/components/editor/inline-editable";
import type { Company } from "@/types/company";

export function CareersHero({
  company,
  heading = company.name,
  description = `Explore opportunities at ${company.name}.`,
  onHeadingChange,
  onDescriptionChange,
}: {
  company: Company;
  heading?: string;
  description?: string;
  onHeadingChange?: (v: string) => void;
  onDescriptionChange?: (v: string) => void;
}) {
  const { bannerUrl, primaryColor, secondaryColor } = company.theme;
  const primary = primaryColor || "#0f172a";
  const secondary = secondaryColor || "#0f172a";

  const heroBackground: React.CSSProperties = {
    backgroundColor: "#0a0a0a",
    backgroundImage: `radial-gradient(circle at 20% 15%, color-mix(in srgb, ${primary} 45%, #0a0a0a) 0%, color-mix(in srgb, ${secondary} 55%, #0a0a0a) 55%, #0a0a0a 100%)`,
  };

  return (
    <section className="relative overflow-hidden" style={heroBackground}>
      {bannerUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={bannerUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
      )}
      <div className="relative mx-auto w-full max-w-6xl px-5 py-24 text-center sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/70 sm:text-sm">
          Careers at {company.name}
        </p>
        <InlineEditable
          as="h1"
          value={heading}
          onChange={onHeadingChange ?? (() => {})}
          className="mt-5 text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl"
        />
        <InlineEditable
          as="p"
          value={description}
          onChange={onDescriptionChange ?? (() => {})}
          multiline
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg"
        />
        <div className="mt-10">
          <a
            href="#open-roles"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-7 text-sm font-semibold text-slate-900 transition-colors hover:bg-white/90"
          >
            Explore open roles
          </a>
        </div>
      </div>
    </section>
  );
}
