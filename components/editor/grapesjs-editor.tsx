"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type { Company } from "@/types/company";
import type { Job } from "@/types/job";

// GrapeJS must only run in the browser — SSR=false prevents server execution.
const GrapejsCanvas = dynamic(() => import("./grapesjs-canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-muted/30">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm font-medium">Loading Canvas Builder…</p>
      </div>
    </div>
  ),
});

export function GrapejsEditor({
  company,
  jobs,
}: {
  company: Company;
  jobs: Job[];
}) {
  return <GrapejsCanvas company={company} jobs={jobs} />;
}
