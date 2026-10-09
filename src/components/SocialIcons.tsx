import styles from "./SocialIcons.module.css";

export interface SocialItem {
  label: string;
  url: string;
}

function Icon({ label }: { label: string }) {
  const name = label.toLowerCase();
  if (name.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (name.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M8 10.5V16.5M8 7.6v.01M12 16.5v-3.2a2 2 0 0 1 4 0v3.2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">
      <text
        x="12"
        y="16.6"
        textAnchor="middle"
        fontFamily="inherit"
        fontSize="12"
        fontWeight="700"
        fill="currentColor"
      >
        Bē
      </text>
    </svg>
  );
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
            <Icon label={item.label} />
          </a>
        </li>
      ))}
    </ul>
  );
}
