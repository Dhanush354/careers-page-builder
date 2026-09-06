import { cn } from "@/lib/utils";
import type { PublicationStatus } from "@/lib/editor/publication-status";

const STATUS_CONFIG: Record<PublicationStatus, { label: string; className: string }> = {
  published: {
    label: "Published",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  "unpublished-changes": {
    label: "Unpublished changes",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  unpublished: {
    label: "Unpublished",
    className: "bg-muted text-muted-foreground",
  },
};

export function PublicationStatusBadge({ status }: { status: PublicationStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
