import { CheckCircle2, LayoutTemplate, XCircle } from "lucide-react";
import { PublicationStatusBadge } from "@/components/editor/publication-status-badge";
import type { PublicationStatus } from "@/lib/editor/publication-status";
import type { CompanyTheme, PageBlock } from "@/types/company";

function StatusRow({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      {active ? (
        <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3 w-3" /> Set
        </span>
      ) : (
        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground/50">
          <XCircle className="h-3 w-3" /> Not set
        </span>
      )}
    </div>
  );
}

export function LivePageSnapshot({
  companySlug,
  theme,
  pageBlocks,
  companyName,
  publicationStatus,
}: {
  companySlug: string;
  theme: CompanyTheme;
  pageBlocks: PageBlock[];
  companyName: string;
  publicationStatus: PublicationStatus;
}) {
  const accentColor = theme.primaryColor ?? "#4F46E5";
  const visibleSections = pageBlocks.filter((b) => b.visible).length;

  return (
    <div className="zk-card overflow-hidden">
      <div className="zk-card-divider flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Live Page Snapshot</span>
        </div>
        <PublicationStatusBadge status={publicationStatus} />
      </div>

      {/* Real thumbnail of the recruiter's actual current page — reuses the
          same authenticated /preview/frame route the full preview page uses
          (draft content, not just published), scaled down via CSS transform
          rather than a mocked/placeholder rendering. */}
      <div
        className="relative mx-4 my-4 aspect-[16/10] overflow-hidden rounded-lg bg-background"
        style={{ boxShadow: "0 0 0 1px rgb(0 0 0 / 0.07)" }}
      >
        <iframe
          src={`/${companySlug}/preview/frame`}
          title={`${companyName} live page snapshot`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
          style={{ width: "400%", height: "400%", transform: "scale(0.25)" }}
        />
      </div>

      {/* Status grid */}
      <div className="space-y-2 px-5 pb-5">
        <div className="flex items-center gap-2 pb-1">
          <div
            className="h-3 w-3 rounded-full ring-2 ring-offset-1 ring-offset-card"
            style={{ backgroundColor: accentColor }}
            title={`Primary Accent: ${accentColor}`}
          />
          <span className="text-[11px] font-mono text-muted-foreground">{accentColor}</span>
          <span className="ml-auto text-[11px] text-muted-foreground">Primary Accent</span>
        </div>

        <div className="rounded-lg bg-muted/20 p-3 space-y-2">
          <StatusRow label="Company Logo" active={!!theme.logoUrl} />
          <StatusRow label="Header Banner" active={!!theme.bannerUrl} />
          <StatusRow
            label={`Visible sections (${visibleSections})`}
            active={visibleSections > 0}
          />
        </div>
      </div>
    </div>
  );
}
