// ─── MABELE Card Components ────────────────────────────────────────────────────
// Source: Board 4 — Listing Card · Wallet Card · Service Card
'use client'

import { useState } from 'react'

// ── Listing Card (Board 4 + Board 2) ──────────────────────────────────────────

interface ListingCardProps {
  title:       string
  price:       string
  location:    string
  category?:   string
  imageUrl?:   string
  verified?:   boolean
  saved?:      boolean
  onSave?:     () => void
  onClick?:    () => void
  className?:  string
}

export function ListingCard({
  title, price, location, category, imageUrl, verified = false,
  saved = false, onSave, onClick, className = '',
}: ListingCardProps) {
  const [isSaved, setIsSaved] = useState(saved)

  return (
    <div
      className={`card overflow-hidden card-hover cursor-pointer ${className}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-4xl opacity-30">🏠</span>
          </div>
        )}

        {/* Save button */}
        <button
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-base transition-transform hover:scale-110"
          onClick={(e) => { e.stopPropagation(); setIsSaved(!isSaved); onSave?.() }}
          aria-label={isSaved ? 'Retirer des favoris' : 'Sauvegarder'}
        >
          {isSaved ? '❤️' : '🤍'}
        </button>

        {/* Verified badge overlay */}
        {verified && (
          <span className="absolute bottom-2 left-2 trust-verified text-[10px] px-2 py-0.5">
            ✓ Vendeur Vérifié
          </span>
        )}

        {/* Category */}
        {category && (
          <span className="absolute top-2 left-2 badge badge-blue text-[10px]">{category}</span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="text-sm font-semibold text-text-primary line-clamp-2 leading-snug">{title}</p>
        <p className="text-base font-bold text-navy mt-1">{price}</p>
        <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
          <span>📍</span>{location}
        </p>
      </div>
    </div>
  )
}

// ── Service Card (Board 2 Services Hub) ───────────────────────────────────────

interface ServiceCardProps {
  icon:        string
  title:       string
  description: string
  href:        string
  color?:      string
  className?:  string
}

export function ServiceCard({ icon, title, description, href, color = '#1B4FB3', className = '' }: ServiceCardProps) {
  return (
    <a
      href={href}
      className={`card p-4 card-hover flex gap-4 items-start group ${className}`}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-transform group-hover:scale-105"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <h3 className="font-semibold text-text-primary text-sm leading-tight">{title}</h3>
        <p className="text-text-muted text-xs mt-0.5 line-clamp-2">{description}</p>
        <span className="text-primary text-xs font-semibold mt-1.5 inline-block group-hover:underline" style={{ color }}>
          Voir →
        </span>
      </div>
    </a>
  )
}

// ── Wallet Card (Board 3 KangaPay + Board 4) ──────────────────────────────────

interface WalletCardProps {
  name:     string
  balance:  string
  currency: string
  className?: string
}

export function WalletCard({ name, balance, currency, className = '' }: WalletCardProps) {
  return (
    <div
      className={`rounded-2xl p-5 text-white ${className}`}
      style={{ background: 'linear-gradient(135deg, #1A3260 0%, #0C1E47 60%, #0B1835 100%)' }}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-white/60 text-xs font-medium uppercase tracking-wider">KangaPay Wallet</p>
          <p className="text-white text-sm font-medium mt-0.5">{name}</p>
        </div>
        <span className="text-2xl">💰</span>
      </div>

      <p className="text-white/60 text-xs mb-1">Solde disponible</p>
      <p className="text-3xl font-bold text-white">
        {balance} <span className="text-lg font-medium text-white/70">{currency}</span>
      </p>

      <div className="mt-6 flex gap-2">
        <button className="btn-primary flex-1 text-xs py-2.5">✈ Envoyer</button>
        <button className="btn-primary flex-1 text-xs py-2.5">⬜ Scanner QR</button>
      </div>
    </div>
  )
}

// ── Transaction Card (Board 3 Historique) ─────────────────────────────────────

interface TransactionCardProps {
  icon:     string
  label:    string
  date:     string
  amount:   number
  currency: string
  category?: string
}

export function TransactionCard({ icon, label, date, amount, currency, category }: TransactionCardProps) {
  const isPositive = amount > 0
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border-light last:border-0">
      <div className="w-10 h-10 rounded-full bg-bg-subtle flex items-center justify-center flex-shrink-0 text-xl">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{label}</p>
        <p className="text-xs text-text-muted">{date}{category ? ` · ${category}` : ''}</p>
      </div>
      <p className={`text-sm font-bold flex-shrink-0 ${isPositive ? 'text-success' : 'text-error'}`}>
        {isPositive ? '+' : ''}{amount.toLocaleString('fr-CD')} {currency}
      </p>
    </div>
  )
}

// ── Notification Card (Board 2 Profile) ───────────────────────────────────────

interface NotificationCardProps {
  icon:    string
  title:   string
  message: string
  time:    string
  read?:   boolean
  color?:  string
}

export function NotificationCard({ icon, title, message, time, read = false, color = '#1B4FB3' }: NotificationCardProps) {
  return (
    <div className={`flex gap-3 p-3 rounded-xl transition-colors ${read ? '' : 'bg-bg-subtle'}`}>
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary">{title}</p>
        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{message}</p>
        <p className="text-xs text-text-muted mt-1">{time}</p>
      </div>
      {!read && (
        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
      )}
    </div>
  )
}
