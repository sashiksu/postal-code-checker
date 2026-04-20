import { ExamplePlayground } from "./ExamplePlayground";
import styles from "./LiveEditor.module.scss";

type Example = {
  id: string;
  title: string;
  description: string;
  code: string;
};

const EXAMPLES: Example[] = [
  {
    id: "validate",
    title: "Validate a single postal code",
    description: "validatePostalCode(countryCode, postalCode) → boolean",
    code: `// Case and surrounding spaces are tolerated.
const ok = validatePostalCode("CA", "k1a 0t6");
console.log(ok);

// Unknown format → false
console.log(validatePostalCode("US", "NOPE"));
`,
  },
  {
    id: "batch",
    title: "Batch validation",
    description: "validatePostalCodes(countryCode, codes[]) — results align with input order",
    code: `const codes = ["K1A 0T6", "90210", "BAD", "H0H 0H0"];
const results = validatePostalCodes("CA", codes);

codes.forEach((code, i) => {
  console.log(code.padEnd(10), "→", results[i] ? "valid" : "invalid");
});
`,
  },
  {
    id: "country-lookup",
    title: "Country lookup — alpha-2 and alpha-3",
    description: "getCountryByCode accepts both ISO forms and returns the same record",
    code: `const byAlpha2 = getCountryByCode("DE");
const byAlpha3 = getCountryByCode("DEU");

console.log(byAlpha2?.countryName);
console.log(byAlpha3?.countryName);

// Patterns + example codes ship inside the record
console.log("patterns:", byAlpha2?.postalCodePatterns);
console.log("examples:", byAlpha2?.examplePostalCodes);
`,
  },
  {
    id: "case-whitespace",
    title: "Case and whitespace tolerance",
    description: "Input is trimmed and uppercased before matching",
    code: `// Lowercase + extra spaces — still valid
console.log(validatePostalCode("GB", "sw1a 1aa"));
console.log(validatePostalCode("GB", "  SW1A 1AA  "));

// Missing space between forward-sort areas — also accepted
console.log(validatePostalCode("CA", "k1a0t6"));
`,
  },
  {
    id: "list-all",
    title: "List every supported country",
    description: "getAllCountries() → { countryName, countryCode }[]",
    code: `const all = getAllCountries();

console.log("Total supported:", all.length);

// Peek at the first five, alphabetical by name
all.slice(0, 5).forEach(c => {
  console.log(" ", c.countryCode, "—", c.countryName);
});
`,
  },
];

export function LiveEditor() {
  return (
    <div className={styles.stack}>
      {EXAMPLES.map((ex) => (
        <ExamplePlayground
          key={ex.id}
          title={ex.title}
          description={ex.description}
          initialCode={ex.code}
        />
      ))}
    </div>
  );
}
