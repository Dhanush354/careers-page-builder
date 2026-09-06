// `type` aliases, not `interface` — an `interface` used as a Supabase table's
// Row type breaks @supabase/postgrest-js's generic inference for `.update()`
// in a way that silently resolves to `never` (a `type` alias does not).

export type CompanyTheme = {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
};

export type StatItem = {
  id: string;
  value: string;
  label: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export type BenefitItem = {
  id: string;
  emoji: string;
  title: string;
  description: string;
};

export type ValueItem = {
  id: string;
  title: string;
  description: string;
};

export type TestimonialItem = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatarInitials: string;
};

export type HiringStep = {
  id: string;
  title: string;
  description: string;
  duration: string;
};

export type HeroBlock = {
  id: string;
  type: "hero";
  visible: boolean;
  content: {
    heading: string;
    description: string;
  };
};

export type AboutBlock = {
  id: string;
  type: "about";
  visible: boolean;
  content: {
    heading: string;
    body: string;
    layout: "centered" | "split";
  };
};

export type LifeBlock = {
  id: string;
  type: "life";
  visible: boolean;
  content: {
    heading: string;
    body: string;
    layout: "centered" | "split";
  };
};

export type StatsBlock = {
  id: string;
  type: "stats";
  visible: boolean;
  content: {
    heading: string;
    layout: "row" | "large";
    items: StatItem[];
  };
};

export type FaqBlock = {
  id: string;
  type: "faq";
  visible: boolean;
  content: {
    heading: string;
    items: FaqItem[];
  };
};

export type OpenRolesBlock = {
  id: string;
  type: "openRoles";
  visible: boolean;
  content: Record<string, never>;
};

export type BenefitsBlock = {
  id: string;
  type: "benefits";
  visible: boolean;
  content: {
    heading: string;
    layout: "grid-2" | "grid-3" | "grid-4" | "list";
    items: BenefitItem[];
  };
};

export type ValuesBlock = {
  id: string;
  type: "values";
  visible: boolean;
  content: {
    heading: string;
    layout: "numbered" | "grid-2" | "grid-3";
    items: ValueItem[];
  };
};

export type TestimonialsBlock = {
  id: string;
  type: "testimonials";
  visible: boolean;
  content: {
    heading: string;
    layout: "grid-2" | "grid-3";
    items: TestimonialItem[];
  };
};

export type FooterBlock = {
  id: string;
  type: "footer";
  visible: boolean;
  content: {
    tagline: string;
    equalOpportunity: boolean;
    linkedin?: string;
    twitter?: string;
    github?: string;
    instagram?: string;
  };
};

export type HiringProcessBlock = {
  id: string;
  type: "hiringProcess";
  visible: boolean;
  content: {
    heading: string;
    layout: "horizontal" | "vertical";
    steps: HiringStep[];
  };
};

export type CtaBannerBlock = {
  id: string;
  type: "ctaBanner";
  visible: boolean;
  content: {
    heading: string;
    subtext: string;
    buttonLabel: string;
    buttonLink: string;
    background: "brand" | "dark" | "light";
    layout: "centered" | "split";
  };
};

export type PageBlock =
  | HeroBlock
  | AboutBlock
  | LifeBlock
  | StatsBlock
  | FaqBlock
  | OpenRolesBlock
  | BenefitsBlock
  | ValuesBlock
  | TestimonialsBlock
  | FooterBlock
  | HiringProcessBlock
  | CtaBannerBlock;

export type PageBlockType = PageBlock["type"];

// Every optional (non-singleton-mandatory) block type, in the order they
// should be offered in "Add Section".
export const OPTIONAL_BLOCK_TYPES: readonly PageBlockType[] = [
  "about",
  "life",
  "benefits",
  "values",
  "hiringProcess",
  "stats",
  "testimonials",
  "ctaBanner",
  "faq",
  "footer",
];

export const BLOCK_TYPE_LABELS: Record<PageBlockType, string> = {
  hero: "Hero",
  about: "About Us",
  life: "Life at Company",
  benefits: "Benefits & Perks",
  values: "Our Values",
  hiringProcess: "Hiring Process",
  stats: "Stats",
  testimonials: "Testimonials",
  ctaBanner: "CTA Banner",
  faq: "FAQ",
  openRoles: "Open Roles",
  footer: "Footer",
};

export type Company = {
  id: string;
  name: string;
  slug: string;
  // Draft — edited via /[slug]/edit, shown by the recruiter preview.
  theme: CompanyTheme;
  page_blocks: PageBlock[];
  // Published snapshot — what the public /[slug]/careers page renders.
  // Null until the recruiter publishes for the first time.
  published_theme: CompanyTheme | null;
  published_page_blocks: PageBlock[] | null;
  published_at: string | null;
  // GrapeJS canvas builder — added by migration; null until builder is used.
  grapesjs_data?: Record<string, unknown> | null;
  published_html?: string | null;
  published_css?: string | null;
  created_at: string;
  updated_at: string;
};
