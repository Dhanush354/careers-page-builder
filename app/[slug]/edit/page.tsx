import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { RecruiterSetupState } from "@/components/auth/recruiter-setup-state";
import { CareersEditor } from "@/components/editor/careers-editor";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import { getActiveJobsForCompany } from "@/lib/careers";
import { getDefaultPageBlocks } from "@/lib/editor/defaults";
import type { Job } from "@/types/job";

export const metadata: Metadata = {
  title: "Edit Careers Page | Careers Page Builder",
};

export default async function EditCareersPage({
  params,
}: PageProps<"/[slug]/edit">) {
  const { slug } = await params;
  const recruiter = await getCurrentRecruiter();

  if (recruiter.status === "unauthenticated") {
    redirect("/login");
  }

  if (recruiter.status === "no-profile") {
    return (
      <RecruiterSetupState
        title="Your recruiter profile isn't set up yet"
        description="Contact your administrator to finish linking your account to a company."
      />
    );
  }

  if (recruiter.status === "no-company") {
    return (
      <RecruiterSetupState
        title="Your profile isn't linked to a company yet"
        description="Contact your administrator to finish setup."
      />
    );
  }

  if (recruiter.status === "company-load-error") {
    return (
      <RecruiterSetupState
        title="We couldn't load your company"
        description="Something went wrong on our end. Please try again shortly."
      />
    );
  }

  const { company } = recruiter;

  // Authorization is company-based, never slug-based: a recruiter's company
  // is resolved above purely from their session. This check only decides
  // whether THIS route (matching the URL slug) is the one they're allowed to
  // see — it never widens what they can access.
  if (company.slug !== slug) {
    notFound();
  }

  const initialPageBlocks =
    company.page_blocks.length > 0
      ? company.page_blocks
      : getDefaultPageBlocks(company.name);

  let jobs: Job[];
  try {
    jobs = await getActiveJobsForCompany(company.id);
  } catch {
    jobs = [];
  }

  return (
    <CareersEditor
      company={company}
      initialPageBlocks={initialPageBlocks}
      jobs={jobs}
    />
  );
}
