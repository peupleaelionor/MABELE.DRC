import { createId } from '@paralleldrive/cuid2'
import type {
  DomainEventType,
  DomainEventPayload,
  DomainEventEnvelope,
  EventHandler,
} from './types'

// ─── In-process Event Bus ─────────────────────────────────────────────────────
// Lightweight, synchronous-first event bus for domain events.
// Replace the dispatch method's body with a queue (Trigger.dev / BullMQ) for
// async fan-out in production.

class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map()
  private wildcardHandlers: EventHandler[] = []

  on<T extends DomainEventPayload>(type: DomainEventType, handler: EventHandler<T>): () => void {
    const existing = this.handlers.get(type) ?? []
    existing.push(handler as EventHandler)
    this.handlers.set(type, existing)
    return () => this.off(type, handler as EventHandler)
  }

  onAll(handler: EventHandler): () => void {
    this.wildcardHandlers.push(handler)
    return () => {
      this.wildcardHandlers = this.wildcardHandlers.filter((h) => h !== handler)
    }
  }

  off(type: DomainEventType, handler: EventHandler): void {
    const existing = this.handlers.get(type) ?? []
    this.handlers.set(
      type,
      existing.filter((h) => h !== handler),
    )
  }

  async emit<T extends DomainEventPayload>(
    type: DomainEventType,
    payload: T,
    meta?: {
      aggregateId?: string
      aggregateType?: string
      userId?: string
    },
  ): Promise<void> {
    const event: DomainEventEnvelope<T> = {
      id: createId(),
      type,
      aggregateId: meta?.aggregateId,
      aggregateType: meta?.aggregateType,
      userId: meta?.userId,
      payload,
      createdAt: new Date(),
    }

    const handlers = [
      ...(this.handlers.get(type) ?? []),
      ...this.wildcardHandlers,
    ]

    await Promise.allSettled(handlers.map((h) => h(event as DomainEventEnvelope)))
  }
}

export const eventBus = new EventBus()

// ─── Convenience helpers ──────────────────────────────────────────────────────

export function onEvent<T extends DomainEventPayload>(
  type: DomainEventType,
  handler: EventHandler<T>,
): () => void {
  return eventBus.on(type, handler)
}

export async function emitEvent<T extends DomainEventPayload>(
  type: DomainEventType,
  payload: T,
  meta?: { aggregateId?: string; aggregateType?: string; userId?: string },
): Promise<void> {
  return eventBus.emit(type, payload, meta)
}
