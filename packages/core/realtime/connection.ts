// ─── Real-time Connection Management ──────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConnectionState =
  | 'CONNECTING'
  | 'CONNECTED'
  | 'RECONNECTING'
  | 'DISCONNECTED'

export interface ConnectionMetadata {
  userId: string
  deviceId: string
  connectedAt: number
  lastPing: number
  state: ConnectionState
  reconnectAttempts: number
  userAgent?: string
  ip?: string
}

export interface ConnectionOptions {
  maxConnectionsPerUser: number
  heartbeatIntervalMs: number
  heartbeatTimeoutMs: number
  maxReconnectAttempts: number
  baseReconnectDelayMs: number
  maxReconnectDelayMs: number
}

export interface OutgoingMessage {
  type: string
  payload: unknown
  timestamp: number
  targetUserId?: string
}

interface ReconnectState {
  attempt: number
  nextRetryAt: number
  timerId: ReturnType<typeof setTimeout> | null
}

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: ConnectionOptions = {
  maxConnectionsPerUser: 5,
  heartbeatIntervalMs: 30_000,
  heartbeatTimeoutMs: 10_000,
  maxReconnectAttempts: 10,
  baseReconnectDelayMs: 1_000,
  maxReconnectDelayMs: 60_000,
}

// ─── Connection Manager ───────────────────────────────────────────────────────

export class ConnectionManager {
  private connections: Map<string, Map<string, ConnectionMetadata>> = new Map()
  private messageHandlers: Map<string, (msg: OutgoingMessage) => void> =
    new Map()
  private reconnectStates: Map<string, ReconnectState> = new Map()
  private heartbeatTimers: Map<string, ReturnType<typeof setInterval>> =
    new Map()
  private stateChangeListeners: Array<
    (
      userId: string,
      deviceId: string,
      oldState: ConnectionState,
      newState: ConnectionState,
    ) => void
  > = []
  private readonly options: ConnectionOptions

