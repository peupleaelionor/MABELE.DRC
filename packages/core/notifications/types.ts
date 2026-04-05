import type { Notification } from '@prisma/client'

// ─── Notification Types ──────────────────────────────────────────────────────

export type NotificationType =
  | 'NEW_LISTING'
  | 'JOB_MATCH'
  | 'MESSAGE_RECEIVED'
  | 'PRICE_DROP'
  | 'LISTING_SOLD'
  | 'REVIEW_RECEIVED'
  | 'PAYMENT_CONFIRMED'
  | 'REPORT_UPDATE'
  | 'SYSTEM'

// ─── Input Types ─────────────────────────────────────────────────────────────

export interface CreateNotificationInput {
  userId: string
  type: NotificationType
  titre: string
  message: string
  data?: Record<string, unknown>
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface NotificationPaginationOptions {
  page?: number
  limit?: number
  unreadOnly?: boolean
}

export interface PaginatedNotifications {
  notifications: Notification[]
  total: number
  page: number
  limit: number
}
