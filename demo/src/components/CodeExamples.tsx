import { useMemo, useState } from "react";
import { EXAMPLES, type ExampleId } from "../data/examples";
import { CodeBlock } from "./ui/CodeBlock";
import { Tabs } from "./ui/Tabs";
import styles from "./CodeExamples.module.scss";

const TABS = EXAMPLES.map((e) => ({ id: e.id, label: e.label }));

export function CodeExamples() {
  const [active, setActive] = useState<ExampleId>("basic");
  const current = useMemo(
    () => EXAMPLES.find((e) => e.id === active) ?? EXAMPLES[0],
    [active],
  );

  return (
    <section id="examples" className={styles.section} aria-labelledby="examples-heading">
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="examples-heading">Code examples</h2>
          <Tabs
            tabs={TABS}
            active={active}
            onChange={setActive}
            variant="underline"
            ariaLabel="Code examples"
          />
        </div>
        <div
          role="tabpanel"
          id={`panel-${current.id}`}
          aria-labelledby={`tab-${current.id}`}
        >
          <CodeBlock code={current.code} ariaLabel={`${current.label} example`} />
        </div>
      </div>
    </section>
  );
}
