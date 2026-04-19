// ─── Real-time Event Definitions ──────────────────────────────────────────────

// ─── Event Types ──────────────────────────────────────────────────────────────

export type RealtimeEventType =
  | 'MESSAGE_NEW'
  | 'MESSAGE_READ'
  | 'MESSAGE_DELETED'
  | 'TYPING_START'
  | 'TYPING_STOP'
  | 'PRESENCE_CHANGE'
  | 'LISTING_UPDATE'
  | 'LISTING_CREATED'
  | 'NOTIFICATION'
  | 'PAYMENT_STATUS'
  | 'ROOM_JOINED'
  | 'ROOM_LEFT'
  | 'SYSTEM'

export type EventPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'

export const EVENT_VERSION = 1

// ─── Event Structure ──────────────────────────────────────────────────────────

export interface RealtimeEvent<T = unknown> {
  id: string
  version: number
  type: RealtimeEventType
  timestamp: number
  sender: string
  payload: T
  priority: EventPriority
  roomId?: string
  targetUserId?: string
  metadata?: Record<string, unknown>
}

// ─── Typed Payloads ─────────────────────────────────────────────────────────

export interface MessageNewPayload {
  messageId: string
  content: string
  roomId: string
  attachments?: string[]
}

export interface MessageReadPayload {
  messageId: string
  roomId: string
  readBy: string
  readAt: number
}

export interface PresenceChangePayload {
  userId: string
  oldStatus: string
  newStatus: string
  device?: string
}

export interface ListingUpdatePayload {
  listingId: string
  field: string
  oldValue: unknown
  newValue: unknown
}

export interface PaymentStatusPayload {
  transactionId: string
  status: string
  amount: number
  currency: string
}

export interface NotificationPayload {
  title: string
  body: string
  category: string
  actionUrl?: string
}

// ─── Event Factory ────────────────────────────────────────────────────────────

let eventIdCounter = 0

function generateEventId(): string {
  eventIdCounter += 1
  return `evt_${Date.now()}_${eventIdCounter}`
}

export function createEvent<T>(
  type: RealtimeEventType,
  sender: string,
  payload: T,
  options?: {
    priority?: EventPriority
    roomId?: string
    targetUserId?: string
    metadata?: Record<string, unknown>
  },
): RealtimeEvent<T> {
  return {
    id: generateEventId(),
    version: EVENT_VERSION,
    type,
    timestamp: Date.now(),
    sender,
    payload,
    priority: options?.priority ?? 'NORMAL',
    roomId: options?.roomId,
    targetUserId: options?.targetUserId,
    metadata: options?.metadata,
  }
}

// ─── Serialization ────────────────────────────────────────────────────────────

export function serializeEvent(event: RealtimeEvent): string {
  return JSON.stringify(event)
}

export function deserializeEvent(data: string): RealtimeEvent {
  let parsed: unknown
  try {
    parsed = JSON.parse(data)
  } catch {
    throw new Error('Événement invalide : format JSON incorrect')
  }

  if (!isValidEvent(parsed)) {
    throw new Error('Événement invalide : structure incorrecte')
  }

  if ((parsed as RealtimeEvent).version > EVENT_VERSION) {
    throw new Error(
      `Version d'événement non supportée : ${(parsed as RealtimeEvent).version} (max: ${EVENT_VERSION})`,
    )
  }

  return parsed as RealtimeEvent
}

function isValidEvent(data: unknown): boolean {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>
  return (
    typeof obj['id'] === 'string' &&
    typeof obj['version'] === 'number' &&
    typeof obj['type'] === 'string' &&
    typeof obj['timestamp'] === 'number' &&
    typeof obj['sender'] === 'string' &&
    'payload' in obj
  )
}

// ─── Deduplication ────────────────────────────────────────────────────────────

export class EventDeduplicator {
  private seenIds: Map<string, number> = new Map()
  private readonly maxSize: number
  private readonly ttlMs: number

  constructor(maxSize = 10_000, ttlMs = 5 * 60 * 1_000) {
    this.maxSize = maxSize
    this.ttlMs = ttlMs
  }

  isDuplicate(event: RealtimeEvent): boolean {
    const seen = this.seenIds.get(event.id)
    if (seen !== undefined) return true

    this.seenIds.set(event.id, event.timestamp)
    this.cleanup()
    return false
  }

  markSeen(eventId: string): void {
    this.seenIds.set(eventId, Date.now())
    this.cleanup()
  }

  private cleanup(): void {
    if (this.seenIds.size <= this.maxSize) return

    const now = Date.now()
    for (const [id, ts] of this.seenIds) {
      if (now - ts > this.ttlMs) {
        this.seenIds.delete(id)
      }
    }

    if (this.seenIds.size > this.maxSize) {
      const entries = Array.from(this.seenIds.entries())
      entries.sort((a, b) => a[1] - b[1])
      const toRemove = entries.slice(0, entries.length - this.maxSize)
      for (const [id] of toRemove) {
        this.seenIds.delete(id)
      }
    }
  }

  clear(): void {
    this.seenIds.clear()
  }

  get size(): number {
    return this.seenIds.size
  }
}

// ─── Priority Helpers ─────────────────────────────────────────────────────────

const PRIORITY_WEIGHTS: Record<EventPriority, number> = {
  LOW: 0,
  NORMAL: 1,
  HIGH: 2,
  CRITICAL: 3,
}

export function comparePriority(a: EventPriority, b: EventPriority): number {
  return PRIORITY_WEIGHTS[b] - PRIORITY_WEIGHTS[a]
}

export function sortByPriority<T extends { priority: EventPriority }>(
  events: T[],
): T[] {
  return [...events].sort((a, b) => comparePriority(a.priority, b.priority))
}

export function isHighPriority(event: RealtimeEvent): boolean {
  return event.priority === 'HIGH' || event.priority === 'CRITICAL'
}
