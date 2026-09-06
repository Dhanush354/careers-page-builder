import Link from "next/link";

const LINKS = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Canvas Editor", href: "/login" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
  ],
  Legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="5" height="5" rx="1" fill="white" />
                  <rect x="9" y="2" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                  <rect x="2" y="9" width="5" height="5" rx="1" fill="white" opacity="0.6" />
                  <rect x="9" y="9" width="5" height="5" rx="1" fill="white" opacity="0.3" />
                </svg>
              </div>
              <span className="text-sm font-bold text-foreground">Careers Builder</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Build stunning careers pages that attract top talent — no code required.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">{group}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Careers Builder. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Privacy</Link>
            <Link href="#" className="text-xs text-muted-foreground transition-colors hover:text-foreground">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
