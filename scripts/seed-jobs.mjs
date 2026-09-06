// Local/admin data seed for the Whitecarrot demo tenant. Not imported by the
// app. Uses SUPABASE_SECRET_KEY (server-only, bypasses RLS) — never expose
// this key to the browser.
//
// Usage: npm run seed:jobs
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";

process.loadEnvFile(".env.local");

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SECRET_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local."
  );
  process.exit(1);
}

// Admin client for this trusted local seed operation only. Bypasses RLS —
// never reused for request-scoped or browser code.
const supabaseAdmin = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CSV_PATH = "data/jobs.csv";
const REQUIRED_HEADERS = [
  "title",
  "work_policy",
  "location",
  "department",
  "employment_type",
  "experience_level",
  "job_type",
  "salary_range",
  "job_slug",
  "posted_days_ago",
];
const BATCH_SIZE = 100;

const DEMO_COMPANY = {
  name: "Acme Careers",
  slug: "acme",
  theme: {
    primaryColor: "#2563eb",
    secondaryColor: "#0f172a",
    logoUrl: null,
    bannerUrl: null,
  },
  page_blocks: [],
};

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function readCsvRows() {
  const raw = readFileSync(CSV_PATH, "utf8");
  return parse(raw, { columns: true, skip_empty_lines: true, bom: true });
}

function validateHeaders(records) {
  if (records.length === 0) {
    console.error(`${CSV_PATH} has no data rows.`);
    process.exit(1);
  }
  const headers = Object.keys(records[0]);
  const missing = REQUIRED_HEADERS.filter((h) => !headers.includes(h));
  if (missing.length > 0) {
    console.error(
      `${CSV_PATH} is missing required headers: ${missing.join(", ")}`
    );
    process.exit(1);
  }
}

function trimOuter(value) {
  return typeof value === "string" ? value.trim() : value;
}

function validateAndNormalize(records) {
  const accepted = [];
  const rejected = [];

  records.forEach((record, index) => {
    const rowNumber = index + 2; // account for header row, 1-indexed
    const row = {};
    for (const header of REQUIRED_HEADERS) {
      row[header] = trimOuter(record[header] ?? "");
    }

    if (!row.title) {
      rejected.push({ row: rowNumber, reason: "missing title" });
      return;
    }
    if (!row.job_slug) {
      rejected.push({ row: rowNumber, reason: "missing job_slug" });
      return;
    }

    accepted.push({
      title: row.title,
      work_policy: row.work_policy || null,
      location: row.location || null,
      department: row.department || null,
      employment_type: row.employment_type || null,
      experience_level: row.experience_level || null,
      job_type: row.job_type || null,
      salary_range: row.salary_range || null,
      job_slug: row.job_slug || null,
      posted_days_ago: row.posted_days_ago || null,
      is_active: true,
    });
  });

  return { accepted, rejected };
}

async function findOrCreateCompany() {
  const { data: existing, error: findError } = await supabaseAdmin
    .from("companies")
    .select("id, name, slug, published_at")
    .eq("slug", DEMO_COMPANY.slug)
    .maybeSingle();

  if (findError) {
    throw new Error(`Company lookup failed: ${findError.message}`);
  }

  if (existing) {
    if (!existing.published_at) {
      const { data: patched, error: patchError } = await supabaseAdmin
        .from("companies")
        .update({ published_at: new Date().toISOString() })
        .eq("id", existing.id)
        .select("id, name, slug, published_at")
        .single();
      if (patchError) {
        throw new Error(`Failed to publish existing company: ${patchError.message}`);
      }
      return { company: patched, created: false };
    }
    return { company: existing, created: false };
  }

  const { data: created, error: createError } = await supabaseAdmin
    .from("companies")
    .insert({ ...DEMO_COMPANY, published_at: new Date().toISOString() })
    .select("id, name, slug, published_at")
    .single();

  if (createError) {
    throw new Error(`Failed to create demo company: ${createError.message}`);
  }

  return { company: created, created: true };
}

