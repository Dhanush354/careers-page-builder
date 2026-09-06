import type { CSSProperties } from "react";
import type { CompanyTheme } from "@/types/company";
import { getFontOption, getFontSizeScale } from "@/lib/editor/theme-options";

// Tailwind v4 exposes every design-token as a real, inheritable CSS custom
// property (--font-sans, --foreground, --text-3xl, ...) that utility classes
// read via var(). Overriding those same variable names on an ancestor node
// re-themes every descendant utility class automatically — headings, body
// copy, muted captions, job cards — with zero changes to the block
// components themselves. See app/globals.css's `@theme inline` block and
// node_modules/tailwindcss/theme.css for the variables this relies on.
const TEXT_SIZE_TOKENS_REM: Record<string, number> = {
  xs: 0.75, sm: 0.875, base: 1, lg: 1.125, xl: 1.25,
  "2xl": 1.5, "3xl": 1.875, "4xl": 2.25, "5xl": 3, "6xl": 3.75, "7xl": 4.5,
};

// Applied to the outermost wrapper of both the editor's live preview
// (components/editor/editor-preview.tsx) and the rendered careers page
// (components/careers/careers-page-body.tsx) — never touches the GrapeJS
// canvas builder, which renders into its own isolated iframe document.
export function getThemeCssVars(theme: CompanyTheme): CSSProperties {
  const vars: Record<string, string> = {};

  const font = getFontOption(theme.fontFamily);
  if (font) {
    const stack = `var(${font.cssVar}), ${font.fallback}`;
    vars["--font-sans"] = stack;
    vars["--font-heading"] = stack;
  }

  if (theme.textColor) {
    vars["--foreground"] = theme.textColor;
    vars["--muted-foreground"] = `color-mix(in srgb, ${theme.textColor} 70%, transparent)`;
  }

  const scale = getFontSizeScale(theme.fontSize);
  if (scale !== 1) {
    for (const [token, rem] of Object.entries(TEXT_SIZE_TOKENS_REM)) {
      vars[`--text-${token}`] = `${(rem * scale).toFixed(4)}rem`;
    }
  }

  return vars as CSSProperties;
}
