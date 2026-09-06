import type { PageBlock, PageBlockType } from "@/types/company";

export function getDefaultPageBlocks(companyName: string): PageBlock[] {
  return [
    {
      id: "hero",
      type: "hero",
      visible: true,
      content: {
        heading: "Join our team",
        description: `Explore opportunities at ${companyName}.`,
      },
    },
    {
      id: "about",
      type: "about",
      visible: true,
      content: {
        heading: "About Us",
        body: "",
        layout: "centered" as const,
      },
    },
    {
      id: "open-roles",
      type: "openRoles",
      visible: true,
      content: {},
    },
  ];
}

// Safe empty/default content for a newly added optional block — never
// invents company facts, only generic section labels.
export function createDefaultBlock(
  type: PageBlockType,
  companyName: string
): PageBlock {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${type}-${Date.now()}`;

  switch (type) {
    case "hero":
      return {
        id,
        type: "hero",
        visible: true,
        content: {
          heading: "Join our team",
          description: `Explore opportunities at ${companyName}.`,
        },
      };
    case "about":
      return {
        id,
        type: "about",
        visible: true,
        content: { heading: "About Us", body: "", layout: "centered" as const },
      };
    case "life":
      return {
        id,
        type: "life",
        visible: true,
        content: { heading: `Life at ${companyName}`, body: "", layout: "split" as const },
      };
    case "stats":
      return {
        id,
        type: "stats",
        visible: true,
        content: { heading: "By the Numbers", layout: "row" as const, items: [] },
      };
    case "faq":
      return {
        id,
        type: "faq",
        visible: true,
        content: { heading: "Frequently Asked Questions", items: [] },
      };
    case "openRoles":
      return { id, type: "openRoles", visible: true, content: {} };
    case "benefits":
      return {
        id,
        type: "benefits",
        visible: true,
        content: {
          heading: "Benefits & Perks",
          layout: "grid-3" as const,
          items: [
            { id: `${id}-1`, emoji: "🏥", title: "Health & Dental", description: "Comprehensive medical, dental, and vision coverage." },
            { id: `${id}-2`, emoji: "🌍", title: "Remote Friendly", description: "Work from anywhere — we're async-first." },
            { id: `${id}-3`, emoji: "📚", title: "Learning Budget", description: "$1,000/year for books, courses, and conferences." },
            { id: `${id}-4`, emoji: "🏖️", title: "Unlimited PTO", description: "Take the time you need to recharge." },
          ],
        },
      };
    case "values":
      return {
        id,
        type: "values",
        visible: true,
        content: {
          heading: "What We Believe",
          layout: "numbered" as const,
          items: [
            { id: `${id}-1`, title: "Ship fast", description: "We move quickly, learn from real users, and iterate." },
            { id: `${id}-2`, title: "Own the outcome", description: "Every team member takes responsibility end-to-end." },
            { id: `${id}-3`, title: "Be transparent", description: "Default to sharing context, not hoarding it." },
            { id: `${id}-4`, title: "Raise the bar", description: "We hold each other to a high standard — and grow together." },
          ],
        },
      };
    case "testimonials":
      return {
        id,
        type: "testimonials",
        visible: true,
        content: {
          heading: "Hear from the Team",
          layout: "grid-3" as const,
          items: [
            { id: `${id}-1`, quote: "The best team I've ever worked with. Everyone is smart, kind, and deeply cares about the product.", name: "Alex R.", role: "Senior Engineer", avatarInitials: "AR" },
            { id: `${id}-2`, quote: "I've grown more in one year here than in three years anywhere else. The learning culture is real.", name: "Sam K.", role: "Product Designer", avatarInitials: "SK" },
          ],
        },
      };
    case "footer":
      return {
        id,
        type: "footer",
        visible: true,
        content: {
          tagline: `We're building something great at ${companyName}. Come join us.`,
          equalOpportunity: true,
          linkedin: "",
          twitter: "",
          github: "",
          instagram: "",
        },
      };
    case "hiringProcess":
      return {
        id,
        type: "hiringProcess",
        visible: true,
        content: {
          heading: "Our Hiring Process",
          layout: "horizontal" as const,
          steps: [
            { id: `${id}-1`, title: "Apply Online", description: "Submit your application and we'll review it within 5 business days.", duration: "5 days" },
            { id: `${id}-2`, title: "Recruiter Screen", description: "A 30-min call to learn about you and share more about the role.", duration: "30 min" },
            { id: `${id}-3`, title: "Technical Interview", description: "Meet the team and dive into your skills and experience.", duration: "1 hour" },
            { id: `${id}-4`, title: "Offer", description: "We move fast — expect an offer within 48 hours of your final interview.", duration: "48 hours" },
          ],
        },
      };
    case "ctaBanner":
      return {
        id,
        type: "ctaBanner",
        visible: true,
        content: {
          heading: `Ready to join ${companyName}?`,
          subtext: "Browse our open roles and find where you fit.",
          buttonLabel: "See Open Roles",
          buttonLink: "#open-roles",
          background: "brand" as const,
          layout: "centered" as const,
        },
      };
  }
}