async function deleteExistingJobs(companyId) {
  const { error, count } = await supabaseAdmin
    .from("jobs")
    .delete({ count: "exact" })
    .eq("company_id", companyId);

  if (error) {
    throw new Error(`Failed to delete existing Acme jobs: ${error.message}`);
  }
  return count ?? 0;
}

async function insertJobs(rows, companyId) {
  const withCompany = rows.map((row) => ({ ...row, company_id: companyId }));
  const batches = chunk(withCompany, BATCH_SIZE);
  let inserted = 0;

  for (let i = 0; i < batches.length; i++) {
    const { data, error } = await supabaseAdmin
      .from("jobs")
      .insert(batches[i])
      .select("id");

    if (error) {
      throw new Error(
        `Insert batch ${i + 1}/${batches.length} failed (rows ${
          inserted + 1
        }-${inserted + batches[i].length}): ${error.message}. ` +
          `${inserted} row(s) from earlier batches were already committed — re-run the seed to retry.`
      );
    }

    inserted += data.length;
  }

  return inserted;
}

async function verifyFinalData(companyId, expectedCount) {
  const { data, error, count } = await supabaseAdmin
    .from("jobs")
    .select("id, title, location, work_policy, employment_type, job_type, salary_range, company_id, is_active", {
      count: "exact",
    })
    .eq("company_id", companyId);

  if (error) {
    throw new Error(`Post-insert verification query failed: ${error.message}`);
  }

  const nullCompanyId = data.filter((j) => !j.company_id).length;
  const inactive = data.filter((j) => !j.is_active).length;

  return {
    finalCount: count ?? data.length,
    matchesExpected: (count ?? data.length) === expectedCount,
    nullCompanyId,
    inactive,
    samples: data.slice(0, 3),
  };
}

async function main() {
  console.log("Reading data/jobs.csv...");
  const records = readCsvRows();
  console.log(`CSV rows detected: ${records.length}`);

  validateHeaders(records);

  const { accepted, rejected } = validateAndNormalize(records);
  console.log(`Rows accepted: ${accepted.length}`);
  console.log(`Rows rejected: ${rejected.length}`);
  if (rejected.length > 0) {
    for (const r of rejected) {
      console.log(`  - row ${r.row}: ${r.reason}`);
    }
  }

  console.log("Finding or creating demo company (slug=acme)...");
  const { company, created } = await findOrCreateCompany();
  console.log(
    `Demo company: id=${company.id} slug=${company.slug} (${
      created ? "created" : "found existing"
    })`
  );

  console.log("Deleting previous Acme jobs...");
  const deletedCount = await deleteExistingJobs(company.id);
  console.log(`Previous Acme jobs deleted: ${deletedCount}`);

  console.log(`Inserting ${accepted.length} job(s) in batches of ${BATCH_SIZE}...`);
  const insertedCount = await insertJobs(accepted, company.id);
  console.log(`Jobs inserted: ${insertedCount}`);

  console.log("Verifying final data...");
  const verification = await verifyFinalData(company.id, accepted.length);

  console.log("\n=== Seed summary ===");
  console.log(`Company: ${company.name} (${company.slug}) — id ${company.id}`);
  console.log(`Published at: ${company.published_at}`);
  console.log(`Final job count: ${verification.finalCount}`);
  console.log(
    `Matches accepted CSV row count (${accepted.length}): ${verification.matchesExpected}`
  );
  console.log(`Jobs with null company_id: ${verification.nullCompanyId}`);
  console.log(`Jobs with is_active = false: ${verification.inactive}`);
  console.log("\nSample jobs:");
  for (const job of verification.samples) {
    console.log(
      `  - ${job.title} | ${job.location} | ${job.work_policy} | ${job.employment_type} | ${job.job_type} | ${job.salary_range}`
    );
  }

  if (!verification.matchesExpected || verification.nullCompanyId > 0 || verification.inactive > 0) {
    console.error("\nVerification found a mismatch — see counts above.");
    process.exit(1);
  }

  console.log("\nSeed completed successfully.");
}

main().catch((error) => {
  console.error("\nSeed failed:", error.message);
  process.exit(1);
});
