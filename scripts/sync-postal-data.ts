/**
 * scripts/sync-postal-data.ts
 *
 * Regenerates src/assets/index.ts from Google's libaddressinput aggregate
 * endpoint. Runs on the maintainer's machine only — never at runtime.
 *
 * Usage:
 *   npm run sync:data              # fetch + write
 *   npm run sync:data -- --check   # fetch + compare, exit 1 if drifted
 *
 * Exit codes:
 *   0  all good (or --check: in sync)
 *   1  any per-country fetch failed (distinct from SKIP), OR --check drift
 *
 * See docs/V2_PLAN.md for the data-shape contract this script emits.
 */

import * as fs from "fs";
import * as path from "path";

import { ALPHA3_TO_ALPHA2 } from "../src/assets/alpha3Map";

// --- constants -------------------------------------------------------------

const ENDPOINT = (cc: string) =>
  `https://chromium-i18n.appspot.com/ssl-aggregate-address/data/${cc}`;

const OUT_PATH = path.resolve(__dirname, "../src/assets/index.ts");

const ANCHORED = (raw: string) => `/^(?:${raw})$/`;

const MAX_RETRIES = 3;
const RETRY_BACKOFF_MS = (attempt: number) => 500 * 2 ** attempt; // 500, 1000, 2000

// Master alpha-2 list: union of every alpha-2 that any ISO 3166-1 alpha-3
// resolves to, sorted. Stable across the v1 → v2 data-shape swap because it
// doesn't read from COUNTRIES.
const MASTER_ALPHA2: string[] = Array.from(
  new Set(Object.values(ALPHA3_TO_ALPHA2))
).sort();

// --- types -----------------------------------------------------------------

type Status = "ok" | "skip" | "fail";

type SyncResult = {
  code: string;
  status: Status;
  patterns: string[];
  example: string[];
  isGenericRegex: boolean;
  country: string;
  reason?: string;
};

type UpstreamCountry = {
  id?: string;
  name?: string;
  zip?: string;
  zipex?: string;
};

// --- helpers ---------------------------------------------------------------

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

function titleCase(s: string): string {
  return s
    .toLowerCase()
    .split(/(\s+|-|')/)
    .map((seg) => (/^[a-z]/.test(seg) ? seg.charAt(0).toUpperCase() + seg.slice(1) : seg))
    .join("");
}

function parseZipex(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function fetchJson(url: string, cc: string): Promise<UpstreamCountry | null> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as Record<string, UpstreamCountry>;
      // Upstream wraps the country record under a `data/<CC>` key.
      const wrapped = body[`data/${cc}`];
      if (!wrapped) {
        throw new Error(`response missing data/${cc} key`);
      }
      return wrapped;
    } catch (err) {
      lastErr = err;
      if (attempt < MAX_RETRIES - 1) await sleep(RETRY_BACKOFF_MS(attempt));
    }
  }
  throw lastErr;
}

async function fetchOne(cc: string): Promise<SyncResult> {
  let upstream: UpstreamCountry | null;
  try {
    upstream = await fetchJson(ENDPOINT(cc), cc);
  } catch (err) {
    return {
      code: cc,
      status: "fail",
      patterns: [],
      example: [],
      isGenericRegex: true,
      country: cc,
      reason: err instanceof Error ? err.message : String(err),
    };
  }

  if (upstream === null) {
    return {
      code: cc,
      status: "fail",
      patterns: [],
      example: [],
      isGenericRegex: true,
      country: cc,
      reason: "HTTP 404",
    };
  }

  const name = upstream.name ? titleCase(upstream.name) : cc;
  const example = parseZipex(upstream.zipex);

  if (!upstream.zip) {
    // Country has no postal-code system (e.g. UAE). Emit empty patterns.
    return {
      code: cc,
      status: "skip",
      patterns: [],
      example,
      isGenericRegex: false,
      country: name,
      reason: "no zip field",
    };
  }

  return {
    code: cc,
    status: "ok",
    patterns: [ANCHORED(upstream.zip)],
    example,
    isGenericRegex: false,
    country: name,
  };
}

// Emit arrays in the same shape prettier produces: `["a", "b"]` with a space
// after each comma. `JSON.stringify` would give `["a","b"]`, which prettier
// would then rewrite on next format — making sync:check falsely report drift.
function stringifyArray(arr: string[]): string {
  return `[${arr.map((s) => JSON.stringify(s)).join(", ")}]`;
}

function serializeEntry(r: SyncResult): string {
  const patternsJson = stringifyArray(r.patterns);
  const exampleJson = stringifyArray(r.example);
  const countryJson = JSON.stringify(r.country);
  return `  ${r.code}: { patterns: ${patternsJson}, example: ${exampleJson}, isGenericRegex: ${r.isGenericRegex}, country: ${countryJson} },`;
}

function serialize(results: SyncResult[], snapshotDate: string): string {
  const body = results
    .filter((r) => r.status !== "fail")
    .sort((a, b) => a.code.localeCompare(b.code))
    .map(serializeEntry)
    .join("\n");

  return `// AUTO-GENERATED by scripts/sync-postal-data.ts. Do not edit by hand.
// Source: https://chromium-i18n.appspot.com/ssl-aggregate-address/data/<CC>
// Snapshot date: ${snapshotDate}
// Data license: CC-BY 4.0 (see NOTICE)

import { PostalCodeData } from "../types/PostalCodeData";

export const COUNTRIES: PostalCodeData = {
${body}
};
`;
}

// --- main ------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isCheck = args.includes("--check");

  const results: SyncResult[] = [];
  for (const cc of MASTER_ALPHA2) {
    const res = await fetchOne(cc);
    results.push(res);
    const tail = res.reason ? ` (${res.reason})` : "";
    const label = res.status.toUpperCase().padEnd(4);
     
    console.log(`${label} ${cc}${tail}`);
  }

  const ok = results.filter((r) => r.status === "ok").length;
  const skip = results.filter((r) => r.status === "skip").length;
  const fail = results.filter((r) => r.status === "fail").length;

   
  console.log(
    `\n${ok} succeeded, ${skip} skipped (no postal-code system), ${fail} failed`
  );

  if (fail > 0) {
    process.exit(1);
  }

  const snapshotDate = new Date().toISOString().slice(0, 10);
  const serialized = serialize(results, snapshotDate);

  if (isCheck) {
    const current = fs.existsSync(OUT_PATH) ? fs.readFileSync(OUT_PATH, "utf8") : "";
    // Strip the snapshot-date line on both sides — the date changes on every
    // run, but the actual data is what we want to compare.
    const stripDate = (s: string) => s.replace(/^\/\/ Snapshot date:.*$/m, "");
    if (stripDate(current) !== stripDate(serialized)) {
       
      console.error(
        "\nERROR: src/assets/index.ts is out of sync with upstream. Run `npm run sync:data` and commit the result."
      );
      process.exit(1);
    }
     
    console.log("\nOK: src/assets/index.ts is in sync with upstream.");
  } else {
    fs.writeFileSync(OUT_PATH, serialized);
     
    console.log(`\nWrote ${OUT_PATH}`);
  }
}

main().catch((err) => {
   
  console.error(err);
  process.exit(1);
});
