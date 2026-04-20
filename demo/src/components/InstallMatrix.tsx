import { useCallback, useMemo, useState } from "react";
import {
  INSTALL_COMMANDS,
  PACKAGE_MANAGERS,
  type PackageManager,
} from "../data/examples";
import { readShareParam } from "../data/share";
import { CodeBlock } from "./ui/CodeBlock";
import { ShareButton } from "./ui/ShareButton";
import { Tabs } from "./ui/Tabs";
import styles from "./InstallMatrix.module.scss";

const TABS = PACKAGE_MANAGERS.map((pm) => ({ id: pm, label: pm }));

function loadInitial(): PackageManager {
  const raw = readShareParam("install");
  if (raw && (PACKAGE_MANAGERS as readonly string[]).includes(raw)) {
    return raw as PackageManager;
  }
  return "npm";
}

export function InstallMatrix() {
  const [active, setActive] = useState<PackageManager>(() => loadInitial());
  const code = useMemo(() => INSTALL_COMMANDS[active], [active]);
  const getShareValue = useCallback(() => active, [active]);

  return (
    <section id="install" className={styles.section} aria-labelledby="install-heading">
      <div className={styles.panel}>
        <div className={styles.shareCorner}>
          <ShareButton
            paramName="install"
            getValue={getShareValue}
            ariaLabel="Share this install tab"
          />
        </div>
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
