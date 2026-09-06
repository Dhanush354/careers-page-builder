"use server";

import { revalidatePath } from "next/cache";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import type { Database } from "@/types/database";

function getServiceClient() {
  return createServiceClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  );
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface JobFormState {
  error: string | null;
  success: boolean;
}

export async function createJob(
  _prev: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const recruiter = await getCurrentRecruiter();
  if (recruiter.status !== "ready") return { error: "Not authenticated", success: false };

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return { error: "Job title is required", success: false };

  const supabase = getServiceClient();
  const { error } = await supabase.from("jobs").insert({
    company_id: recruiter.company.id,
    title,
    department: String(formData.get("department") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    employment_type: String(formData.get("employment_type") ?? "").trim() || null,
    work_policy: String(formData.get("work_policy") ?? "").trim() || null,
    experience_level: String(formData.get("experience_level") ?? "").trim() || null,
    salary_range: String(formData.get("salary_range") ?? "").trim() || null,
    job_slug: slugify(title),
    is_active: true,
  });

  if (error) return { error: error.message, success: false };

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export async function updateJob(
  _prev: JobFormState,
  formData: FormData
): Promise<JobFormState> {
  const recruiter = await getCurrentRecruiter();
  if (recruiter.status !== "ready") return { error: "Not authenticated", success: false };

  const id = String(formData.get("id") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return { error: "Missing required fields", success: false };

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("jobs")
    .update({
      title,
      department: String(formData.get("department") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      employment_type: String(formData.get("employment_type") ?? "").trim() || null,
      work_policy: String(formData.get("work_policy") ?? "").trim() || null,
      experience_level: String(formData.get("experience_level") ?? "").trim() || null,
      salary_range: String(formData.get("salary_range") ?? "").trim() || null,
      job_slug: slugify(title),
    })
    .eq("id", id)
    .eq("company_id", recruiter.company.id);

  if (error) return { error: error.message, success: false };

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  return { error: null, success: true };
}

export async function deleteJob(id: string): Promise<{ error: string | null }> {
  const recruiter = await getCurrentRecruiter();
  if (recruiter.status !== "ready") return { error: "Not authenticated" };

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("jobs")
    .delete()
    .eq("id", id)
    .eq("company_id", recruiter.company.id);

  if (error) return { error: error.message };

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  return { error: null };
}

export async function toggleJobActive(
  id: string,
  isActive: boolean
): Promise<{ error: string | null }> {
  const recruiter = await getCurrentRecruiter();
  if (recruiter.status !== "ready") return { error: "Not authenticated" };

  const supabase = getServiceClient();
  const { error } = await supabase
    .from("jobs")
    .update({ is_active: isActive })
    .eq("id", id)
    .eq("company_id", recruiter.company.id);

  if (error) return { error: error.message };

  revalidatePath("/jobs");
  revalidatePath("/dashboard");
  return { error: null };
}
