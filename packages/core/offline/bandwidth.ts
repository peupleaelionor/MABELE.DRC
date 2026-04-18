// ─── Network Quality Detection for DRC ───────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type NetworkQuality =
  | 'OFFLINE'
  | 'SLOW_2G'
  | '2G'
  | '3G'
  | '4G'
  | 'WIFI'

export interface BandwidthProfile {
  quality: NetworkQuality
  estimatedKbps: number
  rttMs: number
  measuredAt: number
  connectionType: string
}

export interface AdaptiveSettings {
  imageQuality: number
  pageSize: number
  syncIntervalMs: number
  enablePrefetch: boolean
  enableAnimations: boolean
  maxUploadSizeBytes: number
}

export interface BandwidthMonitorOptions {
  sampleIntervalMs: number
  sampleCount: number
  slowThresholdKbps: number
}

export type BandwidthCallback = (profile: BandwidthProfile) => void

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_MONITOR_OPTIONS: BandwidthMonitorOptions = {
  sampleIntervalMs: 30_000,
  sampleCount: 10,
  slowThresholdKbps: 100,
}

// ─── Quality Thresholds ──────────────────────────────────────────────────────

const QUALITY_THRESHOLDS: Array<{ maxKbps: number; quality: NetworkQuality }> = [
  { maxKbps: 0, quality: 'OFFLINE' },
  { maxKbps: 50, quality: 'SLOW_2G' },
  { maxKbps: 150, quality: '2G' },
  { maxKbps: 2_000, quality: '3G' },
  { maxKbps: 10_000, quality: '4G' },
  { maxKbps: Infinity, quality: 'WIFI' },
]

// ─── Bandwidth Detection ─────────────────────────────────────────────────────

export function classifyBandwidth(kbps: number): NetworkQuality {
  if (kbps <= 0) return 'OFFLINE'
  for (const threshold of QUALITY_THRESHOLDS) {
    if (kbps <= threshold.maxKbps) {
      return threshold.quality
    }
  }
  return 'WIFI'
}

export function detectBandwidth(
  bytesTransferred: number,
  durationMs: number,
  rttMs = 0,
  connectionType = 'unknown',
): BandwidthProfile {
  if (durationMs <= 0) {
    return {
      quality: 'OFFLINE',
      estimatedKbps: 0,
      rttMs,
      measuredAt: Date.now(),
      connectionType,
    }
  }

  const kbps = (bytesTransferred * 8) / durationMs
  const quality = classifyBandwidth(kbps)

  return {
    quality,
    estimatedKbps: Math.round(kbps),
    rttMs,
    measuredAt: Date.now(),
    connectionType,
  }
}

export function detectConnectionType(effectiveType?: string): NetworkQuality {
  if (!effectiveType) return '3G'

  const mapping: Record<string, NetworkQuality> = {
    'slow-2g': 'SLOW_2G',
    '2g': '2G',
    '3g': '3G',
    '4g': '4G',
  }

  return mapping[effectiveType] ?? '3G'
}

// ─── Bandwidth Monitor ───────────────────────────────────────────────────────

export class BandwidthMonitor {
  private samples: Array<{ kbps: number; timestamp: number }> = []
  private currentProfile: BandwidthProfile | null = null
  private listeners: BandwidthCallback[] = []
  private monitorTimer: ReturnType<typeof setInterval> | null = null
  private readonly options: BandwidthMonitorOptions

  constructor(options: Partial<BandwidthMonitorOptions> = {}) {
    this.options = { ...DEFAULT_MONITOR_OPTIONS, ...options }
  }

  addSample(bytesTransferred: number, durationMs: number): void {
    if (durationMs <= 0) return

    const kbps = (bytesTransferred * 8) / durationMs
    this.samples.push({ kbps, timestamp: Date.now() })

    if (this.samples.length > this.options.sampleCount) {
      this.samples.shift()
    }

    this.updateProfile()
  }

  private updateProfile(): void {
    if (this.samples.length === 0) return

    const sorted = [...this.samples].sort((a, b) => a.kbps - b.kbps)
    const medianIdx = Math.floor(sorted.length / 2)
    const medianKbps = sorted[medianIdx]!.kbps
    const quality = classifyBandwidth(medianKbps)

    const newProfile: BandwidthProfile = {
      quality,
      estimatedKbps: Math.round(medianKbps),
      rttMs: 0,
      measuredAt: Date.now(),
      connectionType: 'measured',
    }

    const changed =
      !this.currentProfile || this.currentProfile.quality !== quality

    this.currentProfile = newProfile

    if (changed) {
      this.notifyListeners(newProfile)
    }
  }

