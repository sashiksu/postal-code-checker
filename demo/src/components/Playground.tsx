import { type RefObject } from "react";
import { BatchPanel } from "./BatchPanel";
import { ConfigurationPanel } from "./ConfigurationPanel";
import { DatasetPanel } from "./DatasetPanel";
import { FormatPanel } from "./FormatPanel";
import { GuessPanel } from "./GuessPanel";
import { SubdivisionPanel } from "./SubdivisionPanel";
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
    <section id="playground" className={styles.section} aria-labelledby="playground-heading">
      <SectionHeading
        headingId="playground-heading"
        title="Playground"
        subtitle="Explore the full API — batch validation, canonical formatting, country guessing, dataset browser."
      />
      <div className={styles.grid}>
        <BatchPanel />
        <DatasetPanel activeCountry={activeCountry} onPickCountry={onPickCountry} searchRef={searchRef} />
      </div>
      <div className={styles.grid}>
        <FormatPanel />
        <GuessPanel onPickCountry={onPickCountry} />
      </div>
      <div className={styles.grid}>
        <SubdivisionPanel />
      </div>
      <div className={styles.editorWrap}>
        <LiveEditor />
      </div>
      <div id="configuration" className={styles.configWrap}>
        <SectionHeading
          title="Configuration"
          subtitle="Layer custom country data on top of the bundled dataset with a single configure() call. Replace an existing country's patterns, or register one the dataset doesn't ship — like Kosovo (XK)."
          badge="2.1.0"
        />
        <div className={styles.configPanelWrap}>
          <ConfigurationPanel />
        </div>
      </div>
      <div className={styles.roadmapWrap}>
        <Roadmap />
      </div>
    </section>
  );
}
