"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BrandingPanel } from "@/components/editor/branding-panel";
import { EditorPreview } from "@/components/editor/editor-preview";
import { EditorToolbar, type DeviceWidth, type SaveStatus } from "@/components/editor/editor-toolbar";
import { SectionManager } from "@/components/editor/section-manager";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { saveCareersPage } from "@/lib/editor/actions";
import { getPublicationStatus } from "@/lib/editor/publication-status";
import { cn } from "@/lib/utils";
import type { Company, CompanyTheme, PageBlock } from "@/types/company";
import type { Job } from "@/types/job";

interface Snapshot {
  theme: CompanyTheme;
  pageBlocks: PageBlock[];
}

type MobileView = "edit" | "preview";

export function CareersEditor({
  company,
  initialPageBlocks,
  jobs,
}: {
  company: Company;
  initialPageBlocks: PageBlock[];
  jobs: Job[];
}) {
  const [theme, setTheme] = useState<CompanyTheme>(company.theme);
  const [pageBlocks, setPageBlocks] = useState<PageBlock[]>(initialPageBlocks);
  const [savedSnapshot, setSavedSnapshot] = useState<Snapshot>({
    theme: company.theme,
    pageBlocks: initialPageBlocks,
  });
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>("edit");
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>("desktop");
  const isSavingRef = useRef(false);

  const isDirty = useMemo(() => {
    const current: Snapshot = { theme, pageBlocks };
    return JSON.stringify(current) !== JSON.stringify(savedSnapshot);
  }, [theme, pageBlocks, savedSnapshot]);

  const publicationStatus = useMemo(
    () =>
      getPublicationStatus({
        draftTheme: savedSnapshot.theme,
        draftPageBlocks: savedSnapshot.pageBlocks,
        publishedTheme: company.published_theme,
        publishedPageBlocks: company.published_page_blocks,
        publishedAt: company.published_at,
      }),
    [savedSnapshot, company.published_theme, company.published_page_blocks, company.published_at]
  );

  const handleSave = useCallback(async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setStatus("saving");
    setErrorMessage(null);

    const result = await saveCareersPage({
      theme,
      page_blocks: pageBlocks,
    });

    isSavingRef.current = false;
    if (result.ok) {
      setSavedSnapshot({ theme, pageBlocks });
      setStatus("saved");
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, pageBlocks]);

  // Auto-save: 2 seconds after the last change
  useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(() => void handleSave(), 2000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, pageBlocks]);

  return (
    <div className="flex h-screen w-full bg-[--shell-canvas]">
      <AppSidebar
        companySlug={company.slug}
        isPublished={company.published_at !== null}
      />
      <div className="flex flex-1 flex-col overflow-hidden bg-muted/30">
      <EditorToolbar
        companyName={company.name}
        companySlug={company.slug}
        isDirty={isDirty}
        status={status}
        errorMessage={errorMessage}
        publicationStatus={publicationStatus}
        deviceWidth={deviceWidth}
        onSave={handleSave}
        onDeviceWidthChange={setDeviceWidth}
      />

      <div
        role="tablist"
        aria-label="Editor view"
        className="flex shrink-0 border-b border-border bg-background lg:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === "edit"}
          onClick={() => setMobileView("edit")}
          className={cn(
            "flex-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            mobileView === "edit"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Edit
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === "preview"}
          onClick={() => setMobileView("preview")}
          className={cn(
            "flex-1 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            mobileView === "preview"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Preview
        </button>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
        <aside
          className={cn(
            "border-border bg-background lg:w-[380px] lg:shrink-0 lg:overflow-y-auto lg:border-r",
            mobileView === "edit" ? "block" : "hidden",
            "lg:block"
          )}
        >
          <div className="flex flex-col gap-8 p-4 sm:p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Page Settings
              </p>
              <p className="mt-3 text-sm font-medium text-foreground">
                Branding
              </p>
              <div className="mt-3">
                <BrandingPanel theme={theme} onChange={setTheme} />
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Sections
              </p>
              <div className="mt-3">
                <SectionManager
                  blocks={pageBlocks}
                  companyName={company.name}
                  onChange={setPageBlocks}
                />
              </div>
            </div>
          </div>
        </aside>

        <div
          className={cn(
            "flex-1 bg-muted/40 lg:overflow-y-auto",
            mobileView === "preview" ? "block" : "hidden",
            "lg:block"
          )}
        >
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-sm font-medium text-foreground">
              Live Preview
            </h2>
            <p className="text-xs text-muted-foreground">
              Changes appear here before you save.
            </p>
            <div
              className="mx-auto mt-4 transition-all duration-300"
              style={{
                maxWidth:
                  deviceWidth === "mobile"
                    ? 375
                    : deviceWidth === "tablet"
                      ? 768
                      : "100%",
              }}
            >
              <EditorPreview
                company={company}
                theme={theme}
                pageBlocks={pageBlocks}
                jobs={jobs}
                onBlockChange={(updated) =>
                  setPageBlocks((prev) =>
                    prev.map((b) => (b.id === updated.id ? updated : b))
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
