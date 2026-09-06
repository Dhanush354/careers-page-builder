import Image from "next/image";
import { CheckCircle2, Image as ImageIcon, LayoutTemplate, XCircle } from "lucide-react";
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
  theme,
  pageBlocks,
  companyName,
}: {
  theme: CompanyTheme;
  pageBlocks: PageBlock[];
  companyName: string;
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
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Draft
        </span>
      </div>

      {/* Mini page preview */}
      <div className="mx-4 my-4 overflow-hidden rounded-lg" style={{ boxShadow: "0 0 0 1px rgb(0 0 0 / 0.07)" }}>
        {/* Accent banner */}
        <div
          className="flex h-10 items-center gap-2 px-3"
          style={{ backgroundColor: accentColor }}
        >
          {theme.logoUrl ? (
            <Image
              src={theme.logoUrl}
              alt={companyName}
              width={24}
              height={24}
              className="h-6 w-6 rounded object-contain"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded bg-white/20">
              <ImageIcon className="h-3.5 w-3.5 text-white/70" />
            </div>
          )}
          <span className="text-[11px] font-semibold text-white/90">{companyName}</span>
        </div>

        {/* Body preview — gray strips mimicking content */}
        <div className="bg-muted/20 px-3 py-3 space-y-2">
          <div className="h-2 w-3/4 rounded-full bg-muted-foreground/20" />
          <div className="h-2 w-1/2 rounded-full bg-muted-foreground/10" />
          <div className="mt-3 flex gap-2">
            <div
              className="h-6 w-20 rounded"
              style={{ backgroundColor: accentColor, opacity: 0.85 }}
            />
            <div className="h-6 w-16 rounded bg-muted-foreground/10" />
          </div>
        </div>
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
