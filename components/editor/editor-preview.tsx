"use client";

import { CareersHeader } from "@/components/careers/careers-header";
import { PageBlockRenderer } from "@/components/careers/page-block-renderer";
import { EditorContext } from "@/contexts/editor-context";
import { getThemeCssVars } from "@/lib/editor/theme-style";
import type { Company, CompanyTheme, PageBlock } from "@/types/company";
import type { Job } from "@/types/job";

export function EditorPreview({
  company,
  theme,
  pageBlocks,
  jobs,
  onBlockChange,
}: {
  company: Company;
  theme: CompanyTheme;
  pageBlocks: PageBlock[];
  jobs: Job[];
  onBlockChange?: (block: PageBlock) => void;
}) {
  const previewCompany: Company = { ...company, theme };
  const hasFooter = pageBlocks.some((b) => b.type === "footer" && b.visible);

  return (
    <EditorContext.Provider
      value={{
        isEditing: true,
        onBlockChange: onBlockChange ?? (() => {}),
      }}
    >
      <div
        className="flex min-h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm"
        style={getThemeCssVars(theme)}
      >
        <CareersHeader company={previewCompany} />
        {pageBlocks.map((block) => (
          <PageBlockRenderer
            key={block.id}
            block={block}
            company={company}
            jobs={jobs}
            theme={theme}
          />
        ))}
        {!hasFooter && (
          <footer className="border-t border-border bg-background">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
              <p>
                © {new Date().getFullYear()} {company.name}
              </p>
            </div>
          </footer>
        )}
      </div>
    </EditorContext.Provider>
  );
}
