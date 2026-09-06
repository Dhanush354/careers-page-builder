import type { Company } from "@/types/company";

export function CareersHeader({ company }: { company: Company }) {
  const { logoUrl } = company.theme;

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-5 sm:h-[72px] sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          {logoUrl && (
            // Arbitrary recruiter-supplied Storage URL, domain not known ahead of time.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoUrl}
              alt={`${company.name} logo`}
              className="h-8 w-auto shrink-0 object-contain"
            />
          )}
          <span className="truncate text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {company.name}
          </span>
        </div>

        <a
          href="#open-roles"
          className="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Open Roles
        </a>
      </div>
    </header>
  );
}
