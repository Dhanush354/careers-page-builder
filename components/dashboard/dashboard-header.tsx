import Link from "next/link";
import { Eye, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DashboardHeader({
  companyName,
  companySlug,
  isPublished,
}: {
  companyName?: string;
  companySlug?: string;
  isPublished?: boolean;
} = {}) {
  return (
    <header className="sticky top-0 z-40 flex h-12 w-full shrink-0 items-center gap-3 border-b border-border/50 bg-background/80 px-4 backdrop-blur-md lg:px-6">
      {companyName && (
        <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/50 px-2.5 py-1">
          <span className="text-[12px] font-semibold text-foreground">{companyName}</span>
        </div>
      )}

      <div className="ml-auto flex items-center gap-2">
        {companySlug && (
          <Button asChild variant="outline" size="sm" className="h-7 gap-1.5 text-xs">
            <Link href={`/${companySlug}/preview`}>
              <Eye className="h-3.5 w-3.5" />
              Preview
            </Link>
          </Button>
        )}
        {companySlug && (
          <Button asChild size="sm" className="h-7 gap-1.5 text-xs">
            <Link href={`/${companySlug}/edit`}>
              <PenLine className="h-3.5 w-3.5" />
              Edit Page
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
