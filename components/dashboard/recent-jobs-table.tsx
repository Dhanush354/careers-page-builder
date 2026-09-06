import { Briefcase } from "lucide-react";
import type { Job } from "@/types/job";

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
        active
          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-emerald-500" : "bg-muted-foreground/40"
        }`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export function RecentJobsTable({ jobs }: { jobs: Job[] }) {
  const recent = jobs.slice(0, 6);

  return (
    <div className="zk-card overflow-hidden">
      <div className="zk-card-divider flex items-center justify-between px-5 py-3.5">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">Recent Job Listings</span>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {jobs.length} total active role{jobs.length !== 1 ? "s" : ""}
        </span>
      </div>

      {recent.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 px-5 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No jobs listed yet</p>
          <p className="text-xs text-muted-foreground">
            Add job postings in your Supabase database to see them here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/20" style={{ borderBottom: "1px solid rgb(0 0 0 / 0.05)" }}>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Job Title
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Department
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Location
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Type
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.04] dark:divide-white/[0.04]">
              {recent.map((job) => (
                <tr
                  key={job.id}
                  className="transition-colors hover:bg-muted/20"
                >
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-foreground">{job.title}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {job.department ?? <span className="text-muted-foreground/40">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {job.location ?? <span className="text-muted-foreground/40">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {job.employment_type ?? job.job_type ?? (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge active={job.is_active} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
