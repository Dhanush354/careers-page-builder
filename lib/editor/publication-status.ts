import type { CompanyTheme, PageBlock } from "@/types/company";

export type PublicationStatus = "published" | "unpublished" | "unpublished-changes";

export function getPublicationStatus({
  draftTheme,
  draftPageBlocks,
  publishedTheme,
  publishedPageBlocks,
  publishedAt,
}: {
  draftTheme: CompanyTheme;
  draftPageBlocks: PageBlock[];
  publishedTheme: CompanyTheme | null;
  publishedPageBlocks: PageBlock[] | null;
  publishedAt: string | null;
}): PublicationStatus {
  if (!publishedAt) return "unpublished";

  const draftMatchesPublished =
    JSON.stringify(draftTheme) === JSON.stringify(publishedTheme ?? {}) &&
    JSON.stringify(draftPageBlocks) === JSON.stringify(publishedPageBlocks ?? []);

  return draftMatchesPublished ? "published" : "unpublished-changes";
}
