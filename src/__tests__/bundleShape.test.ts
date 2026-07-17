import * as fs from "fs";
import * as path from "path";

import { SUBDIVISIONS } from "../assets/subdivisions";

/**
 * The subdivision asset is ~11.6KB gzipped — nearly as large as the entire
 * rest of the bundle. It is kept out of the default path purely by the import
 * graph: nothing reachable from `validatePostalCode` may import
 * `assets/subdivisions`. A bundler tree-shakes it away only because that graph
 * stays clean, and one tidied import in `activeData` would silently charge
 * every consumer for data they never call.
 *
 * Rather than bundle with esbuild (a heavy devDependency on every CI job),
 * assert the invariant directly: statically walk the transitive imports of
 * each default-path module and prove `subdivisions` is unreachable. This is
 * exactly what a bundler relies on, it runs in milliseconds, and it names the
 * offending edge instead of just failing a byte count.
 */

const UTILS_DIR = path.resolve(__dirname, "../utils");

/** All relative import specifiers in a source file. */
function relativeImports(file: string): string[] {
  const src = fs.readFileSync(file, "utf8");
  const specs: string[] = [];
  const re = /(?:import|export)[^"']*from\s+["'](\.[^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) specs.push(m[1]);
  return specs;
}

/** Resolve a relative specifier from a file to an on-disk .ts path. */
function resolveSpec(fromFile: string, spec: string): string | null {
  const base = path.resolve(path.dirname(fromFile), spec);
  for (const candidate of [`${base}.ts`, path.join(base, "index.ts")]) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

/** Every .ts file transitively imported by `entry`, including itself. */
function transitiveImports(entry: string): Set<string> {
  const seen = new Set<string>();
  const stack = [entry];
  while (stack.length) {
    const file = stack.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const spec of relativeImports(file)) {
      const resolved = resolveSpec(file, spec);
      if (resolved) stack.push(resolved);
    }
  }
  return seen;
}

describe("bundle shape — subdivision data stays off the default path", () => {
  const subdivisionAsset = path.resolve(__dirname, "../assets/subdivisions.ts");

  // Everything a validate-only consumer's import can transitively reach.
  const defaultPathEntries = [
    "validatePostalCode.ts",
    "validatePostalCodes.ts",
    "getCountryByCode.ts",
    "getAllCountries.ts",
    "activeData.ts",
    "guessCountries.ts",
    "format.ts",
  ].map((f) => path.join(UTILS_DIR, f));

  it.each(defaultPathEntries.map((f) => [path.basename(f), f]))(
    "%s does not transitively import the subdivision asset",
    (_name, entry) => {
      expect(transitiveImports(entry).has(subdivisionAsset)).toBe(false);
    },
  );

  it("inferSubdivision does import the subdivision asset (sanity)", () => {
    const entry = path.join(UTILS_DIR, "subdivisions.ts");
    expect(transitiveImports(entry).has(subdivisionAsset)).toBe(true);
  });
});

describe("subdivision data integrity", () => {
  it("covers exactly the countries upstream publishes sub_zips for", () => {
    expect(Object.keys(SUBDIVISIONS).sort()).toEqual(
      "AD AM AR AU BR CA EG ES IN IT JP KR MX MY NI PH RU SV TH TR TW UA US UY".split(" "),
    );
  });

  it("has a non-empty, unanchored, compilable pattern for every entry", () => {
    for (const [cc, entries] of Object.entries(SUBDIVISIONS)) {
      expect(cc).toMatch(/^[A-Z]{2}$/);
      expect(entries.length).toBeGreaterThan(0);
      for (const s of entries) {
        expect(s.code).not.toBe("");
        expect(s.name).not.toBe("");
        expect(s.pattern).not.toBe("");
        // Prefixes must not be anchored — anchoring the end matches nothing.
        expect(s.pattern.startsWith("^")).toBe(false);
        expect(s.pattern.endsWith("$")).toBe(false);
        expect(() => new RegExp(`^(?:${s.pattern})`)).not.toThrow();
      }
    }
  });
});
