export type ExampleId = "basic" | "batch" | "format" | "guess" | "react" | "nextjs" | "node" | "ts";

export type Example = {
  id: ExampleId;
  label: string;
  code: string;
};

export const EXAMPLES: readonly Example[] = [
  {
    id: "basic",
    label: "Basic",
    code: `import { validatePostalCode } from "postal-code-checker";

// Alpha-2 codes
validatePostalCode("US", "95014");      // → true
validatePostalCode("GB", "SW1A 1AA");    // → true
validatePostalCode("JP", "100-0001");    // → true

// Alpha-3 codes work too
validatePostalCode("USA", "95014");     // → true

// Case-insensitive, whitespace-tolerant
validatePostalCode("CA", "k1a 0t6");     // → true
validatePostalCode("CA", "  K1A0T6  ");   // → true`,
  },
  {
    id: "batch",
    label: "Batch",
    code: `import { validatePostalCodes } from "postal-code-checker";

// Validate many codes against one country
const results = validatePostalCodes("US", [
  "95014",
  "90210",
  "abc",
  "10001",
]);
// → [true, true, false, true]

// Index-aligned with the input — useful for CSV imports
const cleanRows = rows.filter((_, i) => results[i]);`,
  },
  {
    id: "format",
    label: "Format",
    code: `import { format } from "postal-code-checker";

// Canonicalize before writing to the database
format("US", "  12345 ");    // → "12345"
format("CA", "k1a 0t6");     // → "K1A 0T6"
format("GB", "sw1a 1aa");    // → "SW1A 1AA"

// Returns null when the code isn't valid for that country
format("US", "ABC12");        // → null
format("AE", "1234");         // → null (no postal system)

// Shorthand pattern: validate + normalize in one step
const canonical = format(country, userInput);
if (canonical) await db.save({ postalCode: canonical });`,
  },
  {
    id: "guess",
    label: "Guess",
    code: `import { guessCountries } from "postal-code-checker";

// Country-less input — who could this belong to?
guessCountries("K1A 0T6");
// → [{ countryName: "Canada", countryCode: "CA" }]

guessCountries("SW1A 1AA");
// → [{ countryName: "United Kingdom", countryCode: "GB" }]

// Generic formats match many countries
guessCountries("12345");
// → [
//     { countryName: "Algeria", countryCode: "DZ" },
//     { countryName: "Croatia", countryCode: "HR" },
//     { countryName: "France", countryCode: "FR" },
//     { countryName: "Germany", countryCode: "DE" },
//     { countryName: "United States of America", countryCode: "US" },
//     ... more
//   ]

// Sorted alphabetically, ready to render as a picker`,
  },
  {
    id: "react",
    label: "React",
    code: `import { useState } from "react";
import { validatePostalCode } from "postal-code-checker";

export function AddressForm() {
  const [country, setCountry] = useState("US");
  const [zip, setZip] = useState("");
  const isValid = zip && validatePostalCode(country, zip);

  return (
    <form>
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option>US</option>
        <option>GB</option>
        <option>JP</option>
      </select>
      <input value={zip} onChange={(e) => setZip(e.target.value)} />
      {zip && <span>{isValid ? "valid" : "invalid"}</span>}
    </form>
  );
}`,
  },
  {
    id: "nextjs",
    label: "Next.js",
    code: `// app/api/validate-address/route.ts
import { validatePostalCode } from "postal-code-checker";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { country, postalCode } = await req.json();

  if (!validatePostalCode(country, postalCode)) {
    return NextResponse.json(
      { error: "invalid postal code" },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}`,
  },
  {
    id: "node",
    label: "Node.js",
    code: `// Works in Node.js, Deno, Bun — ESM or CJS
const { validatePostalCodes } = require("postal-code-checker");
const fs = require("node:fs");

// Clean a CSV of customer addresses
const codes = fs.readFileSync("zips.csv", "utf8")
  .split("\\n")
  .filter(Boolean);

const results = validatePostalCodes("US", codes);
const invalid = codes.filter((_, i) => !results[i]);

console.log(\`\${invalid.length} invalid codes found\`);`,
  },
  {
    id: "ts",
    label: "TypeScript",
    code: `import {
  validatePostalCode,
  getCountryByCode,
  type Country,
  type CountryCode,
} from "postal-code-checker";

// Full country record — patterns, examples, name
const country: Country | null = getCountryByCode("GB");

if (country) {
  console.log(country.countryName);         // "United Kingdom"
  console.log(country.postalCodePatterns); // ["/^(?:GIR 0AA|...)$/"]
  console.log(country.examplePostalCodes); // ["SW1A 1AA", ...]
}

// CountryCode accepts both alpha-2 and alpha-3
const code: CountryCode = "GBR";
validatePostalCode(code, "SW1A 1AA"); // → true`,
  },
] as const;

export type PackageManager = "npm" | "yarn" | "pnpm" | "bun";

export const INSTALL_COMMANDS: Record<PackageManager, string> = {
  npm: `# 2.1.0 — latest
npm install postal-code-checker`,
  yarn: `# 2.1.0 — latest
yarn add postal-code-checker`,
  pnpm: `# 2.1.0 — latest
pnpm add postal-code-checker`,
  bun: `# 2.1.0 — latest
bun add postal-code-checker`,
};

export const PACKAGE_MANAGERS: readonly PackageManager[] = ["npm", "yarn", "pnpm", "bun"] as const;
