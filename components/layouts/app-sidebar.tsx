"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  Eye,
  ExternalLink,
  LayoutDashboard,
  ListPlus,
  LogOut,
  Moon,
  Palette,
  PenLine,
  Share2,
  Sun,
  Wand2,
  LayoutTemplate,
} from "lucide-react";
import { useTheme } from "next-themes";
import { logout } from "@/lib/auth/actions";
import { cn } from "@/lib/utils";

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
        {
          href: companySlug ? `/${companySlug}/preview` : "/dashboard",
          icon: <Eye className="h-4 w-4 shrink-0" />,
          label: "Preview",
          disabled: !companySlug,
        },
        ...(companySlug && isPublished
          ? [
              {
                href: `/${companySlug}/careers`,
                icon: <ExternalLink className="h-4 w-4 shrink-0" />,
                label: "View Live",
                external: true,
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
    {
      label: "Company",
      items: [
        {
          href: companySlug ? `/${companySlug}/edit#branding` : "/dashboard",
          icon: <Palette className="h-4 w-4 shrink-0" />,
          label: "Branding",
          disabled: !companySlug,
        },
        {
          href: companySlug ? `/${companySlug}/careers` : "/dashboard",
          icon: <Share2 className="h-4 w-4 shrink-0" />,
          label: "Share Link",
          external: !!companySlug && isPublished,
          disabled: !companySlug || !isPublished,
          badge: !isPublished ? "Unpublished" : undefined,
        },
      ],
    },
  ];

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-black/[0.06] dark:border-white/[0.06] bg-[var(--sidebar,hsl(var(--muted)/0.4))]">

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-black/[0.05] dark:border-white/[0.06] px-4 py-[14px]">
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
  );
}
