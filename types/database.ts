import type { Company, CompanyTheme, PageBlock } from "./company";
import type { Job } from "./job";
import type { Profile } from "./profile";

// Hand-written to match supabase/migrations/001_initial_schema.sql.
// Regenerate with `supabase gen types typescript` once the project is
// linked via the Supabase CLI, if preferred.
//
// `Relationships` (and the schema-level `Views`/`Functions`) are required by
// @supabase/postgrest-js's `GenericTable`/`GenericSchema` constraints — without
// them, type inference for query results silently breaks down instead of
// erroring at the point of the missing field.

export interface Database {
  public: {
    Tables: {
      companies: {
        Row: Company;
        Insert: {
          id?: string;
          name: string;
          slug: string;
          theme?: CompanyTheme;
          page_blocks?: PageBlock[];
          published_theme?: CompanyTheme | null;
          published_page_blocks?: PageBlock[] | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["companies"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          company_id?: string | null;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      jobs: {
        Row: Job;
        Insert: {
          id?: string;
          company_id: string;
          title: string;
          work_policy?: string | null;
          location?: string | null;
          department?: string | null;
          employment_type?: string | null;
          experience_level?: string | null;
          job_type?: string | null;
          salary_range?: string | null;
          job_slug?: string | null;
          posted_days_ago?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["jobs"]["Insert"]>;
        Relationships: [];
      };
    };
    // Record<never, never> (not Record<string, never>) so `keyof Views` is
    // truly empty — a string-keyed index signature would make every table
    // name also match as a view name (whose Row type is `never`), which
    // silently poisons downstream generic inference (e.g. `.update()`).
    Views: Record<never, never>;
    Functions: Record<never, never>;
  };
}
