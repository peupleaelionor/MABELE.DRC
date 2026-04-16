// ─── MABELE Badge Components ──────────────────────────────────────────────────
// Source: Board 4 — Status Badges & Trust Badges

export type StatusType = 'valide' | 'en_attente' | 'annule' | 'inactif' | 'blue' | 'gray'
export type TrustType  = 'verified' | 'secure' | 'payment'

interface StatusBadgeProps {
  status: StatusType
  label?: string
  className?: string
}

const STATUS_MAP: Record<StatusType, { cls: string; dot: string; default: string }> = {
  valide:     { cls: 'badge-success', dot: '#16A34A', default: 'Validé'     },
  en_attente: { cls: 'badge-warning', dot: '#F59E0B', default: 'En attente' },
  annule:     { cls: 'badge-error',   dot: '#DC2626', default: 'Annulé'     },
  inactif:    { cls: 'badge-gray',    dot: '#8FA4BA', default: 'Inactif'    },
  blue:       { cls: 'badge-blue',    dot: '#1B4FB3', default: 'En cours'   },
  gray:       { cls: 'badge-gray',    dot: '#8FA4BA', default: 'Inconnu'    },
}

/** Board 4: Status chips — Validé · En attente · Annulé · Inactif */
export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  const { cls, dot, default: def } = STATUS_MAP[status]
  return (
    <span className={`badge ${cls} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: dot }} />
      {label ?? def}
    </span>
  )
}

interface TrustBadgeProps {
  type: TrustType
  label?: string
  className?: string
}

/** Board 4: Trust Badges — Compte Vérifié · Paiement Sécurisé */
export function TrustBadge({ type, label, className = '' }: TrustBadgeProps) {
  if (type === 'verified') {
    return (
      <span className={`trust-verified ${className}`}>
        <span>✓</span>
        {label ?? 'Compte Vérifié'}
      </span>
    )
  }
  if (type === 'secure' || type === 'payment') {
    return (
      <span className={`trust-secure ${className}`}>
        <span>🔒</span>
        {label ?? 'Paiement Sécurisé'}
      </span>
    )
  }
  return null
}

/** Trust score display (Board 2: "Score Trust 850") */
export function TrustScore({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-4 py-1.5' : 'text-sm px-3 py-1'
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full ${cls}`}
      style={{ backgroundColor: 'rgba(245,166,35,0.15)', color: '#D4881A' }}
    >
      ⭐ Score Trust {score}
    </span>
  )
}
