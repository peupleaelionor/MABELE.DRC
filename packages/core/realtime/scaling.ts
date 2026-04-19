// ─── Multi-Instance Coordination ──────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NodeInfo {
  id: string
  host: string
  port: number
  region: string
  startedAt: number
  lastHeartbeat: number
  connectionCount: number
  status: NodeStatus
  metadata: Record<string, unknown>
}

export type NodeStatus = 'ACTIVE' | 'DRAINING' | 'UNHEALTHY' | 'REMOVED'

export interface ForwardedMessage {
  sourceNodeId: string
  targetNodeId: string
  targetUserId: string
  payload: unknown
  timestamp: number
}

export interface ScalingOptions {
  healthCheckIntervalMs: number
  unhealthyThresholdMs: number
  virtualNodes: number
}

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: ScalingOptions = {
  healthCheckIntervalMs: 10_000,
  unhealthyThresholdMs: 30_000,
  virtualNodes: 150,
}

// ─── Consistent Hashing ──────────────────────────────────────────────────────

function hashString(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xffffffff
  }
  return hash >>> 0
}

export class ConsistentHashRing {
  private ring: Map<number, string> = new Map()
  private sortedHashes: number[] = []
  private readonly virtualNodes: number

  constructor(virtualNodes = 150) {
    this.virtualNodes = virtualNodes
  }

  addNode(nodeId: string): void {
    for (let i = 0; i < this.virtualNodes; i++) {
      const hash = hashString(`${nodeId}:${i}`)
      this.ring.set(hash, nodeId)
      this.sortedHashes.push(hash)
    }
    this.sortedHashes.sort((a, b) => a - b)
  }

  removeNode(nodeId: string): void {
    const toRemove: number[] = []
    for (const [hash, id] of this.ring) {
      if (id === nodeId) {
        toRemove.push(hash)
      }
    }
    for (const hash of toRemove) {
      this.ring.delete(hash)
    }
    this.sortedHashes = this.sortedHashes.filter((h) => !toRemove.includes(h))
  }

  getNode(key: string): string | undefined {
    if (this.sortedHashes.length === 0) return undefined

    const hash = hashString(key)
    let idx = this.binarySearch(hash)
    if (idx >= this.sortedHashes.length) {
      idx = 0
    }
    return this.ring.get(this.sortedHashes[idx]!)
  }

  private binarySearch(target: number): number {
    let lo = 0
    let hi = this.sortedHashes.length

    while (lo < hi) {
      const mid = (lo + hi) >>> 1
      if (this.sortedHashes[mid]! < target) {
        lo = mid + 1
      } else {
        hi = mid
      }
    }
    return lo
  }

  getNodeCount(): number {
    const unique = new Set(this.ring.values())
    return unique.size
  }

  clear(): void {
    this.ring.clear()
    this.sortedHashes = []
  }
}

// ─── Node Registry ───────────────────────────────────────────────────────────

export class NodeRegistry {
  private nodes: Map<string, NodeInfo> = new Map()
  private healthCheckTimer: ReturnType<typeof setInterval> | null = null
  private nodeChangeListeners: Array<
    (nodeId: string, status: NodeStatus) => void
  > = []
  private readonly options: ScalingOptions

