import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { RecruiterSetupState } from "@/components/auth/recruiter-setup-state";
import { GrapejsEditor } from "@/components/editor/grapesjs-editor";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import { getActiveJobsForCompany } from "@/lib/careers";
import type { Job } from "@/types/job";

export const metadata: Metadata = {
  title: "Canvas Builder | Careers Page Builder",
};

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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

  if (company.slug !== slug) {
    notFound();
  }

  let jobs: Job[];
  try {
    jobs = await getActiveJobsForCompany(company.id);
  } catch {
    jobs = [];
  }

  return <GrapejsEditor company={company} jobs={jobs} />;
}
