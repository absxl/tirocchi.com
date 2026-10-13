import { SocialIcon } from "./SocialIcon";
import styles from "./SocialIcons.module.css";

export interface SocialItem {
  label: string;
  url: string;
}

export function SocialIcons({
  items,
  className,
}: {
  items: SocialItem[];
  className?: string;
}) {
  return (
    <ul className={`${styles.list} ${className ?? ""}`}>
      {items.map((item) => (
        <li key={item.label}>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            aria-label={item.label}
            title={item.label}
          >
            <SocialIcon label={item.label} />
          </a>
        </li>
      ))}
    </ul>
  );
}
