// ─── Presence Management ──────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type PresenceStatus = 'ONLINE' | 'OFFLINE' | 'AWAY' | 'DND'

export interface UserPresence {
  userId: string
  status: PresenceStatus
  lastSeen: number
  device: string
  location?: string
  customMessage?: string
}

export interface PresenceOptions {
  autoAwayTimeoutMs: number
  typingTimeoutMs: number
  cleanupIntervalMs: number
  staleThresholdMs: number
}

export interface TypingIndicator {
  userId: string
  roomId: string
  startedAt: number
  timerId: ReturnType<typeof setTimeout>
}

export type PresenceChangeCallback = (
  userId: string,
  oldStatus: PresenceStatus,
  newStatus: PresenceStatus,
) => void

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: PresenceOptions = {
  autoAwayTimeoutMs: 5 * 60 * 1_000,
  typingTimeoutMs: 5_000,
  cleanupIntervalMs: 60_000,
  staleThresholdMs: 10 * 60 * 1_000,
}

// ─── Presence Manager ─────────────────────────────────────────────────────────

export class PresenceManager {
  private presenceMap: Map<string, UserPresence> = new Map()
  private typingMap: Map<string, Map<string, TypingIndicator>> = new Map()
  private activityTimers: Map<string, ReturnType<typeof setTimeout>> =
    new Map()
  private changeListeners: PresenceChangeCallback[] = []
  private cleanupTimer: ReturnType<typeof setInterval> | null = null
  private readonly options: PresenceOptions

