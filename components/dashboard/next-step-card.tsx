import Link from "next/link";
import { ArrowRight, CheckCircle2, Globe, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicationStatus } from "@/lib/editor/publication-status";

const NEXT_STEP: Record<
  PublicationStatus,
  {
    icon: React.ReactNode;
    title: string;
    message: string;
    actionLabel: string;
    href: (slug: string) => string;
    external?: boolean;
    variant: "default" | "outline";
    bg: string;
    border: string;
  }
> = {
  unpublished: {
    icon: <Pencil className="h-5 w-5" />,
    title: "Your page isn't live yet",
    message: "Finish setting up your careers page and publish it so candidates can find your open roles.",
    actionLabel: "Preview & Publish",
    href: (slug) => `/${slug}/preview`,
    variant: "default",
    bg: "bg-primary/5",
    border: "border-primary/20",
  },
  "unpublished-changes": {
    icon: <Pencil className="h-5 w-5 text-amber-500" />,
    title: "You have unpublished changes",
    message: "Your latest edits haven't gone live yet. Preview the changes and publish when ready.",
    actionLabel: "Preview & Publish",
    href: (slug) => `/${slug}/preview`,
    variant: "default",
    bg: "bg-amber-50 dark:bg-amber-950/20",
    border: "border-amber-200 dark:border-amber-800/40",
  },
  published: {
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
    title: "Your careers page is live",
    message: "Candidates can discover and browse your open roles. Share the link to attract talent.",
    actionLabel: "View Live Page",
    href: (slug) => `/${slug}/careers`,
    external: true,
    variant: "outline",
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    border: "border-emerald-200 dark:border-emerald-800/40",
  },
};

export function NextStepCard({
  companySlug,
  status,
}: {
  companySlug: string;
  status: PublicationStatus;
}) {
  const step = NEXT_STEP[status];

  return (
    <div className={`flex flex-col gap-4 rounded-xl border p-5 sm:flex-row sm:items-center sm:justify-between ${step.bg} ${step.border}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{step.icon}</div>
        <div>
          <p className="text-sm font-semibold text-foreground">{step.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{step.message}</p>
        </div>
      </div>
      <Button
        asChild
        variant={step.variant}
        size="sm"
        className="w-full shrink-0 sm:w-auto"
      >
        <Link
          href={step.href(companySlug)}
          {...(step.external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {step.actionLabel}
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          {step.external && <span className="sr-only"> (opens in a new tab)</span>}
        </Link>
      </Button>
    </div>
  );
}
