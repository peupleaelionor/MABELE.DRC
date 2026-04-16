// ─── MABELE SearchBar + FilterChips ────────────────────────────────────────────
// Source: Board 4 — Search Bar · Filters · Filter Chips
'use client'

import { useState } from 'react'

// ── Search Bar ────────────────────────────────────────────────────────────────

interface SearchBarProps {
  placeholder?: string
  value?:       string
  onChange?:    (val: string) => void
  onSubmit?:    (val: string) => void
  className?:   string
  size?:        'sm' | 'md' | 'lg'
}

export function SearchBar({
  placeholder = 'Rechercher sur MABELE...',
  value,
  onChange,
  onSubmit,
  className = '',
  size = 'md',
}: SearchBarProps) {
  const [internal, setInternal] = useState('')
  const val = value ?? internal

  const handle = (v: string) => {
    setInternal(v)
    onChange?.(v)
  }

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-11 text-sm',
    lg: 'h-13 text-base',
  }

  return (
    <form
      className={`relative flex items-center ${className}`}
      onSubmit={(e) => { e.preventDefault(); onSubmit?.(val) }}
    >
      <span className="absolute left-3.5 text-text-muted pointer-events-none text-base">🔍</span>
      <input
        type="search"
        value={val}
        onChange={(e) => handle(e.target.value)}
        placeholder={placeholder}
        className={`input pl-10 pr-12 ${sizeClasses[size]} bg-bg-subtle border-border-light`}
      />
      {val && (
        <button
          type="button"
          className="absolute right-3 text-text-muted hover:text-text-primary"
          onClick={() => handle('')}
          aria-label="Effacer"
        >
          ✕
        </button>
      )}
    </form>
  )
}

// ── Filter Chips ──────────────────────────────────────────────────────────────

interface FilterChip {
  id:    string
  label: string
}

interface FilterChipsProps {
  chips:     FilterChip[]
  active:    string[]
  onToggle:  (id: string) => void
  onRemove?: (id: string) => void
  className?: string
}

/** Board 4: Filter chips — Prix · Type · Localisation (with × to remove) */
export function FilterChips({ chips, active, onToggle, onRemove, className = '' }: FilterChipsProps) {
  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {chips.map(({ id, label }) => {
        const isActive = active.includes(id)
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all
              ${isActive
                ? 'bg-primary/10 border-primary text-primary'
                : 'bg-white border-border text-text-secondary hover:border-primary hover:text-primary'
              }`}
          >
            {label}
            {isActive && onRemove && (
              <span
                className="ml-0.5 opacity-60 hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); onRemove(id) }}
              >
                ×
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── OTP Input (Board 4) ───────────────────────────────────────────────────────

interface OtpInputProps {
  length?:   number
  value:     string
  onChange:  (val: string) => void
  className?: string
}

export function OtpInput({ length = 6, value, onChange, className = '' }: OtpInputProps) {
  const digits = value.split('').slice(0, length)

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.currentTarget
    if (e.key === 'Backspace') {
      if (!target.value && i > 0) {
        const prev = target.parentElement?.querySelectorAll('input')[i - 1] as HTMLInputElement
        prev?.focus()
      }
      const next = [...digits]
      next[i] = ''
      onChange(next.join(''))
    } else if (/^\d$/.test(e.key)) {
      e.preventDefault()
      const next = [...digits]
      next[i] = e.key
      onChange(next.join(''))
      if (i < length - 1) {
        const nextEl = target.parentElement?.querySelectorAll('input')[i + 1] as HTMLInputElement
        nextEl?.focus()
      }
    }
  }

  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] ?? ''}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl text-text-primary transition-all
            focus:outline-none focus:border-primary focus:shadow-blue"
          style={{
            borderColor: digits[i] ? '#1B4FB3' : '#D0DBE8',
            backgroundColor: digits[i] ? '#EFF6FF' : '#FFFFFF',
          }}
        />
      ))}
    </div>
  )
}

// ── Phone Input (Board 4) ─────────────────────────────────────────────────────

interface PhoneInputProps {
  value:      string
  onChange:   (val: string) => void
  error?:     string
  className?: string
}

export function PhoneInput({ value, onChange, error, className = '' }: PhoneInputProps) {
  return (
    <div className={className}>
      <div className={`flex border rounded-lg overflow-hidden transition-all bg-white ${error ? 'border-error shadow-[0_0_0_3px_rgba(220,38,38,0.10)]' : 'border-border focus-within:border-primary focus-within:shadow-blue'}`}>
        <div className="flex items-center gap-2 px-3 border-r border-border bg-bg-subtle select-none">
          <span className="text-base">🇨🇩</span>
          <span className="text-sm font-medium text-text-secondary">+243</span>
        </div>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
          placeholder="81 234 5678"
          className="flex-1 px-3 py-3 text-sm text-text-primary placeholder:text-text-muted bg-transparent focus:outline-none"
        />
      </div>
      {error && <p className="text-error text-xs mt-1.5">{error}</p>}
    </div>
  )
}
