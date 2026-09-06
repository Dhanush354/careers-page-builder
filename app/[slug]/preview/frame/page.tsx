import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { CareersPageBody } from "@/components/careers/careers-page-body";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import { getActiveJobsForCompany } from "@/lib/careers";
import type { Job } from "@/types/job";

// Recruiter-only. Renders the SAVED DRAFT (company.theme / page_blocks) via
// the authenticated session, never the public/anon path — this is what
// shows draft content that may not be published yet, so it must never be
// reachable without auth.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PreviewFramePage({
  params,
}: PageProps<"/[slug]/preview/frame">) {
  const { slug } = await params;
  const recruiter = await getCurrentRecruiter();

  if (recruiter.status === "unauthenticated") {
    redirect("/login");
  }

  if (recruiter.status !== "ready") {
    return (
      <div className="flex min-h-full flex-1 items-center justify-center p-8 text-center text-sm text-muted-foreground">
        Preview unavailable — finish setting up your recruiter profile first.
      </div>
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

  return <CareersPageBody company={company} jobs={jobs} />;
}
