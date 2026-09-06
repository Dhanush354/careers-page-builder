import { redirect } from "next/navigation";
import { JobsManager } from "@/components/jobs/jobs-manager";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import { getActiveJobsForCompany } from "@/lib/careers";

export default async function JobsPage() {
  const recruiter = await getCurrentRecruiter();

  if (recruiter.status === "unauthenticated") redirect("/login");
  if (recruiter.status !== "ready") redirect("/dashboard");

  const { profile, company } = recruiter;
  const displayName = profile.full_name || "Recruiter";
  const avatarLabel = displayName.trim().charAt(0).toUpperCase();
  const isPublished = company.published_at !== null;

  let jobs: Awaited<ReturnType<typeof getActiveJobsForCompany>> = [];
  try {
    jobs = await getActiveJobsForCompany(company.id);
  } catch {
    jobs = [];
  }

  return (
    <div className="flex min-h-screen w-full bg-[--shell-canvas]">
      <AppSidebar
        companySlug={company.slug}
        isPublished={isPublished}
        avatarLabel={avatarLabel}
      />
      <main className="flex-1 overflow-y-auto px-4 py-7 sm:px-6 lg:px-8">
        <JobsManager jobs={jobs} />
      </main>
    </div>
  );
}
