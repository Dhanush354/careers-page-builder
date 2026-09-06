"use client";

import { CareersBenefits } from "@/components/careers/careers-benefits";
import { CareersCtaBanner } from "@/components/careers/careers-cta-banner";
import { CareersFooter } from "@/components/careers/careers-footer";
import { CareersFaq } from "@/components/careers/careers-faq";
import { CareersHero } from "@/components/careers/careers-hero";
import { CareersHiringProcess } from "@/components/careers/careers-hiring-process";
import { CareersStats } from "@/components/careers/careers-stats";
import { CareersTestimonials } from "@/components/careers/careers-testimonials";
import { CareersTextSection } from "@/components/careers/careers-text-section";
import { CareersValues } from "@/components/careers/careers-values";
import { JobsBrowser } from "@/components/careers/jobs-browser";
import { useEditorContext } from "@/contexts/editor-context";
import type { Company, CompanyTheme, PageBlock } from "@/types/company";
import type { Job } from "@/types/job";

export function PageBlockRenderer({
  block,
  company,
  jobs,
  theme,
  alternate = false,
}: {
  block: PageBlock;
  company: Company;
  jobs: Job[];
  theme: CompanyTheme;
  alternate?: boolean;
}) {
  const { onBlockChange } = useEditorContext();

  // Creates a per-field change handler for string fields in block.content
  function fieldChange(field: string) {
    return (value: string) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onBlockChange({ ...block, content: { ...(block.content as any), [field]: value } } as PageBlock);
    };
  }

  if (!block.visible) return null;

  switch (block.type) {
    case "hero":
      return (
        <CareersHero
          company={{ ...company, theme }}
          heading={block.content.heading || undefined}
          description={block.content.description || undefined}
          onHeadingChange={fieldChange("heading")}
          onDescriptionChange={fieldChange("description")}
        />
      );

    case "about":
      return block.content.body.trim() === "" ? null : (
        <CareersTextSection
          heading={block.content.heading || "About Us"}
          body={block.content.body}
          layout={block.content.layout ?? "centered"}
          alternate={alternate}
          onHeadingChange={fieldChange("heading")}
          onBodyChange={fieldChange("body")}
        />
      );

    case "life":
      return block.content.body.trim() === "" ? null : (
        <CareersTextSection
          heading={block.content.heading || `Life at ${company.name}`}
          body={block.content.body}
          layout={block.content.layout ?? "split"}
          alternate={alternate}
          onHeadingChange={fieldChange("heading")}
          onBodyChange={fieldChange("body")}
        />
      );

    case "stats":
      return block.content.items.length === 0 ? null : (
        <CareersStats
          heading={block.content.heading || "By the Numbers"}
          items={block.content.items}
          layout={block.content.layout ?? "row"}
          alternate={alternate}
          onHeadingChange={fieldChange("heading")}
        />
      );

    case "faq":
      return block.content.items.length === 0 ? null : (
        <CareersFaq
          heading={block.content.heading || "Frequently Asked Questions"}
          items={block.content.items}
          alternate={alternate}
          onHeadingChange={fieldChange("heading")}
        />
      );

    case "benefits":
      return block.content.items.length === 0 ? null : (
        <CareersBenefits
          heading={block.content.heading || "Benefits & Perks"}
          items={block.content.items}
          layout={block.content.layout ?? "grid-3"}
          alternate={alternate}
          primaryColor={theme.primaryColor}
          onHeadingChange={fieldChange("heading")}
        />
      );

    case "values":
      return block.content.items.length === 0 ? null : (
        <CareersValues
          heading={block.content.heading || "What We Believe"}
          items={block.content.items}
          layout={block.content.layout ?? "numbered"}
          alternate={alternate}
          primaryColor={theme.primaryColor}
          onHeadingChange={fieldChange("heading")}
        />
      );

    case "testimonials":
      return block.content.items.length === 0 ? null : (
        <CareersTestimonials
          heading={block.content.heading || "Hear from the Team"}
          items={block.content.items}
          layout={block.content.layout ?? "grid-3"}
          alternate={alternate}
          onHeadingChange={fieldChange("heading")}
        />
      );

    case "hiringProcess":
      return block.content.steps.length === 0 ? null : (
        <CareersHiringProcess
          heading={block.content.heading || "Our Hiring Process"}
          steps={block.content.steps}
          layout={block.content.layout ?? "horizontal"}
          alternate={alternate}
          primaryColor={theme.primaryColor}
          onHeadingChange={fieldChange("heading")}
        />
      );

    case "ctaBanner":
      return (
        <CareersCtaBanner
          heading={block.content.heading}
          subtext={block.content.subtext}
          buttonLabel={block.content.buttonLabel}
          buttonLink={block.content.buttonLink}
          background={block.content.background ?? "brand"}
          layout={block.content.layout ?? "centered"}
          primaryColor={theme.primaryColor}
          onHeadingChange={fieldChange("heading")}
          onSubtextChange={fieldChange("subtext")}
          onButtonLabelChange={fieldChange("buttonLabel")}
        />
      );

    case "footer":
      return (
        <CareersFooter
          companyName={company.name}
          content={block.content}
          primaryColor={theme.primaryColor}
          onTaglineChange={fieldChange("tagline")}
        />
      );

    case "openRoles":
      return <JobsBrowser jobs={jobs} />;
  }
}
