import styles from "./Tabs.module.scss";

type Tab<T extends string> = {
  id: T;
  label: string;
};

type Props<T extends string> = {
  tabs: readonly Tab<T>[];
  active: T;
  onChange: (id: T) => void;
  variant?: "underline" | "pill";
  ariaLabel?: string;
};

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  variant = "underline",
  ariaLabel,
}: Props<T>) {
  return (
    <div
      className={`${styles.tabs} ${styles[variant]}`}
      role="tablist"
      aria-label={ariaLabel}
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          role="tab"
          aria-selected={active === t.id}
          aria-controls={`panel-${t.id}`}
          id={`tab-${t.id}`}
          className={`${styles.tab} ${active === t.id ? styles.active : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
