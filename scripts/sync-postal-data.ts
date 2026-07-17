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
import { SubdivisionEntry } from "../src/types/SubdivisionData";

// --- constants -------------------------------------------------------------

const ENDPOINT = (cc: string) =>
  `https://chromium-i18n.appspot.com/ssl-aggregate-address/data/${cc}`;

const OUT_PATH = path.resolve(__dirname, "../src/assets/index.ts");
const SUBDIVISIONS_OUT_PATH = path.resolve(__dirname, "../src/assets/subdivisions.ts");
const LABELS_OUT_PATH = path.resolve(__dirname, "../src/assets/postalLabels.ts");

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
  subdivisions: SubdivisionEntry[];
  postalLabel: string | null;
  reason?: string;
};

type UpstreamCountry = {
  id?: string;
  name?: string;
  zip?: string;
  zipex?: string;
  sub_keys?: string;
  sub_names?: string;
  sub_lnames?: string;
  sub_isoids?: string;
  sub_zips?: string;
  zip_name_type?: string;
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

const splitTilde = (s: string | undefined): string[] => (s ? s.split("~") : []);

/**
 * Extracts subdivision records from one upstream country payload.
 *
 * Field precedence matters:
 * - code: `sub_isoids` is the stable ISO 3166-2 code. `sub_keys` is only a
 *   local display convention (US→"CA", IN→"Delhi", JP→"東京都"), so it is a
 *   fallback — needed because the US ships blank isoids for American Samoa,
 *   Guam and the Armed Forces entries.
 * - name: `sub_lnames` is Latin (JP→"Tokyo"); `sub_names` is the localized
 *   name (IN/CA have it, JP does not). Prefer Latin, then localized, then key.
 *
 * Entries with no `sub_zips` slot are dropped: no prefix, no inference.
 */
function extractSubdivisions(u: UpstreamCountry): SubdivisionEntry[] {
  const keys = splitTilde(u.sub_keys);
  const isoids = splitTilde(u.sub_isoids);
  const lnames = splitTilde(u.sub_lnames);
  const names = splitTilde(u.sub_names);
  const zips = splitTilde(u.sub_zips);
  if (keys.length === 0 || zips.length === 0) return [];

  return keys
    .map((key, i) => ({
      code: isoids[i] || key,
      name: lnames[i] || names[i] || key,
      pattern: zips[i] || "",
    }))
    .filter((s) => s.pattern !== "")
    .sort((a, b) => a.code.localeCompare(b.code));
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
      subdivisions: [],
      postalLabel: null,
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
      subdivisions: [],
      postalLabel: null,
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
      subdivisions: [],
      postalLabel: null,
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
    subdivisions: extractSubdivisions(upstream),
    postalLabel: upstream.zip_name_type ?? null,
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

function serializeSubdivisions(results: SyncResult[], snapshotDate: string): string {
  const body = results
    .filter((r) => r.subdivisions.length > 0)
    .sort((a, b) => a.code.localeCompare(b.code))
    .map((r) => {
      const entries = r.subdivisions
        .map(
          (s) =>
            `    { code: ${JSON.stringify(s.code)}, name: ${JSON.stringify(s.name)}, pattern: ${JSON.stringify(s.pattern)} },`
        )
        .join("\n");
      return `  ${r.code}: [\n${entries}\n  ],`;
    })
    .join("\n");

  return `// AUTO-GENERATED by scripts/sync-postal-data.ts. Do not edit by hand.
// Source: https://chromium-i18n.appspot.com/ssl-aggregate-address/data/<CC>
// Snapshot date: ${snapshotDate}
// Data license: CC-BY 4.0 (see NOTICE)
//
// Subdivision postal prefixes. \`pattern\` is UNANCHORED on purpose: these are
// leading-digit prefixes, matched as \`^(?:pattern)\` with no trailing \`$\`.
// Anchoring the end matches nothing. Only countries upstream publishes
// sub_zips for appear here — most do not.
//
// This module must only ever be imported by the subdivision utilities. If it
// is reached from activeData/getCountryByCode/validatePostalCode, every
// consumer pays ~11.6KB gz for data they do not use.

import { SubdivisionData } from "../types/SubdivisionData";

export const SUBDIVISIONS: SubdivisionData = {
${body}
};
`;
}

function serializePostalLabels(results: SyncResult[], snapshotDate: string): string {
  const body = results
    .filter((r) => r.postalLabel !== null)
    .sort((a, b) => a.code.localeCompare(b.code))
    .map((r) => `  ${r.code}: ${JSON.stringify(r.postalLabel)},`)
    .join("\n");

  return `// AUTO-GENERATED by scripts/sync-postal-data.ts. Do not edit by hand.
// Source: https://chromium-i18n.appspot.com/ssl-aggregate-address/data/<CC>
// Snapshot date: ${snapshotDate}
// Data license: CC-BY 4.0 (see NOTICE)
//
// Upstream \`zip_name_type\`. Sparse by design: it is present only where the
// label differs from the default. Absent country => DEFAULT_POSTAL_LABEL.

export const DEFAULT_POSTAL_LABEL = "postal code";

export const POSTAL_LABELS: Record<string, string> = {
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
    const subs = res.subdivisions.length ? ` (${res.subdivisions.length} subdivisions)` : "";
    const label = res.status.toUpperCase().padEnd(4);

    console.log(`${label} ${cc}${tail}${subs}`);
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

  // Every generated asset is checked/written the same way. Keeping them in one
  // list means the drift gate can never silently cover only a subset — a
  // stale subdivision asset must block a release exactly as a stale country
  // asset does.
  const outputs: { path: string; content: string }[] = [
    { path: OUT_PATH, content: serialize(results, snapshotDate) },
    { path: SUBDIVISIONS_OUT_PATH, content: serializeSubdivisions(results, snapshotDate) },
    { path: LABELS_OUT_PATH, content: serializePostalLabels(results, snapshotDate) },
  ];

  // The snapshot-date line changes on every run; compare the data, not the date.
  const stripDate = (s: string) => s.replace(/^\/\/ Snapshot date:.*$/m, "");

  if (isCheck) {
    let drifted = false;
    for (const { path: outPath, content } of outputs) {
      const current = fs.existsSync(outPath) ? fs.readFileSync(outPath, "utf8") : "";
      if (stripDate(current) !== stripDate(content)) {
        console.error(
          `\nERROR: ${path.relative(path.resolve(__dirname, ".."), outPath)} is out of sync with upstream. Run \`npm run sync:data\` and commit the result.`
        );
        drifted = true;
      }
    }
    if (drifted) process.exit(1);

    console.log("\nOK: generated assets are in sync with upstream.");
  } else {
    for (const { path: outPath, content } of outputs) {
      fs.writeFileSync(outPath, content);
      console.log(`\nWrote ${outPath}`);
    }
  }
}

main().catch((err) => {
   
  console.error(err);
  process.exit(1);
});
