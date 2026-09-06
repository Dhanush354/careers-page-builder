"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ExternalLink,
  LayoutDashboard,
  ListPlus,
  LogOut,
  Menu,
  Moon,
  PenLine,
  Sun,
  Wand2,
  LayoutTemplate,
  X,
} from "lucide-react";
import { useTheme } from "next-themes";
import { logout } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavGroup {
  label: string;
  items: NavItem[];
}

interface NavItem {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
  disabled?: boolean;
  badge?: string;
  /** When set, clicking the item opens a floating picker with these choices
   *  instead of navigating directly — used where a company has more than
   *  one published page (e.g. the structured editor vs. the canvas editor). */
  viewOptions?: { label: string; href: string }[];
}

interface AppSidebarProps {
  companySlug?: string;
  isPublished?: boolean;
  avatarLabel?: string;
}

export function AppSidebar({ companySlug, isPublished, avatarLabel }: AppSidebarProps) {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => setMounted(true), []);

  const navGroups: NavGroup[] = [
    {
      label: "Overview",
      items: [
        {
          href: "/dashboard",
          icon: <LayoutDashboard className="h-4 w-4 shrink-0" />,
          label: "Dashboard",
        },
      ],
    },
    {
      label: "Page Builder",
      items: [
        {
          href: companySlug ? `/${companySlug}/edit` : "/dashboard",
          icon: <Wand2 className="h-4 w-4 shrink-0" />,
          label: "Edit Page",
          disabled: !companySlug,
        },
        {
          href: companySlug ? `/${companySlug}/builder` : "/dashboard",
          icon: <LayoutTemplate className="h-4 w-4 shrink-0" />,
          label: "Canvas Editor",
          disabled: !companySlug,
          badge: !companySlug ? undefined : "New",
        },
        ...(companySlug && isPublished
          ? [
              {
                href: `/${companySlug}/careers`,
                icon: <ExternalLink className="h-4 w-4 shrink-0" />,
                label: "View Live",
                viewOptions: [
                  { label: "Classic", href: `/${companySlug}/careers` },
                  { label: "Canvas", href: `/${companySlug}/career` },
                ],
              },
            ]
          : []),
      ],
    },
    {
      label: "Jobs",
      items: [
        {
          href: "/jobs",
          icon: <ListPlus className="h-4 w-4 shrink-0" />,
          label: "Manage Jobs",
        },
      ],
    },
  ];

  return (
    <>
      {/* ── Mobile top bar — replaces the always-visible desktop sidebar
          below lg. Sits in normal flow (not fixed) so it stacks above the
          page content instead of beside it. ─────────────────────────── */}
      <div className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-black/[0.06] bg-background px-4 py-2.5 lg:hidden dark:border-white/[0.06]">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70">
            <Briefcase className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="truncate text-[13px] font-semibold tracking-tight text-foreground">
            Careers Builder
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* ── Backdrop ──────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar / mobile drawer ───────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-black/[0.06] bg-[var(--sidebar,hsl(var(--muted)/0.4))] transition-transform duration-200 ease-out dark:border-white/[0.06]",
          "lg:sticky lg:top-0 lg:w-56 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >

        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-black/[0.05] px-4 py-[14px] dark:border-white/[0.06]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-sm">
              <Briefcase className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-tight tracking-tight text-foreground">
                Careers Builder
              </p>
              {companySlug && (
                <p className="truncate text-[11px] text-muted-foreground">{companySlug}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav groups */}
        <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                {group.label}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive =
                    !item.external &&
                    !item.disabled &&
                    (pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href.split("#")[0])));

                  if (item.viewOptions) {
                    return (
                      <DropdownMenu key={item.label}>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-all duration-150 hover:bg-accent/60 hover:text-foreground"
                          >
                            {item.icon}
                            <span className="flex-1 truncate text-left">{item.label}</span>
                            <ExternalLink className="h-3 w-3 shrink-0 opacity-40" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right" align="start" className="w-44">
                          {item.viewOptions.map((option) => (
                            <DropdownMenuItem key={option.href} asChild>
                              <a
                                href={option.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setMobileOpen(false)}
                              >
                                {option.label}
                              </a>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  }

                  if (item.disabled) {
                    return (
                      <div
                        key={item.label}
                        className="flex w-full cursor-not-allowed items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground/40"
                      >
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span className="ml-auto shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground/60">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href + item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      {...(item.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-all duration-150",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      )}
                    >
                      {item.icon}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.external && (
                        <ExternalLink className="h-3 w-3 shrink-0 opacity-40" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-black/[0.05] dark:border-white/[0.06] px-3 py-3 space-y-0.5">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={() => mounted && setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-muted-foreground transition-all duration-150 hover:bg-accent/60 hover:text-foreground"
          >
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 shrink-0" />
            ) : (
              <Moon className="h-4 w-4 shrink-0" />
            )}
            <span>{mounted && resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</span>
          </button>

          {/* User + logout */}
          <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary ring-2 ring-primary/20">
              {avatarLabel ?? "?"}
            </div>
            <span className="flex-1 truncate text-[13px] font-medium text-foreground">
              {avatarLabel ? "My account" : "Account"}
            </span>
            <form action={logout}>
              <button
                type="submit"
                title="Sign out"
                className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/60 transition-all duration-150 hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="sr-only">Sign out</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
