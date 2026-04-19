export type ExampleId = "basic" | "batch" | "react" | "nextjs" | "node" | "ts";

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
  npm: `# Stable (recommended)
npm install postal-code-checker

# Opt into the v2 alpha
npm install postal-code-checker@next`,
  yarn: `# Stable (recommended)
yarn add postal-code-checker

# Opt into the v2 alpha
yarn add postal-code-checker@next`,
  pnpm: `# Stable (recommended)
pnpm add postal-code-checker

# Opt into the v2 alpha
pnpm add postal-code-checker@next`,
  bun: `# Stable (recommended)
bun add postal-code-checker

# Opt into the v2 alpha
bun add postal-code-checker@next`,
};

export const PACKAGE_MANAGERS: readonly PackageManager[] = [
  "npm",
  "yarn",
  "pnpm",
  "bun",
] as const;