  constructor(options: Partial<ConnectionOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  // ─── Registration ─────────────────────────────────────────────────────────

  register(
    userId: string,
    deviceId: string,
    handler: (msg: OutgoingMessage) => void,
    meta?: { userAgent?: string; ip?: string },
  ): ConnectionMetadata {
    let userConns = this.connections.get(userId)
    if (!userConns) {
      userConns = new Map()
      this.connections.set(userId, userConns)
    }

    if (userConns.size >= this.options.maxConnectionsPerUser) {
      const oldest = this.findOldestConnection(userConns)
      if (oldest) {
        this.unregister(userId, oldest)
      }
    }

    const now = Date.now()
    const conn: ConnectionMetadata = {
      userId,
      deviceId,
      connectedAt: now,
      lastPing: now,
      state: 'CONNECTED',
      reconnectAttempts: 0,
      userAgent: meta?.userAgent,
      ip: meta?.ip,
    }

    userConns.set(deviceId, conn)
    const handlerKey = this.handlerKey(userId, deviceId)
    this.messageHandlers.set(handlerKey, handler)
    this.startHeartbeatMonitor(userId, deviceId)
    this.clearReconnectState(userId, deviceId)

    return conn
  }

  unregister(userId: string, deviceId: string): boolean {
    const userConns = this.connections.get(userId)
    if (!userConns) return false

    const conn = userConns.get(deviceId)
    if (!conn) return false

    const oldState = conn.state
    userConns.delete(deviceId)
    if (userConns.size === 0) {
      this.connections.delete(userId)
    }

    const handlerKey = this.handlerKey(userId, deviceId)
    this.messageHandlers.delete(handlerKey)
    this.stopHeartbeatMonitor(userId, deviceId)
    this.clearReconnectState(userId, deviceId)

    if (oldState !== 'DISCONNECTED') {
      this.notifyStateChange(userId, deviceId, oldState, 'DISCONNECTED')
    }

    return true
  }

  // ─── Heartbeat ────────────────────────────────────────────────────────────

  heartbeat(userId: string, deviceId: string): boolean {
    const conn = this.getConnection(userId, deviceId)
    if (!conn) return false

    conn.lastPing = Date.now()

    if (conn.state === 'RECONNECTING') {
      const oldState = conn.state
      conn.state = 'CONNECTED'
      conn.reconnectAttempts = 0
      this.clearReconnectState(userId, deviceId)
      this.notifyStateChange(userId, deviceId, oldState, 'CONNECTED')
    }

    return true
  }

  private startHeartbeatMonitor(userId: string, deviceId: string): void {
    const key = this.handlerKey(userId, deviceId)
    this.stopHeartbeatMonitor(userId, deviceId)

    const timer = setInterval(() => {
      const conn = this.getConnection(userId, deviceId)
      if (!conn) {
        this.stopHeartbeatMonitor(userId, deviceId)
        return
      }

      const elapsed = Date.now() - conn.lastPing
      if (elapsed > this.options.heartbeatTimeoutMs) {
        if (conn.state === 'CONNECTED') {
          this.handleDisconnect(userId, deviceId)
        }
      }
    }, this.options.heartbeatIntervalMs)

    this.heartbeatTimers.set(key, timer)
  }

  private stopHeartbeatMonitor(userId: string, deviceId: string): void {
    const key = this.handlerKey(userId, deviceId)
    const timer = this.heartbeatTimers.get(key)
    if (timer) {
      clearInterval(timer)
      this.heartbeatTimers.delete(key)
    }
  }

  // ─── Reconnect ────────────────────────────────────────────────────────────

  private handleDisconnect(userId: string, deviceId: string): void {
    const conn = this.getConnection(userId, deviceId)
    if (!conn) return

    const oldState = conn.state
    conn.state = 'RECONNECTING'
    this.notifyStateChange(userId, deviceId, oldState, 'RECONNECTING')
    this.scheduleReconnectCheck(userId, deviceId)
  }

  private scheduleReconnectCheck(userId: string, deviceId: string): void {
    const conn = this.getConnection(userId, deviceId)
    if (!conn) return

    conn.reconnectAttempts += 1
    if (conn.reconnectAttempts > this.options.maxReconnectAttempts) {
      const oldState = conn.state
      conn.state = 'DISCONNECTED'
      this.notifyStateChange(userId, deviceId, oldState, 'DISCONNECTED')
      return
    }

    const delay = this.calculateBackoff(conn.reconnectAttempts)
    const key = this.handlerKey(userId, deviceId)

    const timerId = setTimeout(() => {
      const current = this.getConnection(userId, deviceId)
      if (current && current.state === 'RECONNECTING') {
        const elapsed = Date.now() - current.lastPing
        if (elapsed > this.options.heartbeatTimeoutMs) {
          this.scheduleReconnectCheck(userId, deviceId)
        }
      }
    }, delay)

    this.reconnectStates.set(key, {
      attempt: conn.reconnectAttempts,
      nextRetryAt: Date.now() + delay,
      timerId,
    })
  }

  calculateBackoff(attempt: number): number {
    const delay = this.options.baseReconnectDelayMs * Math.pow(2, attempt - 1)
    const jitter = Math.random() * 0.3 * delay
    return Math.min(delay + jitter, this.options.maxReconnectDelayMs)
  }

  private clearReconnectState(userId: string, deviceId: string): void {
    const key = this.handlerKey(userId, deviceId)
    const state = this.reconnectStates.get(key)
    if (state?.timerId) {
      clearTimeout(state.timerId)
    }
    this.reconnectStates.delete(key)
  }

  // ─── Messaging ────────────────────────────────────────────────────────────

  sendToUser(userId: string, message: OutgoingMessage): number {
    const userConns = this.connections.get(userId)
    if (!userConns) return 0

    let sent = 0
    for (const [deviceId, conn] of userConns) {
      if (conn.state !== 'CONNECTED') continue
      const handler = this.messageHandlers.get(
        this.handlerKey(userId, deviceId),
      )
      if (handler) {
        handler({ ...message, timestamp: message.timestamp || Date.now() })
        sent++
      }
    }
    return sent
  }

  broadcast(userIds: string[], message: OutgoingMessage): Map<string, number> {
    const results = new Map<string, number>()
    const stamped = { ...message, timestamp: message.timestamp || Date.now() }

    for (const userId of userIds) {
      const sent = this.sendToUser(userId, stamped)
      results.set(userId, sent)
    }
    return results
  }

  broadcastAll(message: OutgoingMessage): number {
    let total = 0
    const stamped = { ...message, timestamp: message.timestamp || Date.now() }
    for (const userId of this.connections.keys()) {
      total += this.sendToUser(userId, stamped)
    }
    return total
  }

  // ─── State Change Listeners ───────────────────────────────────────────────

  onStateChange(
    listener: (
      userId: string,
      deviceId: string,
      oldState: ConnectionState,
      newState: ConnectionState,
    ) => void,
  ): () => void {
    this.stateChangeListeners.push(listener)
    return () => {
      const idx = this.stateChangeListeners.indexOf(listener)
      if (idx >= 0) this.stateChangeListeners.splice(idx, 1)
    }
  }

  private notifyStateChange(
    userId: string,
    deviceId: string,
    oldState: ConnectionState,
    newState: ConnectionState,
  ): void {
    for (const listener of this.stateChangeListeners) {
      listener(userId, deviceId, oldState, newState)
    }
  }

  // ─── Queries ──────────────────────────────────────────────────────────────

  getConnection(
    userId: string,
    deviceId: string,
  ): ConnectionMetadata | undefined {
    return this.connections.get(userId)?.get(deviceId)
  }

  getUserConnections(userId: string): ConnectionMetadata[] {
    const userConns = this.connections.get(userId)
    return userConns ? Array.from(userConns.values()) : []
  }

  getActiveUserIds(): string[] {
    const ids: string[] = []
    for (const [userId, conns] of this.connections) {
      for (const conn of conns.values()) {
        if (conn.state === 'CONNECTED') {
          ids.push(userId)
          break
        }
      }
    }
    return ids
  }

  isUserConnected(userId: string): boolean {
    const userConns = this.connections.get(userId)
    if (!userConns) return false
    for (const conn of userConns.values()) {
      if (conn.state === 'CONNECTED') return true
    }
    return false
  }

  getConnectionCount(): number {
    let count = 0
    for (const userConns of this.connections.values()) {
      count += userConns.size
    }
    return count
  }

  // ─── Cleanup ──────────────────────────────────────────────────────────────

  disconnectUser(userId: string): number {
    const userConns = this.connections.get(userId)
    if (!userConns) return 0

    const deviceIds = Array.from(userConns.keys())
    for (const deviceId of deviceIds) {
      this.unregister(userId, deviceId)
    }
    return deviceIds.length
  }

  disconnectAll(): void {
    const userIds = Array.from(this.connections.keys())
    for (const userId of userIds) {
      this.disconnectUser(userId)
    }
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private handlerKey(userId: string, deviceId: string): string {
    return `${userId}:${deviceId}`
  }

  private findOldestConnection(
    conns: Map<string, ConnectionMetadata>,
  ): string | null {
    let oldest: string | null = null
    let oldestTime = Infinity

    for (const [deviceId, conn] of conns) {
      if (conn.connectedAt < oldestTime) {
        oldestTime = conn.connectedAt
        oldest = deviceId
      }
    }
    return oldest
  }
}
