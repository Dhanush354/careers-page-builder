import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, LayoutList, Link2, Palette, Target } from "lucide-react";
import { RecruiterSetupState } from "@/components/auth/recruiter-setup-state";
import { CopyLinkButton } from "@/components/dashboard/copy-link-button";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { LivePageSnapshot } from "@/components/dashboard/live-page-snapshot";
import { RecentJobsTable } from "@/components/dashboard/recent-jobs-table";
import { AppSidebar } from "@/components/layouts/app-sidebar";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import { getActiveJobsForCompany } from "@/lib/careers";
import { getPublicationStatus } from "@/lib/editor/publication-status";

function SetupState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <DashboardHeader />
      <RecruiterSetupState title={title} description={description} />
    </div>
  );
}

export default async function DashboardPage() {
  const recruiter = await getCurrentRecruiter();

  if (recruiter.status === "unauthenticated") redirect("/login");
  if (recruiter.status === "no-profile")
    return (
      <SetupState
        title="Your recruiter profile isn't set up yet"
        description="Contact your administrator to finish linking your account to a company."
      />
    );
  if (recruiter.status === "no-company")
    return (
      <SetupState
        title="Your profile isn't linked to a company yet"
        description="Contact your administrator to finish setup."
      />
    );
  if (recruiter.status === "company-load-error")
    return (
      <SetupState
        title="We couldn't load your company"
        description="Something went wrong on our end. Please try again shortly."
      />
    );

  const { user, profile, company } = recruiter;
  const displayName = profile.full_name || user.email || "Recruiter";
  const firstName = displayName.split(" ")[0];
  const avatarLabel = displayName.trim().charAt(0).toUpperCase() || "?";

  let jobs: Awaited<ReturnType<typeof getActiveJobsForCompany>> = [];
  try {
    jobs = await getActiveJobsForCompany(company.id);
  } catch {
    jobs = [];
  }

  const isPublished = company.published_at !== null;
  const publicationStatus = getPublicationStatus({
    draftTheme: company.theme,
    draftPageBlocks: company.page_blocks,
    publishedTheme: company.published_theme,
    publishedPageBlocks: company.published_page_blocks,
    publishedAt: company.published_at,
  });

  const accentColor = company.theme.primaryColor ?? "#4F46E5";

  const quickActions = [
    {
      icon: <Palette className="h-[18px] w-[18px]" />,
      label: "Customize Branding & Theme",
      description: "Logo, banner, and accent colors",
      href: `/${company.slug}/edit`,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: <LayoutList className="h-[18px] w-[18px]" />,
      label: "Reorder Page Content Blocks",
      description: "About Us, Life at Company, Stats, FAQ",
      href: `/${company.slug}/edit`,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: <Briefcase className="h-[18px] w-[18px]" />,
      label: "Manage Listed Job Postings",
      description: `${jobs.length} active role${jobs.length !== 1 ? "s" : ""} currently listed`,
      href: "/jobs",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-[--shell-canvas] lg:flex-row">
      <AppSidebar
        companySlug={company.slug}
        isPublished={isPublished}
        avatarLabel={avatarLabel}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-4 py-7 sm:px-6 lg:px-8">

            {/* Welcome */}
            <div className="mb-7">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Dashboard
              </p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Welcome back, {firstName}! 👋
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your branded Careers Page and track job listings.
              </p>
            </div>

            {/* 3 stat cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {/* Active Open Roles */}
              <div className="zk-card flex items-start gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Active Open Roles
                  </p>
                  <p className="mt-0.5 font-display text-2xl font-bold tracking-tight text-foreground">
                    {jobs.length}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Position{jobs.length !== 1 ? "s" : ""} currently listed
                  </p>
                </div>
              </div>

              {/* Theme Accent Color */}
              <div className="zk-card flex items-start gap-4 p-5">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: accentColor + "1a" }}
                >
                  <div
                    className="h-5 w-5 rounded-full"
                    style={{
                      backgroundColor: accentColor,
                      boxShadow: `0 0 0 2px white, 0 0 0 4px ${accentColor}55`,
                    }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Theme Accent Color
                  </p>
                  <p className="mt-0.5 font-mono text-base font-bold tracking-tight text-foreground">
                    {accentColor.startsWith("#") ? accentColor.toUpperCase() : accentColor}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Brand primary color</p>
                </div>
              </div>

              {/* Public Careers Page */}
              <div className="zk-card flex items-start gap-4 p-5 sm:col-span-2 xl:col-span-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Link2 className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Public Careers Page
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="flex-1 truncate font-mono text-xs font-semibold text-foreground">
                      /{company.slug}/careers
                    </span>
                    <CopyLinkButton path={`/${company.slug}/careers`} />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {isPublished ? "Live now" : "Not published yet"}
                  </p>
                </div>
              </div>
            </div>

            {/* Snapshot + Quick Navigation */}
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-5">
              <div className="md:col-span-3">
                <LivePageSnapshot
                  companySlug={company.slug}
                  theme={company.theme}
                  pageBlocks={company.page_blocks}
                  companyName={company.name}
                  publicationStatus={publicationStatus}
                />
              </div>
              <div className="md:col-span-2">
                <div className="zk-card h-full overflow-hidden">
                  <div className="zk-card-divider px-5 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      Quick Navigation
                    </p>
                  </div>
                  <div className="flex flex-col">
                    {quickActions.map((action, i) => (
                      <Link
                        key={action.label}
                        href={action.href}
                        className={`flex items-center gap-3 px-5 py-4 transition-colors hover:bg-muted/40 ${
                          i < quickActions.length - 1
                            ? "border-b border-black/[0.04] dark:border-white/[0.04]"
                            : ""
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${action.iconBg} ${action.iconColor}`}
                        >
                          {action.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold leading-tight text-foreground">
                            {action.label}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Job Listings */}
            <div className="mt-5">
              <RecentJobsTable jobs={jobs} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
