import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/shared/site-footer";
import { SiteHeader } from "@/components/shared/site-header";

const FEATURES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M7 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Drag & drop builder",
    description: "Compose careers pages from pre-built sections without writing a single line of code. Move, remove, and reorder sections instantly.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Live job listings",
    description: "Your open roles sync automatically from the job board. Candidates always see up-to-date listings — no manual publishing required.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h4v4H4V4zM12 4h4v4h-4V4zM4 12h4v4H4v-4zM12 12h4v4h-4v-4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
    ),
    title: "On-brand design",
    description: "Set your primary color, upload a logo, and your page adapts. Every section reflects your company's visual identity automatically.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 2L2 7l8 5 8-5-8-5zM2 13l8 5 8-5M2 10l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Multiple page sections",
    description: "Hero, About Us, Benefits, Team Photos, Testimonials, Hiring Process — choose the sections that tell your company story best.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="5" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 5V4a1 1 0 011-1h4a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Instant publish",
    description: "Hit Publish and your careers page is live on a shareable URL in seconds. No deployments, no config, no waiting.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 10h16M10 2l-4 8 4 8 4-8-4-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Mobile responsive",
    description: "Every page looks great on phone, tablet, and desktop. Preview any breakpoint directly inside the builder before you publish.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Set up your company",
    description: "Add your company name, logo, and brand color. Careers Builder generates a tailored careers page template instantly.",
  },
  {
    number: "02",
    title: "Customize with sections",
    description: "Drag sections onto your canvas — hero, benefits, team photos, testimonials. Edit text and images inline.",
  },
  {
    number: "03",
    title: "Publish & share",
    description: "Hit Publish to go live. Share the link in job boards, LinkedIn, and email signatures. Jobs update automatically.",
  },
];

const STATS = [
  { value: "2 min", label: "to publish a careers page" },
  { value: "15+", label: "pre-built section blocks" },
  { value: "100%", label: "no-code, no design skills needed" },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <SiteHeader />

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-background pt-20 pb-16 sm:pt-28 sm:pb-24">
          {/* Background grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Glow */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-4 py-1.5 text-xs font-semibold text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Now with Canvas Editor — build pages visually
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Careers pages that{" "}
              <span className="text-primary">attract talent</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Build a stunning, branded careers page in minutes — no design skills needed.
              Publish your open roles and let great candidates find you.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8 text-base font-semibold">
                <Link href="/login">Start building for free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base">
                <Link href="/google/career" target="_blank" rel="noopener noreferrer">
                  See live example ↗
                </Link>
              </Button>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">No credit card required · Live in 2 minutes</p>
          </div>

          {/* Browser mockup */}
          <div className="relative mx-auto mt-14 max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl shadow-black/10">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <div className="mx-4 flex-1 rounded-md bg-background px-3 py-1 text-xs text-muted-foreground">
                  yourcompany.hireflow.app/careers
                </div>
              </div>
              {/* Mock page content — fixed height so hero section stays compact */}
              <div className="bg-white px-8 py-6">
                <div className="mx-auto max-w-xl text-center">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-widest text-primary">We're Hiring</div>
                  <div className="mb-3 text-2xl font-bold text-gray-900">Do the most important work of your life</div>
                  <div className="mb-4 text-xs text-gray-500">Join a team of world-class engineers, designers, and thinkers building products used by millions.</div>
                  <div className="flex justify-center gap-3">
                    <div className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white">See Open Roles</div>
                    <div className="rounded-lg border border-primary px-4 py-2 text-xs font-semibold text-primary">Learn About Us</div>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-4 gap-2 border-t border-gray-100 pt-5">
                  {["180K+ Employees", "50+ Countries", "2B+ Users", "Est. 1998"].map((s) => (
                    <div key={s} className="rounded-lg bg-primary/5 px-2 py-3 text-center text-[11px] font-semibold text-gray-700">{s}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ────────────────────────────────────────────────────── */}
        <section className="border-y border-border bg-muted/30">
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-3xl font-bold text-foreground sm:text-4xl">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────────── */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Everything you need</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Built for recruiters, loved by candidates
              </h2>
              <p className="mt-4 text-base text-muted-foreground">
                Every feature you need to attract top talent — from a visual page builder to automatic job syncing.
              </p>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    {f.icon}
                  </div>
                  <h3 className="mb-2 text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────────── */}
        <section id="how-it-works" className="bg-muted/30 py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Simple by design</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                From sign-up to published in 3 steps
              </h2>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.number} className="relative">
                  {i < STEPS.length - 1 && (
                    <div className="absolute left-full top-6 hidden w-full -translate-y-px border-t border-dashed border-border sm:block" style={{ width: "calc(100% - 2.5rem)", left: "calc(100% - 1rem)" }} />
                  )}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {step.number}
                    </div>
                    <h3 className="text-base font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-primary">Pricing</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Simple, honest pricing
              </h2>
              <p className="mt-4 text-base text-muted-foreground">Start free. Upgrade when you grow.</p>
            </div>

            <div className="mx-auto mt-16 grid max-w-4xl gap-6 sm:grid-cols-2">
              {/* Free */}
              <div className="rounded-2xl border border-border bg-card p-8">
                <p className="text-sm font-semibold text-muted-foreground">Free</p>
                <p className="mt-2 text-4xl font-bold text-foreground">$0</p>
                <p className="mt-1 text-sm text-muted-foreground">Forever free</p>
                <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                  {["1 careers page", "Up to 5 open roles", "Canvas builder", "Custom branding"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2"><path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8 w-full" variant="outline">
                  <Link href="/login">Get started free</Link>
                </Button>
              </div>

              {/* Pro */}
              <div className="relative rounded-2xl border-2 border-primary bg-card p-8">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  Most popular
                </div>
                <p className="text-sm font-semibold text-primary">Pro</p>
                <p className="mt-2 text-4xl font-bold text-foreground">$29</p>
                <p className="mt-1 text-sm text-muted-foreground">per month</p>
                <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                  {["Unlimited careers pages", "Unlimited open roles", "Custom domain", "Analytics dashboard", "Priority support", "Remove Careers Builder branding"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-primary shrink-0" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth="2"><path d="M3 8l3 3 7-7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8 w-full">
                  <Link href="/login">Start free trial</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="bg-primary py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to attract better candidates?
            </h2>
            <p className="mt-4 text-base text-primary-foreground/80">
              Join recruiters who use Careers Builder to build careers pages that convert.
              No design skills, no code, no waiting.
            </p>
            <Button asChild size="lg" className="mt-8 h-12 bg-white px-8 text-base font-semibold text-primary hover:bg-white/90">
              <Link href="/login">Get started for free →</Link>
            </Button>
          </div>
        </section>

      </main>
      <SiteFooter />
    </div>
  );
}
