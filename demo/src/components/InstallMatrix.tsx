import { useMemo, useState } from "react";
import {
  INSTALL_COMMANDS,
  PACKAGE_MANAGERS,
  type PackageManager,
} from "../data/examples";
import { CodeBlock } from "./ui/CodeBlock";
import { Tabs } from "./ui/Tabs";
import styles from "./InstallMatrix.module.scss";

const TABS = PACKAGE_MANAGERS.map((pm) => ({ id: pm, label: pm }));

export function InstallMatrix() {
  const [active, setActive] = useState<PackageManager>("npm");
  const code = useMemo(() => INSTALL_COMMANDS[active], [active]);

  return (
    <section id="install" className={styles.section} aria-labelledby="install-heading">
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="install-heading">Install</h2>
          <Tabs
            tabs={TABS}
            active={active}
            onChange={setActive}
            variant="pill"
            ariaLabel="Package manager"
          />
        </div>
        <CodeBlock code={code} ariaLabel={`${active} install command`} />
      </div>
    </section>
  );
}
