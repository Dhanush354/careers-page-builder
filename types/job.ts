// `type` alias, not `interface` — see the note in types/company.ts.
export type Job = {
  id: string;
  company_id: string;
  title: string;
  work_policy: string | null;
  location: string | null;
  department: string | null;
  employment_type: string | null;
  experience_level: string | null;
  job_type: string | null;
  salary_range: string | null;
  job_slug: string | null;
  posted_days_ago: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