  getProfile(): BandwidthProfile | null {
    return this.currentProfile
  }

  getQuality(): NetworkQuality {
    return this.currentProfile?.quality ?? '3G'
  }

  onChange(callback: BandwidthCallback): () => void {
    this.listeners.push(callback)
    return () => {
      const idx = this.listeners.indexOf(callback)
      if (idx >= 0) this.listeners.splice(idx, 1)
    }
  }

  private notifyListeners(profile: BandwidthProfile): void {
    for (const listener of this.listeners) {
      listener(profile)
    }
  }

  startMonitoring(measureFn: () => { bytes: number; durationMs: number }): void {
    this.stopMonitoring()
    this.monitorTimer = setInterval(() => {
      const result = measureFn()
      this.addSample(result.bytes, result.durationMs)
    }, this.options.sampleIntervalMs)
  }

  stopMonitoring(): void {
    if (this.monitorTimer) {
      clearInterval(this.monitorTimer)
      this.monitorTimer = null
    }
  }

  reset(): void {
    this.stopMonitoring()
    this.samples = []
    this.currentProfile = null
  }
}

// ─── Adaptive Behavior ───────────────────────────────────────────────────────

export function getAdaptiveSettings(quality: NetworkQuality): AdaptiveSettings {
  const settings: Record<NetworkQuality, AdaptiveSettings> = {
    OFFLINE: {
      imageQuality: 0,
      pageSize: 5,
      syncIntervalMs: 0,
      enablePrefetch: false,
      enableAnimations: false,
      maxUploadSizeBytes: 0,
    },
    SLOW_2G: {
      imageQuality: 0.2,
      pageSize: 5,
      syncIntervalMs: 120_000,
      enablePrefetch: false,
      enableAnimations: false,
      maxUploadSizeBytes: 512 * 1024,
    },
    '2G': {
      imageQuality: 0.4,
      pageSize: 10,
      syncIntervalMs: 60_000,
      enablePrefetch: false,
      enableAnimations: false,
      maxUploadSizeBytes: 1024 * 1024,
    },
    '3G': {
      imageQuality: 0.6,
      pageSize: 20,
      syncIntervalMs: 30_000,
      enablePrefetch: true,
      enableAnimations: true,
      maxUploadSizeBytes: 5 * 1024 * 1024,
    },
    '4G': {
      imageQuality: 0.85,
      pageSize: 30,
      syncIntervalMs: 15_000,
      enablePrefetch: true,
      enableAnimations: true,
      maxUploadSizeBytes: 25 * 1024 * 1024,
    },
    WIFI: {
      imageQuality: 1.0,
      pageSize: 50,
      syncIntervalMs: 10_000,
      enablePrefetch: true,
      enableAnimations: true,
      maxUploadSizeBytes: 100 * 1024 * 1024,
    },
  }

  return settings[quality]
}

export function getOptimalBatchSize(quality: NetworkQuality): number {
  const sizes: Record<NetworkQuality, number> = {
    OFFLINE: 0,
    SLOW_2G: 5,
    '2G': 10,
    '3G': 25,
    '4G': 50,
    WIFI: 100,
  }
  return sizes[quality]
}

export function getOptimalImageQuality(quality: NetworkQuality): number {
  return getAdaptiveSettings(quality).imageQuality
}

// ─── Data Saver Mode ─────────────────────────────────────────────────────────

export interface DataSaverConfig {
  enabled: boolean
  maxImageWidth: number
  disableAutoplay: boolean
  reduceAnimations: boolean
  compressRequests: boolean
}

export function getDataSaverConfig(quality: NetworkQuality): DataSaverConfig {
  const shouldSave =
    quality === 'OFFLINE' ||
    quality === 'SLOW_2G' ||
    quality === '2G'

  return {
    enabled: shouldSave,
    maxImageWidth: shouldSave ? 480 : quality === '3G' ? 800 : 1200,
    disableAutoplay: shouldSave,
    reduceAnimations: shouldSave || quality === '3G',
    compressRequests: quality !== 'WIFI',
  }
}
