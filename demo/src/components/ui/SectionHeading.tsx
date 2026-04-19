import styles from "./SectionHeading.module.scss";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  headingId?: string;
};

export function SectionHeading({ title, subtitle, badge, headingId }: Props) {
  return (
    <div className={styles.heading}>
      <div className={styles.text}>
        <h2 id={headingId}>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {badge && <span className={styles.badge}>{badge}</span>}
    </div>
  );
}
