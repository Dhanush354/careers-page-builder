/**
 * Runs the latest migration (003_grapesjs_canvas.sql) against the hosted
 * Supabase project using the Supabase Management API.
 *
 * Usage: node supabase/run-migration.mjs
 *
 * Requires SUPABASE_ACCESS_TOKEN in the environment (personal access token
 * from https://app.supabase.com/account/tokens), OR falls back to trying
 * the service-role key with the project REST API.
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceKey  = process.env.SUPABASE_SECRET_KEY ?? "";
const accessToken = process.env.SUPABASE_ACCESS_TOKEN ?? "";

if (!supabaseUrl) {
  console.error("❌  NEXT_PUBLIC_SUPABASE_URL is not set");
  process.exit(1);
}

// ── SQL to run ───────────────────────────────────────────────────────────────
const migrationSQL = fs.readFileSync(
  path.join(__dirname, "migrations", "003_grapesjs_canvas.sql"),
  "utf8"
);

// ── Attempt 1: Management API (needs personal access token) ──────────────────
function post(hostname, path, headers, body) {
  return new Promise((resolve, reject) => {
    const buf = Buffer.from(body);
    const req = https.request(
      { hostname, path, method: "POST", headers: { ...headers, "Content-Length": buf.byteLength } },
      (res) => {
        let data = "";
        res.on("data", (d) => (data += d));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      }
    );
    req.on("error", reject);
    req.write(buf);
    req.end();
  });
}

const projectRef = new URL(supabaseUrl).hostname.split(".")[0];

async function tryManagementApi() {
  if (!accessToken) return null;
  console.log("🔑  Trying Supabase Management API…");
  return post(
    "api.supabase.com",
    `/v1/projects/${projectRef}/database/query`,
    {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    JSON.stringify({ query: migrationSQL })
  );
}

// ── Attempt 2: project REST API via service-role key ─────────────────────────
// Supabase has a built-in `pg_query` RPC in some plans; try it.
async function tryServiceRole() {
  if (!serviceKey) return null;
  console.log("🔑  Trying project REST API with service-role key…");
  const host = new URL(supabaseUrl).hostname;
  return post(
    host,
    "/rest/v1/rpc/pg_query",
    {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    JSON.stringify({ query: migrationSQL })
  );
}

// ── Run ───────────────────────────────────────────────────────────────────────
(async () => {
  let result = await tryManagementApi();
  if (!result) result = await tryServiceRole();

  if (!result) {
    console.error(
      "❌  No valid credentials found.\n" +
      "   Set SUPABASE_ACCESS_TOKEN (personal access token from\n" +
      "   https://app.supabase.com/account/tokens) and re-run."
    );
    process.exit(1);
  }

  console.log("Status:", result.status);
  try {
    console.log("Response:", JSON.stringify(JSON.parse(result.body), null, 2));
  } catch {
    console.log("Response:", result.body);
  }

  if (result.status >= 200 && result.status < 300) {
    console.log("✅  Migration 003_grapesjs_canvas applied successfully.");
  } else {
    console.error("❌  Migration failed — see response above.");
    process.exit(1);
  }
})();
