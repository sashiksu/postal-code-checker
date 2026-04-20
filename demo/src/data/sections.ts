export type Section = {
  id: string;
  label: string;
};

export const SECTIONS: readonly Section[] = [
  { id: "why", label: "Why us" },
  { id: "install", label: "Install" },
  { id: "examples", label: "Examples" },
  { id: "use-cases", label: "Use cases" },
  { id: "whats-new", label: "What's new" },
  { id: "migration", label: "Migration" },
  { id: "playground", label: "Playground" },
  { id: "configuration", label: "Configuration" },
  { id: "faq", label: "FAQ" },
] as const;

export const SECTION_IDS = SECTIONS.map((s) => s.id);
