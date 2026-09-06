// One-off connectivity check. Not imported by the app.
// Usage: node --env-file=.env.local scripts/check-supabase-connection.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.\n" +
      "Set them in .env.local, then re-run with:\n" +
      "  node --env-file=.env.local scripts/check-supabase-connection.mjs"
  );
  process.exit(1);
}

const supabase = createClient(url, key);

const { error, count } = await supabase
  .from("companies")
  .select("id", { count: "exact", head: true });

if (error) {
  console.error("Supabase connection check failed:", error.message);
  console.error(
    "If the error mentions a missing table, the migration in " +
      "supabase/migrations/001_initial_schema.sql has not been run yet."
  );
  process.exit(1);
}

console.log(
  `Connected to Supabase. "companies" table is reachable (${count ?? 0} row(s)).`
);
