// ─── Message Compression for Low-Bandwidth Networks ──────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type BandwidthProfile = 'LOW_2G' | 'EDGE' | '3G' | '4G' | 'WIFI'

export interface CompressionOptions {
  enableDictionary: boolean
  minSizeForCompression: number
  adaptiveThresholds: Record<BandwidthProfile, number>
}

export interface CompressionResult {
  data: string
  originalSize: number
  compressedSize: number
  compressionRatio: number
  method: 'dictionary' | 'abbreviation' | 'none'
}

export interface BandwidthEstimate {
  profile: BandwidthProfile
  estimatedKbps: number
  measuredAt: number
  sampleCount: number
}

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: CompressionOptions = {
  enableDictionary: true,
  minSizeForCompression: 64,
  adaptiveThresholds: {
    LOW_2G: 0,
    EDGE: 128,
    '3G': 256,
    '4G': 1024,
    WIFI: 4096,
  },
}

// ─── Field Dictionary ─────────────────────────────────────────────────────────

const FIELD_DICTIONARY: Record<string, string> = {
  timestamp: '_t',
  type: '_y',
  payload: '_p',
  sender: '_s',
  roomId: '_r',
  messageId: '_m',
  userId: '_u',
  deviceId: '_d',
  status: '_st',
  content: '_c',
  metadata: '_md',
  priority: '_pr',
  version: '_v',
  id: '_i',
  createdAt: '_ca',
  updatedAt: '_ua',
  name: '_n',
  description: '_dc',
  amount: '_am',
  currency: '_cu',
  latitude: '_la',
  longitude: '_lo',
}

const REVERSE_DICTIONARY: Record<string, string> = {}
for (const [full, short] of Object.entries(FIELD_DICTIONARY)) {
  REVERSE_DICTIONARY[short] = full
}

// ─── Compression Functions ────────────────────────────────────────────────────

export function compressMessage(
  message: unknown,
  options: Partial<CompressionOptions> = {},
): CompressionResult {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const original = JSON.stringify(message)
  const originalSize = original.length

  if (originalSize < opts.minSizeForCompression) {
    return {
      data: original,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1,
      method: 'none',
    }
  }

  if (opts.enableDictionary && typeof message === 'object' && message !== null) {
    const compressed = compressWithDictionary(message)
    const compressedStr = JSON.stringify(compressed)
    const compressedSize = compressedStr.length

    if (compressedSize < originalSize) {
      return {
        data: compressedStr,
        originalSize,
        compressedSize,
        compressionRatio: compressedSize / originalSize,
        method: 'dictionary',
      }
    }
  }

  const abbreviated = abbreviateValues(original)
  const abbreviatedSize = abbreviated.length

  if (abbreviatedSize < originalSize) {
    return {
      data: abbreviated,
      originalSize,
      compressedSize: abbreviatedSize,
      compressionRatio: abbreviatedSize / originalSize,
      method: 'abbreviation',
    }
  }

  return {
    data: original,
    originalSize,
    compressedSize: originalSize,
    compressionRatio: 1,
    method: 'none',
  }
}

export function decompressMessage(data: string, method: CompressionResult['method']): unknown {
  if (method === 'none') {
    return JSON.parse(data)
  }

  if (method === 'dictionary') {
    const compressed = JSON.parse(data)
    return decompressWithDictionary(compressed)
  }

  if (method === 'abbreviation') {
    const expanded = expandValues(data)
    return JSON.parse(expanded)
  }

  return JSON.parse(data)
}

// ─── Dictionary Compression ──────────────────────────────────────────────────

function compressWithDictionary(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => compressWithDictionary(item))
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const shortKey = FIELD_DICTIONARY[key] ?? key
    result[shortKey] =
      typeof value === 'object' ? compressWithDictionary(value) : value
  }
  return result
}

function decompressWithDictionary(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map((item) => decompressWithDictionary(item))
  }

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const fullKey = REVERSE_DICTIONARY[key] ?? key
    result[fullKey] =
      typeof value === 'object' ? decompressWithDictionary(value) : value
  }
  return result
}

// ─── Value Abbreviation ───────────────────────────────────────────────────────

const VALUE_ABBREVIATIONS: Record<string, string> = {
  '"ONLINE"': '"ON"',
  '"OFFLINE"': '"OF"',
  '"AWAY"': '"AW"',
  '"CONNECTED"': '"CO"',
  '"DISCONNECTED"': '"DC"',
  '"RECONNECTING"': '"RC"',
  '"MESSAGE_NEW"': '"MN"',
  '"MESSAGE_READ"': '"MR"',
  '"TYPING_START"': '"TS"',
  '"TYPING_STOP"': '"TP"',
  '"PRESENCE_CHANGE"': '"PC"',
}

const REVERSE_ABBREVIATIONS: Record<string, string> = {}
for (const [full, short] of Object.entries(VALUE_ABBREVIATIONS)) {
  REVERSE_ABBREVIATIONS[short] = full
}

function abbreviateValues(json: string): string {
  let result = json
  for (const [full, short] of Object.entries(VALUE_ABBREVIATIONS)) {
    result = result.split(full).join(short)
  }
  return result
}

function expandValues(json: string): string {
  let result = json
  for (const [short, full] of Object.entries(REVERSE_ABBREVIATIONS)) {
    result = result.split(short).join(full)
  }
  return result
}

// ─── Bandwidth Estimation ─────────────────────────────────────────────────────

export class BandwidthEstimator {
  private samples: number[] = []
  private readonly maxSamples: number

  constructor(maxSamples = 20) {
    this.maxSamples = maxSamples
  }

  addSample(bytesTransferred: number, durationMs: number): void {
    if (durationMs <= 0) return
    const kbps = (bytesTransferred * 8) / durationMs
    this.samples.push(kbps)
    if (this.samples.length > this.maxSamples) {
      this.samples.shift()
    }
  }

  estimate(): BandwidthEstimate {
    if (this.samples.length === 0) {
      return {
        profile: '3G',
        estimatedKbps: 0,
        measuredAt: Date.now(),
        sampleCount: 0,
      }
    }

    const sorted = [...this.samples].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]!

    return {
      profile: classifyBandwidth(median),
      estimatedKbps: Math.round(median),
      measuredAt: Date.now(),
      sampleCount: this.samples.length,
    }
  }

  reset(): void {
    this.samples = []
  }
}

function classifyBandwidth(kbps: number): BandwidthProfile {
  if (kbps < 50) return 'LOW_2G'
  if (kbps < 200) return 'EDGE'
  if (kbps < 2000) return '3G'
  if (kbps < 10000) return '4G'
  return 'WIFI'
}

// ─── Adaptive Compression ─────────────────────────────────────────────────────

export function shouldCompress(
  messageSize: number,
  profile: BandwidthProfile,
  options: Partial<CompressionOptions> = {},
): boolean {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  const threshold = opts.adaptiveThresholds[profile]
  return messageSize >= threshold
}

export function getOptimalPayloadSize(profile: BandwidthProfile): number {
  const sizes: Record<BandwidthProfile, number> = {
    LOW_2G: 1_024,
    EDGE: 4_096,
    '3G': 16_384,
    '4G': 65_536,
    WIFI: 262_144,
  }
  return sizes[profile]
}

export function getRecommendedImageQuality(profile: BandwidthProfile): number {
  const qualities: Record<BandwidthProfile, number> = {
    LOW_2G: 0.2,
    EDGE: 0.4,
    '3G': 0.6,
    '4G': 0.8,
    WIFI: 1.0,
  }
  return qualities[profile]
}
