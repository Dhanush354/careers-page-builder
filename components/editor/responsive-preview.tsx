"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Copy, ExternalLink, Monitor, MoreHorizontal, Smartphone, Tablet } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PublicationStatusBadge } from "@/components/editor/publication-status-badge";
import { publishCareersPage, unpublishCareersPage } from "@/lib/editor/actions";
import { cn } from "@/lib/utils";
import type { PublicationStatus } from "@/lib/editor/publication-status";

type Device = "desktop" | "tablet" | "mobile";

const DEVICES: Array<{
  id: Device;
  label: string;
  sizeLabel: string;
  icon: typeof Monitor;
  width: number | "full";
}> = [
  { id: "desktop", label: "Desktop", sizeLabel: "Up to 1440px", icon: Monitor, width: "full" },
  { id: "tablet", label: "Tablet", sizeLabel: "768px", icon: Tablet, width: 768 },
  { id: "mobile", label: "Mobile", sizeLabel: "375px", icon: Smartphone, width: 375 },
];

export function ResponsivePreview({
  companyName,
  companySlug,
  publicationStatus,
  isPublished,
}: {
  companyName: string;
  companySlug: string;
  publicationStatus: PublicationStatus;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [device, setDevice] = useState<Device>("desktop");
  const [pendingAction, setPendingAction] = useState<"publish" | "unpublish" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [unpublishDialogOpen, setUnpublishDialogOpen] = useState(false);

  const active = DEVICES.find((d) => d.id === device) ?? DEVICES[0];
  const frameStyle =
    active.width === "full"
      ? { width: "100%", maxWidth: "1440px" }
      : { width: `${active.width}px`, maxWidth: `${active.width}px` };

  const careersUrl = `/${companySlug}/careers`;
  const isClean = publicationStatus === "published";

  async function handlePublish() {
    setPendingAction("publish");
    setActionError(null);
    const result = await publishCareersPage();
    setPendingAction(null);
    if (result.ok) {
      router.refresh();
    } else {
      setActionError(result.error);
    }
  }

  async function handleUnpublish() {
    setPendingAction("unpublish");
    setActionError(null);
    const result = await unpublishCareersPage();
    setPendingAction(null);
    if (result.ok) {
      router.refresh();
    } else {
      setActionError(result.error);
    }
  }

  function handleCopyLink() {
    const url = `${window.location.origin}${careersUrl}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/30 lg:h-screen">
      <header className="sticky top-0 z-20 shrink-0 border-b border-border bg-background">
        <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <Link
              href={`/${companySlug}/edit`}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Back to Editor
            </Link>
            <h1 className="truncate text-base font-semibold tracking-tight text-foreground">
              {companyName}
            </h1>
            <p className="text-xs text-muted-foreground">Preview</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div
              role="group"
              aria-label="Preview device"
              className="flex items-center gap-1 rounded-lg border border-border p-1"
            >
              {DEVICES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={device === id}
                  onClick={() => setDevice(id)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    device === id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {label}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{active.sizeLabel}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <PublicationStatusBadge status={publicationStatus} />

            {actionError && (
              <p role="alert" className="text-sm text-destructive">
                {actionError}
              </p>
            )}

            {isPublished && (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link href={careersUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="size-4" aria-hidden="true" />
                    View Live
                    <span className="sr-only"> (opens in a new tab)</span>
                  </Link>
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={handleCopyLink}>
                  {copied ? (
                    <Check className="size-4" aria-hidden="true" />
                  ) : (
                    <Copy className="size-4" aria-hidden="true" />
                  )}
                  {copied ? "Copied" : "Copy Link"}
                </Button>
              </>
            )}

            {isClean ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                title="Your draft is already live"
              >
                <Check className="size-4" aria-hidden="true" />
                Published
              </Button>
            ) : (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" disabled={pendingAction !== null}>
                    {pendingAction === "publish" ? "Publishing…" : "Publish Changes"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Publish these changes to your public careers page?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Candidates visiting {careersUrl} will immediately see your
                      current draft.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handlePublish}>
                      Publish
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {isPublished && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="More actions"
                    title="More actions"
                  >
                    <MoreHorizontal className="size-4" aria-hidden="true" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => setUnpublishDialogOpen(true)}
                  >
                    Unpublish
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <AlertDialog open={unpublishDialogOpen} onOpenChange={setUnpublishDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unpublish your careers page?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Candidates won&apos;t be able to view it until you publish
                    again. Your draft and current published content are both
                    kept — nothing is deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleUnpublish}>
                    Unpublish
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center overflow-auto bg-muted/40 px-4 py-6 sm:px-6 lg:px-8">
        <div
          className="h-[min(850px,calc(100vh-260px))] overflow-hidden rounded-xl border border-border bg-background shadow-sm"
          style={frameStyle}
        >
          <iframe
            src={`/${companySlug}/preview/frame`}
            title={`${companyName} careers page preview — ${active.label} view`}
            className="size-full"
          />
        </div>
      </div>
    </div>
  );
}
