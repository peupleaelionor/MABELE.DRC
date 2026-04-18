// ─── Cache distribué ─────────────────────────────────────────────────────────
// Anneau de hachage cohérent, gestion de shards, réplication et basculement
// ──────────────────────────────────────────────────────────────────────────────

import { createHash } from 'crypto'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CacheNode {
  id: string
  host: string
  port: number
  weight: number
  healthy: boolean
  lastHealthCheckAt: number | null
  failureCount: number
}

export interface ShardConfig {
  totalShards: number
  replicationFactor: number
  failoverEnabled: boolean
}

export interface ReplicationResult {
  key: string
  primaryNode: string
  replicaNodes: string[]
  success: boolean
}

export interface NodeHealthStatus {
  nodeId: string
  healthy: boolean
  latencyMs: number | null
  lastCheckAt: number
  consecutiveFailures: number
}

export interface DistributedStats {
  totalNodes: number
  healthyNodes: number
  unhealthyNodes: number
  totalVirtualNodes: number
  keysPerNode: Record<string, number>
}

// ─── HashRing ────────────────────────────────────────────────────────────────

export class HashRing {
  private ring = new Map<number, string>()
  private sortedHashes: number[] = []
  private nodes = new Map<string, CacheNode>()
  private readonly virtualNodesPerNode: number

  constructor(virtualNodesPerNode: number = 150) {
    if (virtualNodesPerNode < 1) {
      throw new Error('Le nombre de nœuds virtuels doit être au minimum 1')
    }
    this.virtualNodesPerNode = virtualNodesPerNode
  }

  addNode(node: CacheNode): void {
    if (this.nodes.has(node.id)) {
      this.removeNode(node.id)
    }

    this.nodes.set(node.id, { ...node })

    const vnodes = this.virtualNodesPerNode * Math.max(1, node.weight)
    for (let i = 0; i < vnodes; i++) {
      const hash = this.hashKey(`${node.id}:vnode:${i}`)
      this.ring.set(hash, node.id)
    }

    this.rebuildSortedHashes()
  }

  removeNode(nodeId: string): boolean {
    if (!this.nodes.has(nodeId)) return false

    this.nodes.delete(nodeId)

    const toRemove: number[] = []
    for (const [hash, id] of this.ring) {
      if (id === nodeId) {
        toRemove.push(hash)
      }
    }

    for (const hash of toRemove) {
      this.ring.delete(hash)
    }

    this.rebuildSortedHashes()
    return true
  }

  getNode(key: string): string | null {
    if (this.sortedHashes.length === 0) return null

    const hash = this.hashKey(key)
    const idx = this.findClosestNode(hash)
    const nodeHash = this.sortedHashes[idx]
    if (nodeHash === undefined) return null

    const nodeId = this.ring.get(nodeHash)
    if (!nodeId) return null

    const node = this.nodes.get(nodeId)
    if (node && !node.healthy) {
      return this.getNextHealthyNode(idx)
    }

    return nodeId
  }

  getNodes(key: string, count: number): string[] {
    if (this.sortedHashes.length === 0) return []

    const hash = this.hashKey(key)
    const startIdx = this.findClosestNode(hash)
    const result: string[] = []
    const seen = new Set<string>()
    const totalNodes = this.nodes.size

    let idx = startIdx
    while (result.length < Math.min(count, totalNodes)) {
      const nodeHash = this.sortedHashes[idx % this.sortedHashes.length]
      if (nodeHash === undefined) break

      const nodeId = this.ring.get(nodeHash)
      if (nodeId && !seen.has(nodeId)) {
        seen.add(nodeId)
        result.push(nodeId)
      }

      idx++
      if (idx - startIdx >= this.sortedHashes.length) break
    }

    return result
  }

  getNodeInfo(nodeId: string): CacheNode | null {
    const node = this.nodes.get(nodeId)
    return node ? { ...node } : null
  }

  getAllNodes(): CacheNode[] {
    return Array.from(this.nodes.values()).map((n) => ({ ...n }))
  }

  getNodeCount(): number {
    return this.nodes.size
  }

  private getNextHealthyNode(startIdx: number): string | null {
    for (let i = 1; i < this.sortedHashes.length; i++) {
      const idx = (startIdx + i) % this.sortedHashes.length
      const nodeHash = this.sortedHashes[idx]
      if (nodeHash === undefined) continue

      const nodeId = this.ring.get(nodeHash)
      if (!nodeId) continue

      const node = this.nodes.get(nodeId)
      if (node?.healthy) return nodeId
    }
    return null
  }

  private findClosestNode(hash: number): number {
    let lo = 0
    let hi = this.sortedHashes.length - 1

    if (hash >= (this.sortedHashes[hi] ?? 0)) return 0

    while (lo < hi) {
      const mid = (lo + hi) >>> 1
      const midVal = this.sortedHashes[mid]
      if (midVal === undefined) break

      if (midVal < hash) {
        lo = mid + 1
      } else {
        hi = mid
      }
    }

    return lo
  }

