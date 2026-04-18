// ─── In-Process Pub/Sub System ────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PubSubOptions {
  historyDepth: number
  maxSubscriptionsPerChannel: number
  enableDeliveryTracking: boolean
}

export interface Subscription {
  id: string
  channel: string
  pattern: string | null
  callback: (message: PubSubMessage) => void
  createdAt: number
}

export interface PubSubMessage {
  id: string
  channel: string
  data: unknown
  timestamp: number
  publisherId?: string
}

export interface DeliveryRecord {
  messageId: string
  subscriptionId: string
  deliveredAt: number
  acknowledged: boolean
}

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: PubSubOptions = {
  historyDepth: 100,
  maxSubscriptionsPerChannel: 1_000,
  enableDeliveryTracking: false,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

let subIdCounter = 0

function generateSubId(): string {
  subIdCounter += 1
  return `sub_${Date.now()}_${subIdCounter}`
}

let msgIdCounter = 0

function generateMsgId(): string {
  msgIdCounter += 1
  return `msg_${Date.now()}_${msgIdCounter}`
}

function matchPattern(pattern: string, channel: string): boolean {
  if (pattern === channel) return true
  if (!pattern.includes('*')) return false

  const parts = pattern.split('.')
  const channelParts = channel.split('.')

  let pi = 0
  let ci = 0

  while (pi < parts.length && ci < channelParts.length) {
    const segment = parts[pi]!
    if (segment === '**') {
      if (pi === parts.length - 1) return true
      pi++
      const nextSegment = parts[pi]!
      while (ci < channelParts.length && channelParts[ci] !== nextSegment) {
        ci++
      }
      if (ci >= channelParts.length) return false
      continue
    }
    if (segment === '*') {
      pi++
      ci++
      continue
    }
    if (segment !== channelParts[ci]) return false
    pi++
    ci++
  }

  return pi === parts.length && ci === channelParts.length
}

// ─── Channel Namespacing Helpers ──────────────────────────────────────────────

export function userChannel(userId: string): string {
  return `user:${userId}`
}

export function roomChannel(roomId: string): string {
  return `room:${roomId}`
}

export function listingChannel(listingId: string): string {
  return `listing:${listingId}`
}

// ─── PubSub Class ─────────────────────────────────────────────────────────────

export class PubSub {
  private subscriptions: Map<string, Subscription> = new Map()
  private channelSubs: Map<string, Set<string>> = new Map()
  private patternSubs: Map<string, Set<string>> = new Map()
  private history: Map<string, PubSubMessage[]> = new Map()
  private deliveryLog: Map<string, DeliveryRecord[]> = new Map()
  private seenMessageIds: Set<string> = new Set()
  private readonly options: PubSubOptions

  constructor(options: Partial<PubSubOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  // ─── Subscribe ────────────────────────────────────────────────────────────

  subscribe(
    channel: string,
    callback: (message: PubSubMessage) => void,
  ): string {
    const isPattern = channel.includes('*')
    const subId = generateSubId()

    const subscription: Subscription = {
      id: subId,
      channel,
      pattern: isPattern ? channel : null,
      callback,
      createdAt: Date.now(),
    }

    this.subscriptions.set(subId, subscription)

    if (isPattern) {
      let subs = this.patternSubs.get(channel)
      if (!subs) {
        subs = new Set()
        this.patternSubs.set(channel, subs)
      }
      this.checkSubscriptionLimit(channel, subs)
      subs.add(subId)
    } else {
      let subs = this.channelSubs.get(channel)
      if (!subs) {
        subs = new Set()
        this.channelSubs.set(channel, subs)
      }
      this.checkSubscriptionLimit(channel, subs)
      subs.add(subId)
    }

    return subId
  }

  private checkSubscriptionLimit(channel: string, subs: Set<string>): void {
    if (subs.size >= this.options.maxSubscriptionsPerChannel) {
      throw new Error(
        `Limite d'abonnements atteinte pour le canal '${channel}' (max: ${this.options.maxSubscriptionsPerChannel})`,
      )
    }
  }

  // ─── Unsubscribe ──────────────────────────────────────────────────────────

  unsubscribe(subscriptionId: string): boolean {
    const sub = this.subscriptions.get(subscriptionId)
    if (!sub) return false

    this.subscriptions.delete(subscriptionId)

    if (sub.pattern) {
      const subs = this.patternSubs.get(sub.channel)
      if (subs) {
        subs.delete(subscriptionId)
        if (subs.size === 0) this.patternSubs.delete(sub.channel)
      }
    } else {
      const subs = this.channelSubs.get(sub.channel)
      if (subs) {
        subs.delete(subscriptionId)
        if (subs.size === 0) this.channelSubs.delete(sub.channel)
      }
    }

    return true
  }

  unsubscribeAll(channel: string): number {
    let count = 0

    const exactSubs = this.channelSubs.get(channel)
    if (exactSubs) {
      for (const subId of exactSubs) {
        this.subscriptions.delete(subId)
        count++
      }
      this.channelSubs.delete(channel)
    }

    return count
  }

  // ─── Publish ──────────────────────────────────────────────────────────────

  publish(
    channel: string,
    data: unknown,
    publisherId?: string,
  ): PubSubMessage {
    const message: PubSubMessage = {
      id: generateMsgId(),
      channel,
      data,
      timestamp: Date.now(),
      publisherId,
    }

    if (this.seenMessageIds.has(message.id)) {
      return message
    }
    this.seenMessageIds.add(message.id)
    this.trimSeenIds()

    this.addToHistory(channel, message)

    const exactSubs = this.channelSubs.get(channel)
    if (exactSubs) {
      for (const subId of exactSubs) {
        this.deliver(subId, message)
      }
    }

    for (const [pattern, patternSubIds] of this.patternSubs) {
      if (matchPattern(pattern, channel)) {
        for (const subId of patternSubIds) {
          this.deliver(subId, message)
        }
      }
    }

    return message
  }

  private deliver(subscriptionId: string, message: PubSubMessage): void {
    const sub = this.subscriptions.get(subscriptionId)
    if (!sub) return

    sub.callback(message)

    if (this.options.enableDeliveryTracking) {
      const record: DeliveryRecord = {
        messageId: message.id,
        subscriptionId,
        deliveredAt: Date.now(),
        acknowledged: true,
      }

      let records = this.deliveryLog.get(message.id)
      if (!records) {
        records = []
        this.deliveryLog.set(message.id, records)
      }
      records.push(record)
    }
  }

  // ─── History ──────────────────────────────────────────────────────────────

  private addToHistory(channel: string, message: PubSubMessage): void {
    let channelHistory = this.history.get(channel)
    if (!channelHistory) {
      channelHistory = []
      this.history.set(channel, channelHistory)
    }

    channelHistory.push(message)
    if (channelHistory.length > this.options.historyDepth) {
      channelHistory.splice(0, channelHistory.length - this.options.historyDepth)
    }
  }

  getHistory(channel: string, limit?: number): PubSubMessage[] {
    const channelHistory = this.history.get(channel) ?? []
    if (limit && limit < channelHistory.length) {
      return channelHistory.slice(-limit)
    }
    return [...channelHistory]
  }

  clearHistory(channel: string): void {
    this.history.delete(channel)
  }

  // ─── Delivery Tracking ───────────────────────────────────────────────────

  getDeliveryRecords(messageId: string): DeliveryRecord[] {
    return this.deliveryLog.get(messageId) ?? []
  }

  isDelivered(messageId: string, subscriptionId: string): boolean {
    const records = this.deliveryLog.get(messageId)
    if (!records) return false
    return records.some((r) => r.subscriptionId === subscriptionId)
  }

  // ─── Queries ──────────────────────────────────────────────────────────────

  getSubscriptionCount(channel: string): number {
    return this.channelSubs.get(channel)?.size ?? 0
  }

  getChannels(): string[] {
    return Array.from(
      new Set([...this.channelSubs.keys(), ...this.history.keys()]),
    )
  }

  hasSubscribers(channel: string): boolean {
    const exactCount = this.channelSubs.get(channel)?.size ?? 0
    if (exactCount > 0) return true

    for (const pattern of this.patternSubs.keys()) {
      if (matchPattern(pattern, channel)) return true
    }
    return false
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  clear(): void {
    this.subscriptions.clear()
    this.channelSubs.clear()
    this.patternSubs.clear()
    this.history.clear()
    this.deliveryLog.clear()
    this.seenMessageIds.clear()
  }

  private trimSeenIds(): void {
    if (this.seenMessageIds.size > 10_000) {
      const arr = Array.from(this.seenMessageIds)
      const toRemove = arr.slice(0, arr.length - 5_000)
      for (const id of toRemove) {
        this.seenMessageIds.delete(id)
      }
    }
  }
}
