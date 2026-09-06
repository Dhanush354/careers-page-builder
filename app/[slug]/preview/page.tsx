import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { RecruiterSetupState } from "@/components/auth/recruiter-setup-state";
import { ResponsivePreview } from "@/components/editor/responsive-preview";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import { getPublicationStatus } from "@/lib/editor/publication-status";

export const metadata: Metadata = {
  title: "Preview Careers Page | Careers Page Builder",
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
}: PageProps<"/[slug]/preview">) {
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

  const publicationStatus = getPublicationStatus({
    draftTheme: company.theme,
    draftPageBlocks: company.page_blocks,
    publishedTheme: company.published_theme,
    publishedPageBlocks: company.published_page_blocks,
    publishedAt: company.published_at,
  });

  return (
    <ResponsivePreview
      companyName={company.name}
      companySlug={company.slug}
      publicationStatus={publicationStatus}
      isPublished={company.published_at !== null}
    />
  );
}