  constructor(options: Partial<PresenceOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  // ─── Presence ─────────────────────────────────────────────────────────────

  setPresence(
    userId: string,
    status: PresenceStatus,
    meta?: { device?: string; location?: string; customMessage?: string },
  ): UserPresence {
    const existing = this.presenceMap.get(userId)
    const oldStatus = existing?.status ?? 'OFFLINE'

    const presence: UserPresence = {
      userId,
      status,
      lastSeen: Date.now(),
      device: meta?.device ?? existing?.device ?? 'unknown',
      location: meta?.location ?? existing?.location,
      customMessage: meta?.customMessage ?? existing?.customMessage,
    }

    this.presenceMap.set(userId, presence)

    if (status === 'ONLINE') {
      this.resetAutoAwayTimer(userId)
    } else {
      this.clearAutoAwayTimer(userId)
    }

    if (oldStatus !== status) {
      this.notifyChange(userId, oldStatus, status)
    }

    return presence
  }

  getPresence(userId: string): UserPresence | undefined {
    return this.presenceMap.get(userId)
  }

  removePresence(userId: string): boolean {
    const existing = this.presenceMap.get(userId)
    if (!existing) return false

    const oldStatus = existing.status
    this.presenceMap.delete(userId)
    this.clearAutoAwayTimer(userId)
    this.clearAllTypingForUser(userId)

    if (oldStatus !== 'OFFLINE') {
      this.notifyChange(userId, oldStatus, 'OFFLINE')
    }

    return true
  }

  // ─── Activity Tracking ────────────────────────────────────────────────────

  recordActivity(userId: string): void {
    const presence = this.presenceMap.get(userId)
    if (!presence) return

    presence.lastSeen = Date.now()

    if (presence.status === 'AWAY') {
      const oldStatus = presence.status
      presence.status = 'ONLINE'
      this.notifyChange(userId, oldStatus, 'ONLINE')
    }

    this.resetAutoAwayTimer(userId)
  }

  private resetAutoAwayTimer(userId: string): void {
    this.clearAutoAwayTimer(userId)

    const timerId = setTimeout(() => {
      const presence = this.presenceMap.get(userId)
      if (presence && presence.status === 'ONLINE') {
        const oldStatus = presence.status
        presence.status = 'AWAY'
        presence.lastSeen = Date.now()
        this.notifyChange(userId, oldStatus, 'AWAY')
      }
    }, this.options.autoAwayTimeoutMs)

    this.activityTimers.set(userId, timerId)
  }

  private clearAutoAwayTimer(userId: string): void {
    const timerId = this.activityTimers.get(userId)
    if (timerId) {
      clearTimeout(timerId)
      this.activityTimers.delete(userId)
    }
  }

  // ─── Typing Indicators ───────────────────────────────────────────────────

  startTyping(userId: string, roomId: string): void {
    let roomTyping = this.typingMap.get(roomId)
    if (!roomTyping) {
      roomTyping = new Map()
      this.typingMap.set(roomId, roomTyping)
    }

    const existing = roomTyping.get(userId)
    if (existing) {
      clearTimeout(existing.timerId)
    }

    const timerId = setTimeout(() => {
      this.stopTyping(userId, roomId)
    }, this.options.typingTimeoutMs)

    roomTyping.set(userId, {
      userId,
      roomId,
      startedAt: Date.now(),
      timerId,
    })
  }

  stopTyping(userId: string, roomId: string): void {
    const roomTyping = this.typingMap.get(roomId)
    if (!roomTyping) return

    const indicator = roomTyping.get(userId)
    if (indicator) {
      clearTimeout(indicator.timerId)
      roomTyping.delete(userId)
      if (roomTyping.size === 0) {
        this.typingMap.delete(roomId)
      }
    }
  }

  getTyping(roomId: string): string[] {
    const roomTyping = this.typingMap.get(roomId)
    if (!roomTyping) return []
    return Array.from(roomTyping.keys())
  }

  private clearAllTypingForUser(userId: string): void {
    for (const [roomId, roomTyping] of this.typingMap) {
      const indicator = roomTyping.get(userId)
      if (indicator) {
        clearTimeout(indicator.timerId)
        roomTyping.delete(userId)
        if (roomTyping.size === 0) {
          this.typingMap.delete(roomId)
        }
      }
    }
  }

  // ─── Bulk Queries ─────────────────────────────────────────────────────────

  getOnlineUsers(userIds: string[]): UserPresence[] {
    const result: UserPresence[] = []
    for (const userId of userIds) {
      const presence = this.presenceMap.get(userId)
      if (presence && presence.status === 'ONLINE') {
        result.push(presence)
      }
    }
    return result
  }

  getBulkPresence(userIds: string[]): Map<string, UserPresence> {
    const result = new Map<string, UserPresence>()
    for (const userId of userIds) {
      const presence = this.presenceMap.get(userId)
      if (presence) {
        result.set(userId, presence)
      }
    }
    return result
  }

  getByStatus(status: PresenceStatus): UserPresence[] {
    const result: UserPresence[] = []
    for (const presence of this.presenceMap.values()) {
      if (presence.status === status) {
        result.push(presence)
      }
    }
    return result
  }

  getAllOnlineCount(): number {
    let count = 0
    for (const presence of this.presenceMap.values()) {
      if (presence.status === 'ONLINE' || presence.status === 'AWAY') {
        count++
      }
    }
    return count
  }

  // ─── Change Notifications ─────────────────────────────────────────────────

  onChange(callback: PresenceChangeCallback): () => void {
    this.changeListeners.push(callback)
    return () => {
      const idx = this.changeListeners.indexOf(callback)
      if (idx >= 0) this.changeListeners.splice(idx, 1)
    }
  }

  private notifyChange(
    userId: string,
    oldStatus: PresenceStatus,
    newStatus: PresenceStatus,
  ): void {
    for (const listener of this.changeListeners) {
      listener(userId, oldStatus, newStatus)
    }
  }

  // ─── Stale Cleanup ────────────────────────────────────────────────────────

  startCleanup(): void {
    this.stopCleanup()
    this.cleanupTimer = setInterval(() => {
      this.cleanupStalePresence()
    }, this.options.cleanupIntervalMs)
  }

  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer)
      this.cleanupTimer = null
    }
  }

  cleanupStalePresence(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [userId, presence] of this.presenceMap) {
      if (now - presence.lastSeen > this.options.staleThresholdMs) {
        if (presence.status !== 'OFFLINE') {
          const oldStatus = presence.status
          presence.status = 'OFFLINE'
          this.notifyChange(userId, oldStatus, 'OFFLINE')
          cleaned++
        }
      }
    }

    return cleaned
  }

  // ─── Cleanup All ──────────────────────────────────────────────────────────

  clear(): void {
    this.stopCleanup()

    for (const userId of this.activityTimers.keys()) {
      this.clearAutoAwayTimer(userId)
    }

    for (const roomTyping of this.typingMap.values()) {
      for (const indicator of roomTyping.values()) {
        clearTimeout(indicator.timerId)
      }
    }

    this.presenceMap.clear()
    this.typingMap.clear()
    this.activityTimers.clear()
    this.changeListeners = []
  }
}
