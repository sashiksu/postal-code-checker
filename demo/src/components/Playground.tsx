import { type RefObject } from "react";
import { BatchPanel } from "./BatchPanel";
import { DatasetPanel } from "./DatasetPanel";
import { LiveEditor } from "./LiveEditor";
import { Roadmap } from "./Roadmap";
import { SectionHeading } from "./ui/SectionHeading";
import styles from "./Playground.module.scss";

type Props = {
  activeCountry?: string;
  onPickCountry?: (code: string) => void;
  searchRef?: RefObject<HTMLInputElement>;
};

export function Playground({ activeCountry, onPickCountry, searchRef }: Props) {
  return (
    <section
      id="playground"
      className={styles.section}
      aria-labelledby="playground-heading"
    >
      <SectionHeading
        headingId="playground-heading"
        title="Playground"
        subtitle="Explore the full API — batch validation, dataset browser, roadmap."
      />
      <div className={styles.grid}>
        <BatchPanel />
        <DatasetPanel
          activeCountry={activeCountry}
          onPickCountry={onPickCountry}
          searchRef={searchRef}
        />
      </div>
      <div className={styles.editorWrap}>
        <LiveEditor />
      </div>
      <div className={styles.roadmapWrap}>
        <Roadmap />
      </div>
    </section>
  );
}
