import Link from "next/link";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicationStatusBadge } from "@/components/editor/publication-status-badge";
import type { PublicationStatus } from "@/lib/editor/publication-status";
import { cn } from "@/lib/utils";

export type SaveStatus = "idle" | "saving" | "saved" | "error";
export type DeviceWidth = "mobile" | "tablet" | "desktop";

const DEVICE_BUTTONS: { value: DeviceWidth; icon: React.ReactNode; label: string; short: string }[] = [
  { value: "mobile", icon: <Smartphone className="h-3.5 w-3.5" />, label: "Mobile preview", short: "Mobile" },
  { value: "tablet", icon: <Tablet className="h-3.5 w-3.5" />, label: "Tablet preview", short: "Tablet" },
  { value: "desktop", icon: <Monitor className="h-3.5 w-3.5" />, label: "Desktop preview", short: "Desktop" },
];

export function EditorToolbar({
  companyName,
  companySlug,
  isDirty,
  status,
  errorMessage,
  publicationStatus,
  deviceWidth,
  onSave,
  onDeviceWidthChange,
}: {
  companyName: string;
  companySlug: string;
  isDirty: boolean;
  status: SaveStatus;
  errorMessage: string | null;
  publicationStatus: PublicationStatus;
  deviceWidth: DeviceWidth;
  onSave: () => void;
  onDeviceWidthChange: (w: DeviceWidth) => void;
}) {
  const label =
    status === "saving"
      ? "Saving…"
      : status === "saved" && !isDirty
        ? "Saved"
        : "Save";
  const disabled = status === "saving" || !isDirty;
  const isPublished = publicationStatus !== "unpublished";

  return (
    <header className="sticky top-0 z-20 shrink-0 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <Link
            href="/dashboard"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Dashboard
          </Link>
          <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
            {companyName}
          </h1>
          <p className="text-xs text-muted-foreground">Careers Page Editor</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Device width toggle — hidden on small screens where preview isn't shown */}
          <div className="hidden items-center gap-0.5 rounded-lg border border-border bg-muted/50 p-1 lg:flex">
            {DEVICE_BUTTONS.map(({ value, icon, label, short }) => (
              <button
                key={value}
                type="button"
                aria-label={label}
                aria-pressed={deviceWidth === value}
                onClick={() => onDeviceWidthChange(value)}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-md px-2.5 py-1 transition-colors",
                  deviceWidth === value
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {icon}
                <span className="text-[10px] font-medium leading-none">{short}</span>
              </button>
            ))}
          </div>

          {/* Auto-save indicator */}
          <span className="hidden items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
            <span
              className={cn(
                "inline-block h-1.5 w-1.5 rounded-full",
                status === "saving" ? "animate-pulse bg-amber-400" : "bg-emerald-400"
              )}
            />
            {status === "saving" ? "Saving…" : "Auto-save on"}
          </span>
          <PublicationStatusBadge status={publicationStatus} />
          {status === "error" && errorMessage && (
            <p role="alert" className="text-sm text-destructive">
              {errorMessage}
            </p>
          )}
          {isPublished && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
            >
              <Link
                href={`/${companySlug}/careers`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Live
                <span className="sr-only"> (opens in a new tab)</span>
              </Link>
            </Button>
          )}
          {isDirty ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled
              title="Save your draft to preview"
              aria-label="Preview — save your draft first"
            >
              Preview
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm">
              <Link href={`/${companySlug}/preview`}>Preview</Link>
            </Button>
          )}
          <Button onClick={onSave} disabled={disabled}>
            {label}
          </Button>
        </div>
      </div>
    </header>
  );
}
