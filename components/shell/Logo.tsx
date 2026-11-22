/** Kaplun wordmark. */
export function Logo() {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--ink)" }}>
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
        <rect x="1" y="1" width="26" height="26" rx="2" fill="#f15a27" />
        <circle cx="14" cy="14" r="6" fill="none" stroke="#1a1a1a" strokeWidth="1.75" />
      </svg>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 20, letterSpacing: "-0.03em" }}>Kaplun</span>
    </span>
  );
}