  constructor(options: Partial<ScalingOptions> = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options }
  }

  register(
    id: string,
    host: string,
    port: number,
    region: string,
    metadata: Record<string, unknown> = {},
  ): NodeInfo {
    const now = Date.now()
    const node: NodeInfo = {
      id,
      host,
      port,
      region,
      startedAt: now,
      lastHeartbeat: now,
      connectionCount: 0,
      status: 'ACTIVE',
      metadata,
    }
    this.nodes.set(id, node)
    this.notifyChange(id, 'ACTIVE')
    return node
  }

  deregister(id: string): boolean {
    const node = this.nodes.get(id)
    if (!node) return false
    node.status = 'REMOVED'
    this.nodes.delete(id)
    this.notifyChange(id, 'REMOVED')
    return true
  }

  heartbeat(id: string, connectionCount?: number): boolean {
    const node = this.nodes.get(id)
    if (!node) return false
    node.lastHeartbeat = Date.now()
    if (connectionCount !== undefined) {
      node.connectionCount = connectionCount
    }
    if (node.status === 'UNHEALTHY') {
      node.status = 'ACTIVE'
      this.notifyChange(id, 'ACTIVE')
    }
    return true
  }

  getNode(id: string): NodeInfo | undefined {
    return this.nodes.get(id)
  }

  getActiveNodes(): NodeInfo[] {
    return Array.from(this.nodes.values()).filter((n) => n.status === 'ACTIVE')
  }

  getNodesByRegion(region: string): NodeInfo[] {
    return Array.from(this.nodes.values()).filter(
      (n) => n.region === region && n.status === 'ACTIVE',
    )
  }

  // ─── Health Monitoring ──────────────────────────────────────────────────

  startHealthChecks(): void {
    this.stopHealthChecks()
    this.healthCheckTimer = setInterval(() => {
      this.checkHealth()
    }, this.options.healthCheckIntervalMs)
  }

  stopHealthChecks(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer)
      this.healthCheckTimer = null
    }
  }

  checkHealth(): string[] {
    const now = Date.now()
    const unhealthy: string[] = []

    for (const [id, node] of this.nodes) {
      if (node.status === 'REMOVED') continue
      const elapsed = now - node.lastHeartbeat
      if (elapsed > this.options.unhealthyThresholdMs) {
        if (node.status !== 'UNHEALTHY') {
          node.status = 'UNHEALTHY'
          this.notifyChange(id, 'UNHEALTHY')
        }
        unhealthy.push(id)
      }
    }

    return unhealthy
  }

  onNodeChange(listener: (nodeId: string, status: NodeStatus) => void): () => void {
    this.nodeChangeListeners.push(listener)
    return () => {
      const idx = this.nodeChangeListeners.indexOf(listener)
      if (idx >= 0) this.nodeChangeListeners.splice(idx, 1)
    }
  }

  private notifyChange(nodeId: string, status: NodeStatus): void {
    for (const listener of this.nodeChangeListeners) {
      listener(nodeId, status)
    }
  }

  clear(): void {
    this.stopHealthChecks()
    this.nodes.clear()
    this.nodeChangeListeners = []
  }
}

// ─── Distributed State ───────────────────────────────────────────────────────

export class DistributedState {
  private userToNode: Map<string, string> = new Map()
  private hashRing: ConsistentHashRing
  private forwardQueue: ForwardedMessage[] = []
  private forwardHandler:
    | ((message: ForwardedMessage) => void)
    | null = null

  constructor(virtualNodes?: number) {
    this.hashRing = new ConsistentHashRing(
      virtualNodes ?? DEFAULT_OPTIONS.virtualNodes,
    )
  }

  // ─── User-Node Mapping ─────────────────────────────────────────────────

  assignUser(userId: string, nodeId: string): void {
    this.userToNode.set(userId, nodeId)
  }

  removeUser(userId: string): boolean {
    return this.userToNode.delete(userId)
  }

  getUserNode(userId: string): string | undefined {
    return this.userToNode.get(userId)
  }

  getNodeUsers(nodeId: string): string[] {
    const users: string[] = []
    for (const [userId, nId] of this.userToNode) {
      if (nId === nodeId) users.push(userId)
    }
    return users
  }

  // ─── Consistent Hashing ────────────────────────────────────────────────

  addNode(nodeId: string): void {
    this.hashRing.addNode(nodeId)
  }

  removeNode(nodeId: string): string[] {
    const affectedUsers = this.getNodeUsers(nodeId)
    this.hashRing.removeNode(nodeId)

    for (const userId of affectedUsers) {
      const newNode = this.hashRing.getNode(userId)
      if (newNode) {
        this.userToNode.set(userId, newNode)
      } else {
        this.userToNode.delete(userId)
      }
    }

    return affectedUsers
  }

  getAssignedNode(userId: string): string | undefined {
    return this.hashRing.getNode(userId)
  }

  // ─── Message Forwarding ────────────────────────────────────────────────

  onForward(handler: (message: ForwardedMessage) => void): void {
    this.forwardHandler = handler
  }

  forward(
    sourceNodeId: string,
    targetUserId: string,
    payload: unknown,
  ): boolean {
    const targetNodeId = this.userToNode.get(targetUserId)
    if (!targetNodeId) return false
    if (targetNodeId === sourceNodeId) return false

    const message: ForwardedMessage = {
      sourceNodeId,
      targetNodeId,
      targetUserId,
      payload,
      timestamp: Date.now(),
    }

    if (this.forwardHandler) {
      this.forwardHandler(message)
    } else {
      this.forwardQueue.push(message)
    }

    return true
  }

  drainForwardQueue(): ForwardedMessage[] {
    const messages = [...this.forwardQueue]
    this.forwardQueue = []
    return messages
  }

  clear(): void {
    this.userToNode.clear()
    this.hashRing.clear()
    this.forwardQueue = []
    this.forwardHandler = null
  }
}
