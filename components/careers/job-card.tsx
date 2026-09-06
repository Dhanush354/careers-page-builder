"use client";

import { ArrowRight, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { JobDetails } from "@/components/careers/job-details";
import type { Job } from "@/types/job";

// Deterministic color per first letter — matches ZopKit's varied card avatars
const AVATAR_PALETTES = [
  { bg: "#6366f1", ring: "#6366f120" }, // indigo
  { bg: "#f59e0b", ring: "#f59e0b20" }, // amber
  { bg: "#10b981", ring: "#10b98120" }, // emerald
  { bg: "#ef4444", ring: "#ef444420" }, // red
  { bg: "#8b5cf6", ring: "#8b5cf620" }, // violet
  { bg: "#06b6d4", ring: "#06b6d420" }, // cyan
  { bg: "#f97316", ring: "#f9731620" }, // orange
  { bg: "#ec4899", ring: "#ec489920" }, // pink
  { bg: "#14b8a6", ring: "#14b8a620" }, // teal
  { bg: "#84cc16", ring: "#84cc1620" }, // lime
];

function avatarPalette(text: string) {
  return AVATAR_PALETTES[text.charCodeAt(0) % AVATAR_PALETTES.length];
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </span>
  );
}

export function JobCard({ job }: { job: Job }) {
  const palette = avatarPalette(job.title);
  const initial = job.title.trim()[0]?.toUpperCase() ?? "J";
  const tags = [job.work_policy, job.employment_type].filter(Boolean);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="zk-card group flex w-full flex-col overflow-hidden text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          {/* Card body */}
          <div className="flex flex-1 flex-col p-4">
            {/* Department row + avatar */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-[11px] font-medium text-muted-foreground/60">
                {job.department ?? "General"}
              </span>
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ring-4"
                style={{
                  backgroundColor: palette.bg,
                  boxShadow: `0 0 0 4px ${palette.ring}`,
                }}
              >
                {initial}
              </div>
            </div>

            {/* Job title */}
            <h3 className="mt-3 text-[15px] font-bold leading-snug tracking-tight text-foreground">
              {job.title}
            </h3>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <Chip key={tag}>{tag}</Chip>
                ))}
              </div>
            )}

            {job.experience_level && (
              <p className="mt-2 text-[11px] text-muted-foreground/60">
                {job.experience_level}
              </p>
            )}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgb(0 0 0 / 0.05)" }} className="dark:border-t dark:border-white/[0.05]" />

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              {job.location ? (
                <>
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate max-w-[120px]">{job.location}</span>
                </>
              ) : (
                <span className="text-muted-foreground/40">Location TBD</span>
              )}
            </div>
            <div className="flex items-center gap-1 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-semibold text-background transition-colors group-hover:bg-primary">
              View role
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          {job.department && (
            <p className="text-sm font-medium text-muted-foreground">{job.department}</p>
          )}
          {job.location && (
            <p className="text-sm text-muted-foreground">{job.location}</p>
          )}
          <DialogDescription className="sr-only">
            Details for the {job.title} role
          </DialogDescription>
        </DialogHeader>
        <JobDetails job={job} />
      </DialogContent>
    </Dialog>
  );
}
