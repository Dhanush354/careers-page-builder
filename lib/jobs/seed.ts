"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import type { Database } from "@/types/database";

const SAMPLE_JOBS = [
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    employment_type: "Full-time",
    work_policy: "Remote",
    experience_level: "Senior",
    salary_range: "$120k–$160k",
    job_slug: "senior-frontend-engineer",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "New York, USA",
    employment_type: "Full-time",
    work_policy: "Hybrid",
    experience_level: "Mid-level",
    salary_range: "$90k–$120k",
    job_slug: "product-designer",
  },
  {
    title: "DevOps Engineer",
    department: "Infrastructure",
    location: "San Francisco, CA",
    employment_type: "Full-time",
    work_policy: "On-site",
    experience_level: "Senior",
    salary_range: "$130k–$170k",
    job_slug: "devops-engineer",
  },
  {
    title: "Backend Engineer (Go)",
    department: "Engineering",
    location: "Remote",
    employment_type: "Full-time",
    work_policy: "Remote",
    experience_level: "Senior",
    salary_range: "$125k–$155k",
    job_slug: "backend-engineer-go",
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "Austin, TX",
    employment_type: "Full-time",
    work_policy: "Hybrid",
    experience_level: "Mid-level",
    salary_range: "$110k–$140k",
    job_slug: "product-manager",
  },
  {
    title: "Data Analyst",
    department: "Analytics",
    location: "Remote",
    employment_type: "Full-time",
    work_policy: "Remote",
    experience_level: "Entry-level",
    salary_range: "$75k–$95k",
    job_slug: "data-analyst",
  },
  {
    title: "Marketing Lead",
    department: "Marketing",
    location: "London, UK",
    employment_type: "Full-time",
    work_policy: "Hybrid",
    experience_level: "Lead",
    salary_range: "£80k–£100k",
    job_slug: "marketing-lead",
  },
  {
    title: "iOS Engineer",
    department: "Mobile",
    location: "Remote",
    employment_type: "Contract",
    work_policy: "Remote",
    experience_level: "Mid-level",
    salary_range: "$100/hr",
    job_slug: "ios-engineer",
  },
];

export async function seedSampleJobs(): Promise<{ error: string | null; count: number }> {
  const recruiter = await getCurrentRecruiter();
  if (recruiter.status !== "ready") return { error: "Not authenticated", count: 0 };

  const supabase = createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );

  const rows = SAMPLE_JOBS.map((j) => ({
    ...j,
    company_id: recruiter.company.id,
    is_active: true,
  }));

  const { error } = await supabase.from("jobs").insert(rows);
  if (error) return { error: error.message, count: 0 };

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  return { error: null, count: rows.length };
}
