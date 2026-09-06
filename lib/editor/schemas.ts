import { z } from "zod";

const HEX_COLOR_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const hexColor = z
  .string()
  .regex(HEX_COLOR_PATTERN, "Enter a valid hex color, e.g. #2563eb.");

export const themeSchema = z.object({
  primaryColor: hexColor.optional(),
  secondaryColor: hexColor.optional(),
  logoUrl: z.string().nullable().optional(),
  bannerUrl: z.string().nullable().optional(),
});

const heroContentSchema = z.object({
  heading: z.string().max(120),
  description: z.string().max(300),
});

const aboutContentSchema = z.object({
  heading: z.string().max(120),
  body: z.string().max(2000),
  layout: z.enum(["centered", "split"]).default("centered"),
});

const lifeContentSchema = z.object({
  heading: z.string().max(120),
  body: z.string().max(2000),
  layout: z.enum(["centered", "split"]).default("split"),
});

const statItemSchema = z.object({
  id: z.string().min(1),
  value: z.string().max(40),
  label: z.string().max(80),
});

const statsContentSchema = z.object({
  heading: z.string().max(120),
  layout: z.enum(["row", "large"]).default("row"),
  items: z.array(statItemSchema).max(4),
});

const faqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().max(160),
  answer: z.string().max(800),
});

const faqContentSchema = z.object({
  heading: z.string().max(120),
  items: z.array(faqItemSchema).max(12),
});

const openRolesContentSchema = z.object({}).strict();

const benefitItemSchema = z.object({
  id: z.string().min(1),
  emoji: z.string().max(8),
  title: z.string().max(80),
  description: z.string().max(200),
});

const benefitsContentSchema = z.object({
  heading: z.string().max(120),
  layout: z.enum(["grid-2", "grid-3", "grid-4", "list"]).default("grid-3"),
  items: z.array(benefitItemSchema).max(12),
});

const valueItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(80),
  description: z.string().max(300),
});

const valuesContentSchema = z.object({
  heading: z.string().max(120),
  layout: z.enum(["numbered", "grid-2", "grid-3"]).default("numbered"),
  items: z.array(valueItemSchema).max(8),
});

const testimonialItemSchema = z.object({
  id: z.string().min(1),
  quote: z.string().max(300),
  name: z.string().max(80),
  role: z.string().max(80),
  avatarInitials: z.string().max(3),
});

const testimonialsContentSchema = z.object({
  heading: z.string().max(120),
  layout: z.enum(["grid-2", "grid-3"]).default("grid-3"),
  items: z.array(testimonialItemSchema).max(6),
});

const footerContentSchema = z.object({
  tagline: z.string().max(200),
  equalOpportunity: z.boolean(),
  linkedin: z.string().max(200).optional().or(z.literal("")),
  twitter: z.string().max(200).optional().or(z.literal("")),
  github: z.string().max(200).optional().or(z.literal("")),
  instagram: z.string().max(200).optional().or(z.literal("")),
});

const hiringStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().max(80),
  description: z.string().max(300),
  duration: z.string().max(40),
});

const hiringProcessContentSchema = z.object({
  heading: z.string().max(120),
  layout: z.enum(["horizontal", "vertical"]).default("horizontal"),
  steps: z.array(hiringStepSchema).max(8),
});

const ctaBannerContentSchema = z.object({
  heading: z.string().max(120),
  subtext: z.string().max(300),
  buttonLabel: z.string().max(60),
  buttonLink: z.string().max(500),
  background: z.enum(["brand", "dark", "light"]).default("brand"),
  layout: z.enum(["centered", "split"]).default("centered"),
});

// ── block schemas ──────────────────────────────────────────────────────────

const heroBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("hero"),
  visible: z.boolean(),
  content: heroContentSchema,
});

const aboutBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("about"),
  visible: z.boolean(),
  content: aboutContentSchema,
});

const lifeBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("life"),
  visible: z.boolean(),
  content: lifeContentSchema,
});

const statsBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("stats"),
  visible: z.boolean(),
  content: statsContentSchema,
});

const faqBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("faq"),
  visible: z.boolean(),
  content: faqContentSchema,
});

const openRolesBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("openRoles"),
  visible: z.literal(true),
  content: openRolesContentSchema,
});

const benefitsBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("benefits"),
  visible: z.boolean(),
  content: benefitsContentSchema,
});

const valuesBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("values"),
  visible: z.boolean(),
  content: valuesContentSchema,
});

const testimonialsBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("testimonials"),
  visible: z.boolean(),
  content: testimonialsContentSchema,
});

const footerBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("footer"),
  visible: z.boolean(),
  content: footerContentSchema,
});

const hiringProcessBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("hiringProcess"),
  visible: z.boolean(),
  content: hiringProcessContentSchema,
});

const ctaBannerBlockSchema = z.object({
  id: z.string().min(1),
  type: z.literal("ctaBanner"),
  visible: z.boolean(),
  content: ctaBannerContentSchema,
});

export const pageBlockSchema = z.discriminatedUnion("type", [
  heroBlockSchema,
  aboutBlockSchema,
  lifeBlockSchema,
  statsBlockSchema,
  faqBlockSchema,
  openRolesBlockSchema,
  benefitsBlockSchema,
  valuesBlockSchema,
  testimonialsBlockSchema,
  footerBlockSchema,
  hiringProcessBlockSchema,
  ctaBannerBlockSchema,
]);

const SINGLETON_TYPES = [
  "hero", "about", "life", "stats", "faq", "openRoles",
  "benefits", "values", "testimonials", "footer", "hiringProcess", "ctaBanner",
] as const;

const pageBlocksSchema = z
  .array(pageBlockSchema)
  .min(1, "At least one section is required.")
  .superRefine((blocks, ctx) => {
    const seenIds = new Set<string>();
    const typeCounts = new Map<string, number>();

    blocks.forEach((block, index) => {
      if (seenIds.has(block.id)) {
        ctx.addIssue({ code: "custom", message: `Duplicate block id "${block.id}".`, path: [index, "id"] });
      }
      seenIds.add(block.id);
      typeCounts.set(block.type, (typeCounts.get(block.type) ?? 0) + 1);

      const itemBlocks = ["stats", "faq", "benefits", "values", "testimonials", "hiringProcess"] as const;
      for (const t of itemBlocks) {
        if (block.type === t && block.visible && (block.content as { items: unknown[] }).items.length < 1) {
          ctx.addIssue({
            code: "custom",
            message: `Add at least one item before making this section visible.`,
            path: [index, "content", "items"],
          });
        }
      }
    });

    for (const type of SINGLETON_TYPES) {
      if ((typeCounts.get(type) ?? 0) > 1) {
        ctx.addIssue({ code: "custom", message: `Only one "${type}" section is allowed.` });
      }
    }

    if ((typeCounts.get("hero") ?? 0) !== 1) {
      ctx.addIssue({ code: "custom", message: "Exactly one Hero section is required." });
    }
    if ((typeCounts.get("openRoles") ?? 0) !== 1) {
      ctx.addIssue({ code: "custom", message: "Exactly one Open Roles section is required." });
    }
  });

export const saveCareersPageSchema = z.object({
  theme: themeSchema,
  page_blocks: pageBlocksSchema,
});

export type SaveCareersPageInput = z.infer<typeof saveCareersPageSchema>;
