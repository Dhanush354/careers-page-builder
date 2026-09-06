// Fonts a recruiter can pick for their careers page. Each `cssVar` must match
// a `variable` name registered on a next/font/google loader in app/layout.tsx
// — that's what actually makes the font's @font-face available to reference.
export type FontOptionId =
  | "inter"
  | "hanken"
  | "poppins"
  | "playfair"
  | "merriweather"
  | "space-grotesk";

export const FONT_OPTIONS: {
  id: FontOptionId;
  label: string;
  cssVar: string;
  fallback: string;
}[] = [
  { id: "inter", label: "Inter", cssVar: "--font-sans", fallback: "ui-sans-serif, system-ui, sans-serif" },
  { id: "hanken", label: "Hanken Grotesk", cssVar: "--font-display", fallback: "ui-sans-serif, system-ui, sans-serif" },
  { id: "poppins", label: "Poppins", cssVar: "--font-poppins", fallback: "ui-sans-serif, system-ui, sans-serif" },
  { id: "space-grotesk", label: "Space Grotesk", cssVar: "--font-space-grotesk", fallback: "ui-sans-serif, system-ui, sans-serif" },
  { id: "playfair", label: "Playfair Display", cssVar: "--font-playfair", fallback: "Georgia, 'Times New Roman', serif" },
  { id: "merriweather", label: "Merriweather", cssVar: "--font-merriweather", fallback: "Georgia, 'Times New Roman', serif" },
];

export function getFontOption(id?: string) {
  return FONT_OPTIONS.find((f) => f.id === id);
}

// Scales every Tailwind `text-*` size token uniformly — a gentle nudge for
// readability, not a full independent type scale.
export const FONT_SIZE_OPTIONS: { id: "sm" | "md" | "lg"; label: string; scale: number }[] = [
  { id: "sm", label: "Small", scale: 0.925 },
  { id: "md", label: "Medium", scale: 1 },
  { id: "lg", label: "Large", scale: 1.08 },
];

export function getFontSizeScale(id?: string): number {
  return FONT_SIZE_OPTIONS.find((f) => f.id === id)?.scale ?? 1;
}
