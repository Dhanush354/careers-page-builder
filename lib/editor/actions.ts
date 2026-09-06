"use server";

import { revalidatePath } from "next/cache";
import { getCurrentRecruiter } from "@/lib/auth/get-current-recruiter";
import { createClient } from "@/lib/supabase/server";
import { saveCareersPageSchema } from "@/lib/editor/schemas";

export type EditorActionResult = { ok: true } | { ok: false; error: string };

function revalidateCompanyRoutes(slug: string) {
  revalidatePath(`/${slug}/careers`);
  revalidatePath(`/${slug}/edit`);
  revalidatePath(`/${slug}/preview`);
}

// Draft save — company identity is re-resolved from the authenticated
// session on every call, a client-supplied company id/slug is never
// trusted. Touches ONLY theme/page_blocks; never published_*.
export async function saveCareersPage(input: {
  theme: unknown;
  page_blocks: unknown;
}): Promise<EditorActionResult> {
  const recruiter = await getCurrentRecruiter();

  if (recruiter.status !== "ready") {
    return {
      ok: false,
      error: "You must be signed in to a company to save changes.",
    };
  }

  const parsed = saveCareersPageSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Some fields are invalid. Please check your entries and try again.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("companies")
    .update({
      theme: parsed.data.theme,
      page_blocks: parsed.data.page_blocks,
    })
    .eq("id", recruiter.company.id);

  if (error) {
    return {
      ok: false,
      error: "We couldn't save your changes. Please try again.",
    };
  }

  revalidateCompanyRoutes(recruiter.company.slug);
  return { ok: true };
}

// Publish — copies the CURRENT SAVED DRAFT (re-read from the DB via the
// authenticated session, never from client-supplied state) into the
// published snapshot. Re-validated with the same schema as Save Draft, so
// nothing invalid can ever go live.
export async function publishCareersPage(): Promise<EditorActionResult> {
  const recruiter = await getCurrentRecruiter();

  if (recruiter.status !== "ready") {
    return {
      ok: false,
      error: "You must be signed in to a company to publish changes.",
    };
  }

  const parsed = saveCareersPageSchema.safeParse({
    theme: recruiter.company.theme,
    page_blocks: recruiter.company.page_blocks,
  });

  if (!parsed.success) {
    return {
      ok: false,
      error:
        "Your saved draft has invalid data and can't be published. Please review your sections and save again.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("companies")
    .update({
      published_theme: parsed.data.theme,
      published_page_blocks: parsed.data.page_blocks,
      published_at: new Date().toISOString(),
    })
    .eq("id", recruiter.company.id);

  if (error) {
    return {
      ok: false,
      error: "We couldn't publish your changes. Please try again.",
    };
  }

  revalidateCompanyRoutes(recruiter.company.slug);
  return { ok: true };
}

// Unpublish — only ever clears published_at. Draft and published snapshot
// data are both left intact so re-publishing later doesn't lose anything.
export async function unpublishCareersPage(): Promise<EditorActionResult> {
  const recruiter = await getCurrentRecruiter();

  if (recruiter.status !== "ready") {
    return {
      ok: false,
      error: "You must be signed in to a company to unpublish.",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("companies")
    .update({ published_at: null })
    .eq("id", recruiter.company.id);

  if (error) {
    return {
      ok: false,
      error: "We couldn't unpublish your careers page. Please try again.",
    };
  }

  revalidateCompanyRoutes(recruiter.company.slug);
  return { ok: true };
}
