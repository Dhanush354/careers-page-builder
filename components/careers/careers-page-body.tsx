import { CareersHeader } from "@/components/careers/careers-header";
import { PageBlockRenderer } from "@/components/careers/page-block-renderer";
import { getDefaultPageBlocks } from "@/lib/editor/defaults";
import { getThemeCssVars } from "@/lib/editor/theme-style";
import type { Company, PageBlockType } from "@/types/company";
import type { Job } from "@/types/job";

const ALTERNATING_TYPES: ReadonlySet<PageBlockType> = new Set([
  "about",
  "life",
  "stats",
  "faq",
]);

// Shared by the public careers page and the recruiter draft preview frame —
// same rendering, different data source (published-only RLS vs. the
// recruiter's own row, which may be unpublished/draft).
export function CareersPageBody({
  company,
  jobs,
}: {
  company: Company;
  jobs: Job[];
}) {
  const pageBlocks =
    company.page_blocks.length > 0
      ? company.page_blocks
      : getDefaultPageBlocks(company.name);

  let contentIndex = 0;

  return (
    <div className="flex min-h-full flex-1 flex-col" style={getThemeCssVars(company.theme)}>
      <CareersHeader company={company} />
      <main className="flex-1">
        {pageBlocks.map((block) => {
          const alternate = ALTERNATING_TYPES.has(block.type)
            ? contentIndex++ % 2 === 1
            : false;
          return (
            <PageBlockRenderer
              key={block.id}
              block={block}
              company={company}
              jobs={jobs}
              theme={company.theme}
              alternate={alternate}
            />
          );
        })}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-5 py-10 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-foreground">
            {company.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            © {new Date().getFullYear()} {company.name}
          </p>
        </div>
      </footer>
    </div>
  );
}
