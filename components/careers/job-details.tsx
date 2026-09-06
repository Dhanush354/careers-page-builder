import type { Job } from "@/types/job";

const FIELDS: Array<{ label: string; value: (job: Job) => string | null }> = [
  { label: "Employment Type", value: (j) => j.employment_type },
  { label: "Experience Level", value: (j) => j.experience_level },
  { label: "Job Type", value: (j) => j.job_type },
  { label: "Salary Range", value: (j) => j.salary_range },
  { label: "Posted", value: (j) => j.posted_days_ago },
];

export function JobDetails({ job }: { job: Job }) {
  return (
    <div className="flex flex-col gap-5">
      <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
        {FIELDS.map(({ label, value }) => {
          const fieldValue = value(job);
          if (!fieldValue) return null;
          return (
            <div key={label}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-0.5 text-sm font-medium text-foreground">
                {fieldValue}
              </dd>
            </div>
          );
        })}
      </dl>
      <p className="border-t border-border pt-4 text-xs text-muted-foreground">
        Application details are not included in the provided sample data.
      </p>
    </div>
  );
}
