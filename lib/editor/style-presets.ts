import type { CompanyTheme } from "@/types/company";

export type StylePreset = {
  id: string;
  label: string;
  // 2 swatches shown on the preset chip (primary, secondary)
  swatch: [string, string];
  theme: Pick<CompanyTheme, "primaryColor" | "secondaryColor" | "textColor" | "fontFamily" | "fontSize">;
};

// Ready-made font + color combinations a recruiter can apply in one click,
// then still fine-tune individually afterwards.
export const STYLE_PRESETS: StylePreset[] = [
  {
    id: "modern-minimal",
    label: "Modern Minimal",
    swatch: ["#6366f1", "#a855f7"],
    theme: { primaryColor: "#6366f1", secondaryColor: "#a855f7", textColor: "#111827", fontFamily: "inter", fontSize: "md" },
  },
  {
    id: "warm-friendly",
    label: "Warm & Friendly",
    swatch: ["#f97316", "#fb923c"],
    theme: { primaryColor: "#f97316", secondaryColor: "#fb923c", textColor: "#1f2937", fontFamily: "poppins", fontSize: "md" },
  },
  {
    id: "editorial",
    label: "Editorial",
    swatch: ["#111827", "#6b7280"],
    theme: { primaryColor: "#111827", secondaryColor: "#6b7280", textColor: "#111827", fontFamily: "playfair", fontSize: "lg" },
  },
  {
    id: "classic-corporate",
    label: "Classic Corporate",
    swatch: ["#1d4ed8", "#60a5fa"],
    theme: { primaryColor: "#1d4ed8", secondaryColor: "#60a5fa", textColor: "#1e293b", fontFamily: "merriweather", fontSize: "md" },
  },
  {
    id: "modern-tech",
    label: "Modern Tech",
    swatch: ["#10b981", "#34d399"],
    theme: { primaryColor: "#10b981", secondaryColor: "#34d399", textColor: "#0f172a", fontFamily: "space-grotesk", fontSize: "md" },
  },
  {
    id: "bold-playful",
    label: "Bold & Playful",
    swatch: ["#ec4899", "#f472b6"],
    theme: { primaryColor: "#ec4899", secondaryColor: "#f472b6", textColor: "#111827", fontFamily: "hanken", fontSize: "lg" },
  },
];
