import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { Company } from "@/types/company";
import type { Profile } from "@/types/profile";

// Authorization chain, always server-verified — never trust a slug/company
// id supplied by the client:
//   Supabase authenticated user -> profiles.id -> profiles.company_id -> companies.id

export type CurrentRecruiter =
  | { status: "unauthenticated" }
  | { status: "no-profile"; user: User }
  | { status: "no-company"; user: User; profile: Profile }
  | { status: "company-load-error"; user: User; profile: Profile }
  | { status: "ready"; user: User; profile: Profile; company: Company };

export async function getCurrentRecruiter(): Promise<CurrentRecruiter> {
  const supabase = await createClient();

  // getUser() re-validates the session against Supabase Auth rather than
  // just trusting the cookie payload — required for an authorization check.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "unauthenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle()
    .overrideTypes<Profile, { merge: false }>();

  if (profileError || !profile) {
    return { status: "no-profile", user };
  }

  if (!profile.company_id) {
    return { status: "no-company", user, profile };
  }

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", profile.company_id)
    .maybeSingle()
    .overrideTypes<Company, { merge: false }>();

  if (companyError || !company) {
    return { status: "company-load-error", user, profile };
  }

  return { status: "ready", user, profile, company };
}
