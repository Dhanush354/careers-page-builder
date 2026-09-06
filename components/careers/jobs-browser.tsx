"use client";

import { useMemo, useState } from "react";
import { EmptyJobsState } from "@/components/careers/empty-jobs-state";
import { JobCard } from "@/components/careers/job-card";
import { ALL_VALUE, JobFilters } from "@/components/careers/job-filters";
import type { Job } from "@/types/job";

function uniqueSorted(values: (string | null)[]) {
  const cleaned = values
    .filter((value): value is string => Boolean(value && value.trim()))
    .map((value) => value.trim());
  return Array.from(new Set(cleaned)).sort((a, b) => a.localeCompare(b));
}

export function JobsBrowser({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState(ALL_VALUE);
  const [jobType, setJobType] = useState(ALL_VALUE);
  const [workPolicy, setWorkPolicy] = useState(ALL_VALUE);

  const locationOptions = useMemo(
    () => uniqueSorted(jobs.map((job) => job.location)),
    [jobs]
  );
  const jobTypeOptions = useMemo(
    () => uniqueSorted(jobs.map((job) => job.job_type)),
    [jobs]
  );
  const workPolicyOptions = useMemo(
    () => uniqueSorted(jobs.map((job) => job.work_policy)),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch =
        query === "" || job.title.toLowerCase().includes(query);
      const matchesLocation = location === ALL_VALUE || job.location === location;
      const matchesJobType = jobType === ALL_VALUE || job.job_type === jobType;
      const matchesWorkPolicy =
        workPolicy === ALL_VALUE || job.work_policy === workPolicy;
      return matchesSearch && matchesLocation && matchesJobType && matchesWorkPolicy;
    });
  }, [jobs, search, location, jobType, workPolicy]);

  const hasActiveFilters =
    search.trim() !== "" ||
    location !== ALL_VALUE ||
    jobType !== ALL_VALUE ||
    workPolicy !== ALL_VALUE;

  function clearFilters() {
    setSearch("");
    setLocation(ALL_VALUE);
    setJobType(ALL_VALUE);
    setWorkPolicy(ALL_VALUE);
  }

  return (
    <div id="open-roles" className="w-full bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Open Roles
        </h2>
        <p className="mt-3 text-base text-muted-foreground sm:text-lg">
          Explore current opportunities.
        </p>

        <div className="mt-8">
          <JobFilters
            search={search}
            onSearchChange={setSearch}
            location={location}
            onLocationChange={setLocation}
            jobType={jobType}
            onJobTypeChange={setJobType}
            workPolicy={workPolicy}
            onWorkPolicyChange={setWorkPolicy}
            locationOptions={locationOptions}
            jobTypeOptions={jobTypeOptions}
            workPolicyOptions={workPolicyOptions}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        </div>

        <p
          className="mt-6 text-base font-medium text-foreground"
          aria-live="polite"
        >
          {filteredJobs.length} open role{filteredJobs.length === 1 ? "" : "s"}
        </p>

        {filteredJobs.length === 0 ? (
          <EmptyJobsState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
          />
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
