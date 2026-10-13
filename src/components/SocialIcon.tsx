/** Brand glyph for a social link (Instagram, LinkedIn, Behance). */
export function SocialIcon({ label, size = 20 }: { label: string; size?: number }) {
  const name = label.toLowerCase();
  if (name.includes("instagram")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.4" cy="6.6" r="1.2" fill="currentColor" />
      </svg>
    );
  }
  if (name.includes("linkedin")) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
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
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false">
      <text
        x="12"
        y="16.6"
        textAnchor="middle"
        fontFamily="inherit"
        fontSize={size * 0.6}
        fontWeight="700"
        fill="currentColor"
      >
        Bē
      </text>
    </svg>
  );
}
