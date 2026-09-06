"use server";

import { revalidatePath } from "next/cache";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import { createClient } from "@/lib/supabase/server";

export type GjsActionResult = { ok: true } | { ok: false; error: string };

function revalidateBuilderRoutes(slug: string) {
  revalidatePath(`/${slug}/builder`);
  revalidatePath(`/${slug}/careers`);
  revalidatePath(`/${slug}/career`);
}

export async function saveGrapejsData(
  data: Record<string, unknown>
): Promise<GjsActionResult> {
  const recruiter = await getCurrentRecruiter();

  if (recruiter.status !== "ready") {
    return { ok: false, error: "You must be signed in to save changes." };
  }

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("companies") as any)
    .update({ grapesjs_data: data })
    .eq("id", recruiter.company.id);

  if (error) {
    return { ok: false, error: "Failed to save. Please try again." };
  }

  revalidateBuilderRoutes(recruiter.company.slug);
  return { ok: true };
}

export async function publishGrapejsPage(
  html: string,
  css: string
): Promise<GjsActionResult> {
  const recruiter = await getCurrentRecruiter();

  if (recruiter.status !== "ready") {
    return { ok: false, error: "You must be signed in to publish." };
  }

  // editor.getHtml() returns body content only — wrap it into a complete document
  // so /[slug]/career can serve it directly as a styled standalone page.
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Careers at ${recruiter.company.name}</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#111827;background:#fff}
img{max-width:100%;display:block}
a{text-decoration:none}
/* GrapeJS exported styles */
${css}
</style>
</head>
<body>
${html}
</body>
</html>`;

  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("companies") as any)
    .update({
      published_html: fullHtml,
      published_css: css,
      published_at: new Date().toISOString(),
    })
    .eq("id", recruiter.company.id);

  if (error) {
    return { ok: false, error: "Failed to publish. Please try again." };
  }

  revalidateBuilderRoutes(recruiter.company.slug);
  return { ok: true };
}
