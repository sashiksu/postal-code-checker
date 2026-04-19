import { useCallback } from "react";
import { SECTIONS, SECTION_IDS } from "../data/sections";
import { useActiveSection } from "../hooks/useActiveSection";
import styles from "./Sidebar.module.scss";

export function Sidebar() {
  const active = useActiveSection(SECTION_IDS);

  const scrollTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
      e.preventDefault();
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    },
    [],
  );

  return (
    <aside className={styles.sidebar} aria-label="Section navigation">
      <nav className={styles.nav}>
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={`${styles.link} ${active === s.id ? styles.active : ""}`}
            aria-current={active === s.id ? "location" : undefined}
            onClick={(e) => scrollTo(e, s.id)}
          >
            {s.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
