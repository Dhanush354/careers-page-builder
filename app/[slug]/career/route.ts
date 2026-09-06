import { NextResponse } from "next/server";
import { getActiveJobsForCompany, getPublishedCompanyBySlug } from "@/lib/careers";
import type { Job } from "@/types/job";

// Serves the canvas-builder published HTML as a raw full-page response.
// Dynamically injects real job listings into any section marked
// data-inject="open-roles" before serving.
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let company;
  try {
    company = await getPublishedCompanyBySlug(slug);
  } catch {
    return new NextResponse("Failed to load page", { status: 500 });
  }

  if (!company) {
    return new NextResponse("Not found", { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const html = (company as any).published_html as string | null;

  if (!html) {
    return NextResponse.redirect(new URL(`/${slug}/careers`, _req.url));
  }

  // Fetch real jobs and inject them if the page has an open-roles section
  let finalHtml = html;
  if (html.includes('data-inject="open-roles"')) {
    try {
      const jobs = await getActiveJobsForCompany(company.id);
      finalHtml = injectJobs(html, jobs, company.theme?.primaryColor ?? "#6366f1");
    } catch {
      // Non-fatal — serve the page without live jobs rather than failing
    }
  }

  // GrapeJS exports fixed pixel/column layouts with no media queries at all
  // (verified: zero @media rules in published output). Applied at serve
  // time so it fixes every already-published page immediately too, not
  // just pages published after this change.
  finalHtml = injectMobileStyles(finalHtml);

  return new NextResponse(finalHtml, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}

// Replaces the inner content of [data-inject="open-roles"] with real job cards
function injectJobs(html: string, jobs: Job[], primary: string): string {
  if (!jobs.length) {
    const empty = `
      <div style="text-align:center;padding:48px 24px;border:2px dashed ${primary}33;border-radius:12px;">
        <div style="font-size:2.5rem;margin-bottom:12px;">💼</div>
        <h3 style="font-size:1.1rem;font-weight:700;color:#111827;margin-bottom:8px;">No open roles right now</h3>
        <p style="color:#6B7280;">Check back soon — we're always growing.</p>
      </div>`;
    return replaceOpenRolesContent(html, empty);
  }

  const cards = jobs.map((job) => {
    const tags = [
      job.location ? `📍 ${job.location}` : null,
      job.job_type  ? `💼 ${job.job_type}`  : null,
      job.work_policy ? `🏠 ${job.work_policy}` : null,
      job.experience_level ? `⭐ ${job.experience_level}` : null,
    ].filter(Boolean).map(t =>
      `<span style="display:inline-block;background:#F3F4F6;border-radius:6px;padding:3px 10px;
                    font-size:.75rem;color:#374151;font-weight:500;">${t}</span>`
    ).join("");

    return `
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:24px;
                  display:flex;flex-direction:column;gap:14px;transition:box-shadow .15s;">
        <div>
          <p style="font-size:1.05rem;font-weight:700;color:#111827;margin-bottom:10px;line-height:1.3;">${escHtml(job.title)}</p>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">${tags}</div>
        </div>
        <a href="#" style="display:block;text-align:center;background:${primary};color:#fff;
                           padding:10px 0;border-radius:8px;font-weight:600;font-size:.875rem;
                           text-decoration:none;margin-top:auto;">
          Apply →
        </a>
      </div>`;
  }).join("");

  const section = `
    <div style="text-align:center;margin-bottom:40px;">
      <p style="font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
                color:${primary};margin-bottom:12px;">Join Us</p>
      <h2 style="font-size:2.25rem;font-weight:700;color:#111827;">Open Roles</h2>
      <p style="font-size:1rem;color:#6B7280;margin-top:8px;">${jobs.length} position${jobs.length !== 1 ? "s" : ""} available</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;">${cards}</div>`;

  return replaceOpenRolesContent(html, section);
}

// GrapeJS's export has no responsive behavior at all — every block is
// authored as fixed pixel/column CSS with zero @media rules. This is a
// serve-time safety net rather than a per-block rewrite, so it applies to
// every already-published page immediately, not just future ones.
function injectMobileStyles(html: string): string {
  const style = `
    <style>
      html, body { overflow-x: hidden; }
      @media (max-width: 700px) {
        /* Collapse any multi-column grid GrapeJS exported (stats, benefits,
           hero image/text split, testimonials, job cards, ...) to one column. */
        * { grid-template-columns: 1fr !important; }
        h1 { font-size: clamp(1.75rem, 8vw, 2.25rem) !important; line-height: 1.15 !important; }
        h2 { font-size: clamp(1.5rem, 7vw, 2rem) !important; line-height: 1.2 !important; }
        h3 { font-size: clamp(1.25rem, 6vw, 1.5rem) !important; line-height: 1.25 !important; }
        section { padding-top: 48px !important; padding-bottom: 48px !important; }
      }
    </style>`;

  return html.includes("</head>")
    ? html.replace("</head>", `${style}\n</head>`)
    : style + html;
}

// Replaces everything inside the [data-inject="open-roles"] element's inner div
function replaceOpenRolesContent(html: string, newContent: string): string {
  // Match the opening tag of the open-roles section and replace its content
  // Strategy: find the section wrapper and replace its entire inner HTML
  return html.replace(
    /(<section[^>]*data-inject="open-roles"[^>]*>)([\s\S]*?)(<\/section>)/,
    `$1\n<div style="max-width:1100px;margin:0 auto;padding:80px 24px;">${newContent}</div>\n$3`
  );
}

function escHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
