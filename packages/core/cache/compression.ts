// ─── Compression de cache ────────────────────────────────────────────────────
// Compression adaptative avec gzip, deflate, brotli via Node.js zlib
// ──────────────────────────────────────────────────────────────────────────────

import {
  gzipSync,
  gunzipSync,
  deflateSync,
  inflateSync,
  brotliCompressSync,
  brotliDecompressSync,
} from 'zlib'

// ─── Types ───────────────────────────────────────────────────────────────────

export type CompressionAlgorithm = 'gzip' | 'deflate' | 'brotli'

export interface CompressedCacheEntry {
  data: string
  algorithm: CompressionAlgorithm
  originalSize: number
  compressedSize: number
  compressionRatio: number
  compressedAt: number
}

export interface CompressionConfig {
  defaultAlgorithm?: CompressionAlgorithm
  minSizeBytes?: number
  ratioThreshold?: number
  preferredAlgorithm?: Record<string, CompressionAlgorithm>
}

export interface CompressionStats {
  totalCompressed: number
  totalDecompressed: number
  totalOriginalBytes: number
  totalCompressedBytes: number
  averageRatio: number
  byAlgorithm: Record<CompressionAlgorithm, AlgorithmStats>
}

export interface AlgorithmStats {
  count: number
  totalOriginalBytes: number
  totalCompressedBytes: number
  averageRatio: number
}

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEFAULT_CONFIG: Required<Omit<CompressionConfig, 'preferredAlgorithm'>> = {
  defaultAlgorithm: 'gzip',
  minSizeBytes: 256,
  ratioThreshold: 0.9,
}

// ─── Fonctions de compression ────────────────────────────────────────────────

export function compress(
  data: string | Buffer,
  algorithm: CompressionAlgorithm = 'gzip',
): CompressedCacheEntry {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf8') : data
  const originalSize = input.length

  if (originalSize === 0) {
    throw new Error('Les données à compresser ne peuvent pas être vides')
  }

  let compressed: Buffer

  switch (algorithm) {
    case 'gzip':
      compressed = gzipSync(input)
      break
    case 'deflate':
      compressed = deflateSync(input)
      break
    case 'brotli':
      compressed = brotliCompressSync(input)
      break
    default:
      throw new Error(`Algorithme de compression non supporté : ${algorithm as string}`)
  }

  const compressedSize = compressed.length
  const compressionRatio = compressedSize / originalSize

  return {
    data: compressed.toString('base64'),
    algorithm,
    originalSize,
    compressedSize,
    compressionRatio,
    compressedAt: Date.now(),
  }
}

export function decompress(entry: CompressedCacheEntry): Buffer {
  if (!entry.data) {
    throw new Error('Les données compressées sont manquantes')
  }

  const input = Buffer.from(entry.data, 'base64')

  switch (entry.algorithm) {
    case 'gzip':
      return gunzipSync(input)
    case 'deflate':
      return inflateSync(input)
    case 'brotli':
      return brotliDecompressSync(input)
    default:
      throw new Error(`Algorithme de décompression non supporté : ${entry.algorithm as string}`)
  }
}

export function decompressToString(entry: CompressedCacheEntry): string {
  return decompress(entry).toString('utf8')
}

// ─── Compression adaptative ─────────────────────────────────────────────────

export function adaptiveCompress(
  data: string | Buffer,
  config: CompressionConfig = {},
): CompressedCacheEntry | null {
  const input = typeof data === 'string' ? Buffer.from(data, 'utf8') : data
  const minSize = config.minSizeBytes ?? DEFAULT_CONFIG.minSizeBytes
  const ratioThreshold = config.ratioThreshold ?? DEFAULT_CONFIG.ratioThreshold

  if (input.length < minSize) {
    return null
  }

  const algorithm = chooseBestAlgorithm(input, config)
  const result = compress(input, algorithm)

  if (result.compressionRatio > ratioThreshold) {
    return null
  }

  return result
}

function chooseBestAlgorithm(
  data: Buffer,
  config: CompressionConfig,
): CompressionAlgorithm {
  if (data.length < 1024) {
    return config.defaultAlgorithm ?? 'deflate'
  }

  if (data.length > 10_240) {
    return 'brotli'
  }

  return config.defaultAlgorithm ?? 'gzip'
}

// ─── Suivi des statistiques ──────────────────────────────────────────────────

export class CompressionTracker {
  private stats: CompressionStats = {
    totalCompressed: 0,
    totalDecompressed: 0,
    totalOriginalBytes: 0,
    totalCompressedBytes: 0,
    averageRatio: 0,
    byAlgorithm: {
      gzip: { count: 0, totalOriginalBytes: 0, totalCompressedBytes: 0, averageRatio: 0 },
      deflate: { count: 0, totalOriginalBytes: 0, totalCompressedBytes: 0, averageRatio: 0 },
      brotli: { count: 0, totalOriginalBytes: 0, totalCompressedBytes: 0, averageRatio: 0 },
    },
  }

  recordCompression(entry: CompressedCacheEntry): void {
    this.stats.totalCompressed++
    this.stats.totalOriginalBytes += entry.originalSize
    this.stats.totalCompressedBytes += entry.compressedSize
    this.stats.averageRatio = this.stats.totalCompressedBytes / this.stats.totalOriginalBytes

    const algoStats = this.stats.byAlgorithm[entry.algorithm]
    algoStats.count++
    algoStats.totalOriginalBytes += entry.originalSize
    algoStats.totalCompressedBytes += entry.compressedSize
    algoStats.averageRatio = algoStats.totalCompressedBytes / algoStats.totalOriginalBytes
  }

  recordDecompression(): void {
    this.stats.totalDecompressed++
  }

  getStats(): CompressionStats {
    return { ...this.stats }
  }

  getBestAlgorithm(): CompressionAlgorithm | null {
    const algorithms: CompressionAlgorithm[] = ['gzip', 'deflate', 'brotli']
    let best: CompressionAlgorithm | null = null
    let bestRatio = Infinity

    for (const algo of algorithms) {
      const algoStats = this.stats.byAlgorithm[algo]
      if (algoStats.count > 0 && algoStats.averageRatio < bestRatio) {
        bestRatio = algoStats.averageRatio
        best = algo
      }
    }

    return best
  }

  reset(): void {
    this.stats = {
      totalCompressed: 0,
      totalDecompressed: 0,
      totalOriginalBytes: 0,
      totalCompressedBytes: 0,
      averageRatio: 0,
      byAlgorithm: {
        gzip: { count: 0, totalOriginalBytes: 0, totalCompressedBytes: 0, averageRatio: 0 },
        deflate: { count: 0, totalOriginalBytes: 0, totalCompressedBytes: 0, averageRatio: 0 },
        brotli: { count: 0, totalOriginalBytes: 0, totalCompressedBytes: 0, averageRatio: 0 },
      },
    }
  }
}