  private hashKey(key: string): number {
    const digest = createHash('md5').update(key).digest()
    return ((digest[0] ?? 0) << 24) |
      ((digest[1] ?? 0) << 16) |
      ((digest[2] ?? 0) << 8) |
      (digest[3] ?? 0)
  }

  private rebuildSortedHashes(): void {
    this.sortedHashes = Array.from(this.ring.keys()).sort((a, b) => a - b)
  }
}

// ─── Gestionnaire de shards ──────────────────────────────────────────────────

export class ShardManager {
  private readonly ring: HashRing
  private readonly config: Required<ShardConfig>
  private keyAssignments = new Map<string, string[]>()

  constructor(ring: HashRing, config: Partial<ShardConfig> = {}) {
    this.ring = ring
    this.config = {
      totalShards: config.totalShards ?? 16,
      replicationFactor: config.replicationFactor ?? 2,
      failoverEnabled: config.failoverEnabled ?? true,
    }
  }

  getShardForKey(key: string): string | null {
    return this.ring.getNode(key)
  }

  getReplicasForKey(key: string): string[] {
    return this.ring.getNodes(key, this.config.replicationFactor + 1)
  }

  assignKey(key: string): ReplicationResult {
    const nodes = this.ring.getNodes(key, this.config.replicationFactor + 1)

    if (nodes.length === 0) {
      return { key, primaryNode: '', replicaNodes: [], success: false }
    }

    const primary = nodes[0] ?? ''
    const replicas = nodes.slice(1)
    this.keyAssignments.set(key, nodes)

    return {
      key,
      primaryNode: primary,
      replicaNodes: replicas,
      success: true,
    }
  }

  getKeyAssignment(key: string): string[] {
    return this.keyAssignments.get(key) ?? []
  }

  rebalance(): Map<string, string[]> {
    const reassignments = new Map<string, string[]>()

    for (const [key] of this.keyAssignments) {
      const newNodes = this.ring.getNodes(key, this.config.replicationFactor + 1)
      const oldNodes = this.keyAssignments.get(key) ?? []

      const changed = newNodes.length !== oldNodes.length ||
        newNodes.some((n, i) => n !== oldNodes[i])

      if (changed) {
        this.keyAssignments.set(key, newNodes)
        reassignments.set(key, newNodes)
      }
    }

    return reassignments
  }
}

// ─── Suivi de santé des nœuds ────────────────────────────────────────────────

export class NodeHealthTracker {
  private healthStatus = new Map<string, NodeHealthStatus>()
  private readonly maxConsecutiveFailures: number
  private readonly healthCheckIntervalMs: number

  constructor(maxConsecutiveFailures: number = 3, healthCheckIntervalMs: number = 10_000) {
    this.maxConsecutiveFailures = maxConsecutiveFailures
    this.healthCheckIntervalMs = healthCheckIntervalMs
  }

  recordSuccess(nodeId: string, latencyMs: number): NodeHealthStatus {
    const status: NodeHealthStatus = {
      nodeId,
      healthy: true,
      latencyMs,
      lastCheckAt: Date.now(),
      consecutiveFailures: 0,
    }
    this.healthStatus.set(nodeId, status)
    return status
  }

  recordFailure(nodeId: string): NodeHealthStatus {
    const existing = this.healthStatus.get(nodeId)
    const failures = (existing?.consecutiveFailures ?? 0) + 1

    const status: NodeHealthStatus = {
      nodeId,
      healthy: failures < this.maxConsecutiveFailures,
      latencyMs: null,
      lastCheckAt: Date.now(),
      consecutiveFailures: failures,
    }
    this.healthStatus.set(nodeId, status)
    return status
  }

  isHealthy(nodeId: string): boolean {
    const status = this.healthStatus.get(nodeId)
    return status?.healthy ?? true
  }

  getStatus(nodeId: string): NodeHealthStatus | null {
    return this.healthStatus.get(nodeId) ?? null
  }

  getAllStatuses(): NodeHealthStatus[] {
    return Array.from(this.healthStatus.values())
  }

  getUnhealthyNodes(): string[] {
    const unhealthy: string[] = []
    for (const [nodeId, status] of this.healthStatus) {
      if (!status.healthy) {
        unhealthy.push(nodeId)
      }
    }
    return unhealthy
  }

  needsHealthCheck(nodeId: string): boolean {
    const status = this.healthStatus.get(nodeId)
    if (!status) return true
    return Date.now() - status.lastCheckAt >= this.healthCheckIntervalMs
  }

  getDistributedStats(ring: HashRing): DistributedStats {
    const nodes = ring.getAllNodes()
    const healthy = nodes.filter((n) => n.healthy).length

    return {
      totalNodes: nodes.length,
      healthyNodes: healthy,
      unhealthyNodes: nodes.length - healthy,
      totalVirtualNodes: nodes.length * 150,
      keysPerNode: {},
    }
  }
}
