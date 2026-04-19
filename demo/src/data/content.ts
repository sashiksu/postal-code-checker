import type { ReactNode } from "react";

// -- What's new --------------------------------------------------------------
export type Feature = {
  icon: string;
  title: string;
  description: ReactNode;
};

export const WHATS_NEW: readonly Feature[] = [
  {
    icon: "fx",
    title: "format()",
    description:
      "Canonicalize any valid postal code — trim, uppercase, ready to store. Returns null when the code doesn't fit the country's pattern.",
  },
  {
    icon: "?",
    title: "guessCountries()",
    description:
      "Hand it a postal code with no context and get back every country whose pattern accepts it — sorted alphabetically, ready to render as a picker.",
  },
  {
    icon: "G",
    title: "Google libaddressinput",
    description:
      "Dataset swapped from the ECB list to Google's libaddressinput — the same source backing Chromium, Android and Google Pay address forms.",
  },
  {
    icon: "+13",
    title: "New territories covered",
    description:
      "Åland, Martinique, Réunion, Puerto Rico, Guadeloupe, French Polynesia and seven more — all with upstream-verified patterns.",
  },
  {
    icon: "[ ]",
    title: "patterns: string[]",
    description:
      "Countries with more than one valid format (UK + BFPO, etc.) now expose every pattern as an array. First-match wins in the validator.",
  },
  {
    icon: "↻",
    title: "Reproducible sync",
    description: "`npm run sync:data` regenerates the bundled dataset. Releases run `sync:check` so drift can't ship.",
  },
];

// -- FAQ ---------------------------------------------------------------------
export type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

export const FAQS: readonly FaqItem[] = [
  {
    id: "source",
    question: "Where does the postal code data come from?",
    answer:
      "Patterns, examples and country names are sourced from Google's libaddressinput — the same dataset backing Chromium's autofill, Android's address picker and Google Pay. It's Apache-2.0 licensed; attribution lives in NOTICE. We snapshot the dataset at release time rather than calling out to the network at runtime.",
  },
  {
    id: "empty",
    question: "Why do some countries show no postal codes?",
    answer:
      "A handful of countries genuinely have no postal code system — UAE, Zimbabwe, Ireland until 2015, and others. Their entry stores `patterns: []`, and validatePostalCode() returns false for any input against them. This is intentional: it matches the behavior for unknown countries and prevents false positives.",
  },
  {
    id: "freshness",
    question: "How up-to-date is the bundled data?",
    answer:
      "The snapshot date is stamped at the top of src/assets/index.ts on every sync. Maintainer runs `npm run sync:data` before each release; CI blocks publish on drift via `sync:check`. In practice the upstream data changes a few times a year — we pick the delta up on the next cut.",
  },
  {
    id: "custom",
    question: "Can I add custom country patterns?",
    answer:
      "Not yet — the dataset is read-only in 2.x. A `createValidator({ overrides })` API is on the v3 roadmap for internal / private codes. If you need it sooner, a thin wrapper around validatePostalCode() that checks your own patterns first works well today.",
  },
  {
    id: "geo",
    question: "Does this look up cities or do geolocation?",
    answer:
      "No. This library validates format only — it tells you whether a string could be a valid postal code for a country, not whether it actually resolves to a real address. Subdivision-level classification (postal code → state / region) is planned for v3 using Google's sub_zips prefix data.",
  },
  {
    id: "edge",
    question: "Does it work in React Server Components / edge runtimes?",
    answer:
      "Yes. The package has zero runtime dependencies and no Node-only APIs — just pure regex matching on static data. It runs in RSC, Next.js middleware, Cloudflare Workers, Deno Deploy, Vercel Edge and the browser without any shims.",
  },
];

// -- Roadmap -----------------------------------------------------------------
export type RoadmapItem = {
  milestone: string;
  title: string;
  description: string;
  snippet: string;
};

export const ROADMAP: readonly RoadmapItem[] = [
  {
    milestone: "v2.2",
    title: "parse()",
    description: "Break a structured code into its parts. UK outward/inward, Brazilian prefix/suffix, etc.",
    snippet: `parse("GB", "SW1A 1AA")
// → { outward: "SW1A", inward: "1AA",
//     area: "SW", district: "1A" }`,
  },
  {
    milestone: "v3",
    title: "Subdivision lookup",
    description: "Resolve a postal code to its state / province / region. Uses Google's sub_zips data.",
    snippet: `classify("US", "95014")
// → { subdivision: "CA" }`,
  },
  {
    milestone: "v3",
    title: "Custom overrides",
    description: "Merge your own patterns on top of the bundled dataset — for internal / private codes.",
    snippet: `createValidator({
  overrides: { X1: { patterns: [...] } }
})`,
  },
];

// -- Migration ---------------------------------------------------------------
export const MIGRATION_BEFORE = `const c = getCountryByCode("GB");

// single string, slash-wrapped
c.postalCodeRegex;
// → "/^(?:GIR 0AA|...)$/"

// usually needed RegExp parsing
new RegExp(c.postalCodeRegex.slice(1, -1));`;

export const MIGRATION_AFTER = `const c = getCountryByCode("GB");

// array — one entry per format
c.postalCodePatterns;
// → ["/^(?:GIR 0AA|...)$/"]

// empty [] = no postal system
if (c.postalCodePatterns.length) { ... }`;

export const MIGRATION_CHECKLIST: readonly string[] = [
  "Replace `c.postalCodeRegex` with `c.postalCodePatterns[0]` for single-pattern reads.",
  "If you iterate patterns, loop over the array instead of treating it as a string.",
  "Handle the empty-array case — it means the country has no postal code system (e.g. UAE, Zimbabwe).",
  'Check country-name strings against the README — Google\'s canonical names differ (e.g. "United States" instead of "United States of America").',
];
