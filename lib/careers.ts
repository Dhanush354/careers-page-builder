import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/types/company";
import type { Job } from "@/types/job";

// Both reads go through the publishable-key server client — RLS alone
// decides what's visible (published companies, active jobs). Wrapped in
// React's cache() so generateMetadata() and the page body share one fetch
// per request instead of querying twice.

export const getPublishedCompanyBySlug = cache(
  async (slug: string): Promise<Company | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .overrideTypes<Company, { merge: false }>();

    if (error) {
      throw new Error(`Failed to load company: ${error.message}`);
    }

    return data;
  }
);

export const getActiveJobsForCompany = cache(
  async (companyId: string): Promise<Job[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("company_id", companyId)
      .eq("is_active", true)
      .order("title", { ascending: true })
      .overrideTypes<Job[], { merge: false }>();

    if (error) {
      throw new Error(`Failed to load jobs: ${error.message}`);
    }

    return data ?? [];
  }
);
