import { SectionHeading } from "./ui/SectionHeading";
import { CodeBlock } from "./ui/CodeBlock";
import styles from "./UseCases.module.scss";

type UseCase = {
  title: string;
  description: string;
  tag: string;
  code: string;
};

const USE_CASES: UseCase[] = [
  {
    title: "Ecommerce checkout validation",
    description:
      "Catch bad postal codes before you fire an address-lookup request. Cheaper than round-tripping every typo to your API.",
    tag: "checkout",
    code: `import { validatePostalCode } from "postal-code-checker";

function onZipBlur(country, zip) {
  if (!validatePostalCode(country, zip)) {
    return "Please check your postal code.";
  }
  // safe to POST to /address-lookup
}`,
  },
  {
    title: "React Hook Form validator",
    description:
      "Drop into any RHF setup as a custom validate function. Works the same in Formik, VeeValidate, or your own form state.",
    tag: "form",
    code: `import { validatePostalCode } from "postal-code-checker";

<input
  {...register("postal", {
    validate: (value, form) =>
      validatePostalCode(form.country, value)
        || "Invalid postal code",
  })}
/>`,
  },
  {
    title: "CSV / bulk import sanity check",
    description:
      "validatePostalCodes batches against one country. Index-aligned output zips cleanly back to your input rows.",
    tag: "batch",
    code: `import { validatePostalCodes } from "postal-code-checker";

const postals = rows.map(r => r.postal);
const results = validatePostalCodes("US", postals);

const bad = rows.filter((_, i) => !results[i]);
console.log(\`\${bad.length} rows need review\`);`,
  },
  {
    title: "Next.js server action",
    description:
      "Server-side validation on the same regex set the client uses. No duplicate logic, no API key.",
    tag: "next.js",
    code: `"use server";
import { validatePostalCode } from "postal-code-checker";

export async function submitAddress(data) {
  const country = String(data.get("country"));
  const postal  = String(data.get("postal"));
  if (!validatePostalCode(country, postal)) {
    return { error: "Invalid postal code" };
  }
}`,
  },
  {
    title: "Address autocomplete fallback",
    description:
      "When an external autocomplete is unavailable, use the bundled example codes as placeholders and the patterns as input hints.",
    tag: "fallback",
    code: `import { getCountryByCode } from "postal-code-checker";

const de = getCountryByCode("DE");
// de.examplePostalCodes → ["10115"]
// de.postalCodePatterns → anchored regex strings`,
  },
  {
    title: "Form-level country + postal pairing",
    description:
      "Alpha-2 and alpha-3 both work, so you can pass whichever form your country <select> emits without conversion.",
    tag: "any iso",
    code: `import { validatePostalCode } from "postal-code-checker";

validatePostalCode("GB",  "SW1A 1AA"); // true
validatePostalCode("GBR", "SW1A 1AA"); // true
validatePostalCode("usa", "90210");    // true — case-insensitive`,
  },
];

export function UseCases() {
  return (
    <section
      id="use-cases"
      className={styles.section}
      aria-labelledby="use-cases-heading"
    >
      <SectionHeading
        headingId="use-cases-heading"
        title="Use cases"
        subtitle="Five-line drop-ins for the places this package earns its keep."
      />
      <div className={styles.grid}>
        {USE_CASES.map((uc) => (
          <article key={uc.title} className={styles.card}>
            <div className={styles.cardHead}>
              <h3>{uc.title}</h3>
              <span className={styles.tag}>{uc.tag}</span>
            </div>
            <p className={styles.cardBody}>{uc.description}</p>
            <CodeBlock code={uc.code} ariaLabel={`${uc.title} snippet`} />
          </article>
        ))}
      </div>
    </section>
  );
}
