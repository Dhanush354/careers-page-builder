import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CareersPageBody } from "@/components/careers/careers-page-body";
import { getActiveJobsForCompany, getPublishedCompanyBySlug } from "@/lib/careers";
import type { Job } from "@/types/job";
import type { Company } from "@/types/company";

export async function generateMetadata({
  params,
}: PageProps<"/[slug]/careers">): Promise<Metadata> {
  const { slug } = await params;
  const company = await getPublishedCompanyBySlug(slug);

  if (!company) {
    return { title: "Careers page not found" };
  }

  return {
    title: `${company.name} | Open Roles`,
    description: `Explore current opportunities at ${company.name}.`,
  };
}

function CareersLoadError() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-lg font-semibold text-foreground">
        This careers page couldn&apos;t be loaded
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Something went wrong on our end. Please try again shortly.
      </p>
    </div>
  );
}

export default async function CompanyCareersPage({
  params,
}: PageProps<"/[slug]/careers">) {
  const { slug } = await params;

  let company: Company | null;
  try {
    company = await getPublishedCompanyBySlug(slug);
  } catch {
    return <CareersLoadError />;
  }

  if (!company) {
    notFound();
  }

  let jobs: Job[];
  try {
    jobs = await getActiveJobsForCompany(company.id);
  } catch {
    return <CareersLoadError />;
  }

  // Public visitors only ever see the PUBLISHED snapshot, never the draft —
  // reuse the shared renderer by substituting theme/page_blocks with their
  // published counterparts.
  const publicCompany: Company = {
    ...company,
    theme: company.published_theme ?? {},
    page_blocks: company.published_page_blocks ?? [],
  };

  return <CareersPageBody company={publicCompany} jobs={jobs} />;
}
