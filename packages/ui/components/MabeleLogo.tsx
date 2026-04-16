// ─── MABELE Logo Components ────────────────────────────────────────────────
// Source: MABELE Visual Kit Board 4 — Logotype & Couleurs
// Three variants: full (mark + wordmark), mark-only, favicon

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'light' | 'dark' | 'white'
}

const sizeMap = {
  sm: { height: 28, viewW: 160, markR: 12, tx: 32, ty: 15, ts: 18 },
  md: { height: 36, viewW: 200, markR: 16, tx: 42, ty: 20, ts: 22 },
  lg: { height: 48, viewW: 260, markR: 22, tx: 56, ty: 27, ts: 28 },
  xl: { height: 64, viewW: 340, markR: 28, tx: 72, ty: 36, ts: 36 },
}

/** Full MABELE logo: circular mark + wordmark */
export function MabeleLogo({ size = 'md', variant = 'light', className }: LogoProps) {
  const { height, viewW, markR, tx, ty, ts } = sizeMap[size]
  const viewH = markR * 2 + 8
  const cx = markR + 4
  const cy = markR + 4
  const wordColor = variant === 'light' ? '#1B4FB3' : '#FFFFFF'

  return (
    <svg
      viewBox={`0 0 ${viewW} ${viewH}`}
      height={height}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MABELE"
      className={className}
    >
      <defs>
        <clipPath id={`mc-${size}`}>
          <circle cx={cx} cy={cy} r={markR} />
        </clipPath>
      </defs>

      {/* Circular mark */}
      <circle cx={cx} cy={cy} r={markR} fill="#0C1E47" />
      <g clipPath={`url(#mc-${size})`}>
        <path d={`M${cx - markR},${cy - markR} L${cx + markR},${cy - markR} L${cx + markR},${cy - markR * 0.15} Q${cx + markR * 0.47},${cy - markR * 0.42} ${cx},${cy - markR * 0.27} Q${cx - markR * 0.47},${cy - markR * 0.12} ${cx - markR},${cy - markR * 0.42} Z`}
              fill="#1B4FB3" />
        <path d={`M${cx - markR},${cy - markR * 0.42} Q${cx - markR * 0.47},${cy - markR * 0.12} ${cx},${cy - markR * 0.27} Q${cx + markR * 0.47},${cy - markR * 0.42} ${cx + markR},${cy - markR * 0.15} L${cx + markR},${cy + markR * 0.28} Q${cx + markR * 0.47},${cy + markR * 0.02} ${cx},${cy + markR * 0.15} Q${cx - markR * 0.47},${cy + markR * 0.28} ${cx - markR},${cy + markR * 0.02} Z`}
              fill="#CE1126" />
        <path d={`M${cx - markR},${cy + markR * 0.02} Q${cx - markR * 0.47},${cy + markR * 0.28} ${cx},${cy + markR * 0.15} Q${cx + markR * 0.47},${cy + markR * 0.02} ${cx + markR},${cy + markR * 0.28} L${cx + markR},${cy + markR * 0.62} Q${cx + markR * 0.47},${cy + markR * 0.38} ${cx},${cy + markR * 0.52} Q${cx - markR * 0.47},${cy + markR * 0.65} ${cx - markR},${cy + markR * 0.4} Z`}
              fill="#F5A623" />
        <path d={`M${cx - markR},${cy + markR * 0.4} Q${cx - markR * 0.47},${cy + markR * 0.65} ${cx},${cy + markR * 0.52} Q${cx + markR * 0.47},${cy + markR * 0.38} ${cx + markR},${cy + markR * 0.62} L${cx + markR},${cy + markR} L${cx - markR},${cy + markR} Z`}
              fill="#0C1E47" />
      </g>
      <circle cx={cx} cy={cy} r={markR} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />

      {/* Wordmark */}
      <text
        x={tx} y={ty + ts * 0.3}
        fontFamily="'DM Sans', system-ui, sans-serif"
        fontWeight="700"
        fontSize={ts}
        fill={wordColor}
        letterSpacing="0.5"
      >
        MABELE
      </text>
    </svg>
  )
}

/** Mark-only icon (for avatars, favicons, small spaces) */
export function MabeleMark({ size = 36, className }: { size?: number; className?: string }) {
  const r = size / 2 - 2
  const cx = size / 2
  const cy = size / 2

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MABELE"
      className={className}
    >
      <defs>
        <clipPath id={`mm-${size}`}>
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill="#0C1E47" />
      <g clipPath={`url(#mm-${size})`}>
        <path d={`M${cx - r},${cy - r} L${cx + r},${cy - r} L${cx + r},${cy - r * 0.15} Q${cx + r * 0.47},${cy - r * 0.42} ${cx},${cy - r * 0.27} Q${cx - r * 0.47},${cy - r * 0.12} ${cx - r},${cy - r * 0.42} Z`} fill="#1B4FB3" />
        <path d={`M${cx - r},${cy - r * 0.42} Q${cx - r * 0.47},${cy - r * 0.12} ${cx},${cy - r * 0.27} Q${cx + r * 0.47},${cy - r * 0.42} ${cx + r},${cy - r * 0.15} L${cx + r},${cy + r * 0.28} Q${cx + r * 0.47},${cy + r * 0.02} ${cx},${cy + r * 0.15} Q${cx - r * 0.47},${cy + r * 0.28} ${cx - r},${cy + r * 0.02} Z`} fill="#CE1126" />
        <path d={`M${cx - r},${cy + r * 0.02} Q${cx - r * 0.47},${cy + r * 0.28} ${cx},${cy + r * 0.15} Q${cx + r * 0.47},${cy + r * 0.02} ${cx + r},${cy + r * 0.28} L${cx + r},${cy + r * 0.62} Q${cx + r * 0.47},${cy + r * 0.38} ${cx},${cy + r * 0.52} Q${cx - r * 0.47},${cy + r * 0.65} ${cx - r},${cy + r * 0.4} Z`} fill="#F5A623" />
        <path d={`M${cx - r},${cy + r * 0.4} Q${cx - r * 0.47},${cy + r * 0.65} ${cx},${cy + r * 0.52} Q${cx + r * 0.47},${cy + r * 0.38} ${cx + r},${cy + r * 0.62} L${cx + r},${cy + r} L${cx - r},${cy + r} Z`} fill="#0C1E47" />
      </g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </svg>
  )
}
