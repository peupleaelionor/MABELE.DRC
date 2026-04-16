// ─── MABELE State Components ───────────────────────────────────────────────────
// Source: Board 4 — Loading · Success · Error · Empty States

// ── Skeleton / Shimmer ────────────────────────────────────────────────────────

export function SkeletonLine({ width = '100%', height = '14px', className = '' }: {
  width?: string; height?: string; className?: string
}) {
  return (
    <div
      className={`shimmer rounded ${className}`}
      style={{ width, height }}
      aria-hidden
    />
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card overflow-hidden ${className}`} aria-hidden>
      <div className="aspect-[4/3] shimmer" />
      <div className="p-3 space-y-2">
        <SkeletonLine height="14px" width="80%" />
        <SkeletonLine height="18px" width="50%" />
        <SkeletonLine height="12px" width="60%" />
      </div>
    </div>
  )
}

export function SkeletonListItem({ className = '' }: { className?: string }) {
  return (
    <div className={`flex gap-3 p-3 ${className}`} aria-hidden>
      <div className="w-10 h-10 rounded-full shimmer flex-shrink-0" />
      <div className="flex-1 space-y-1.5 pt-0.5">
        <SkeletonLine height="13px" width="60%" />
        <SkeletonLine height="11px" width="40%" />
      </div>
      <SkeletonLine height="13px" width="60px" />
    </div>
  )
}

// ── Loading Spinner ────────────────────────────────────────────────────────────

export function LoadingSpinner({ size = 24, color = '#1B4FB3' }: { size?: number; color?: string }) {
  return (
    <div
      className="rounded-full border-4 border-t-transparent animate-spin"
      style={{ width: size, height: size, borderColor: `${color}33`, borderTopColor: color }}
      role="status"
      aria-label="Chargement..."
    />
  )
}

export function LoadingState({ message = 'Chargement...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <LoadingSpinner size={40} />
      <p className="text-sm text-text-muted">{message}</p>
    </div>
  )
}

// ── Success State ──────────────────────────────────────────────────────────────

export function SuccessState({
  title   = 'Succès',
  message,
  action,
  onAction,
}: {
  title?:    string
  message?:  string
  action?:   string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-scale-in">
      <div className="w-20 h-20 rounded-full bg-success-bg flex items-center justify-center mb-4">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#DCFCE7" />
          <path d="M12 20l6 6 10-12" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-1 font-display">{title}</h2>
      {message && <p className="text-text-muted text-sm max-w-xs">{message}</p>}
      {action && onAction && (
        <button className="btn-primary mt-6" onClick={onAction}>{action}</button>
      )}
    </div>
  )
}

// ── Error State ────────────────────────────────────────────────────────────────

export function ErrorState({
  title   = 'Erreur critique',
  message = 'Une erreur inattendue s\'est produite.',
  action  = 'Réessayer',
  onAction,
}: {
  title?:    string
  message?:  string
  action?:   string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-error-bg flex items-center justify-center mb-4">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <path d="M20 4L36 34H4L20 4Z" fill="#FEE2E2" />
          <path d="M20 16v7M20 27v1" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-text-primary mb-1 font-display">{title}</h2>
      <p className="text-text-muted text-sm max-w-xs mb-6">{message}</p>
      {onAction && (
        <button className="btn-primary" onClick={onAction}>{action}</button>
      )}
    </div>
  )
}

// ── Payment States ─────────────────────────────────────────────────────────────

export function PaymentSuccess({
  amount,
  reference,
  onReceipt,
  onBack,
}: {
  amount:     string
  reference?: string
  onReceipt?: () => void
  onBack?:    () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-scale-in">
      <div className="w-24 h-24 rounded-full bg-success-bg flex items-center justify-center mb-5">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="#DCFCE7" />
          <path d="M14 24l8 8 14-16" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-1 font-display">Paiement Réussi</h2>
      <p className="text-4xl font-bold text-success my-3">{amount}</p>
      {reference && <p className="text-xs text-text-muted">Réf: {reference}</p>}
      <p className="text-text-muted text-sm mt-2">Paiement envoyé avec succès et sécurisé</p>
      <div className="w-full max-w-xs mt-8 space-y-3">
        {onReceipt && <button className="btn-primary w-full" onClick={onReceipt}>Voir le reçu</button>}
        {onBack    && <button className="btn-ghost w-full"   onClick={onBack}>Retour au portefeuille</button>}
      </div>
    </div>
  )
}

export function PaymentFailed({
  message = 'Une erreur s\'est produite. Veuillez réessayer.',
  onRetry,
  onCancel,
}: {
  message?:  string
  onRetry?:  () => void
  onCancel?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-error-bg flex items-center justify-center mb-5">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="#FEE2E2" />
          <path d="M16 16l16 16M32 16L16 32" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-1 font-display">Paiement Échoué</h2>
      <p className="text-text-muted text-sm max-w-xs mb-8">{message}</p>
      <div className="w-full max-w-xs space-y-3">
        {onRetry  && <button className="btn-primary w-full" onClick={onRetry}>Réessayer</button>}
        {onCancel && <button className="btn-ghost w-full"   onClick={onCancel}>Annuler</button>}
      </div>
    </div>
  )
}

export function PaymentPending({ message = 'En cours de validation...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-24 h-24 rounded-full bg-bg-muted flex items-center justify-center mb-5">
        <LoadingSpinner size={40} color="#1B4FB3" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-1 font-display">Paiement en attente</h2>
      <p className="text-text-muted text-sm">{message}</p>
    </div>
  )
}

// ── Empty State ────────────────────────────────────────────────────────────────

export function EmptyState({
  icon    = '📭',
  title   = 'Aucun résultat',
  message,
  action,
  onAction,
}: {
  icon?:     string
  title?:    string
  message?:  string
  action?:   string
  onAction?: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-bg-subtle flex items-center justify-center text-4xl mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-text-primary mb-1">{title}</h3>
      {message && <p className="text-text-muted text-sm max-w-xs">{message}</p>}
      {action && onAction && (
        <button className="btn-primary mt-5" onClick={onAction}>{action}</button>
      )}
    </div>
  )
}
