import type { PrismaClient, Notification, Prisma } from '@prisma/client'
import type {
  CreateNotificationInput,
  NotificationPaginationOptions,
  PaginatedNotifications,
} from './types'

// ─── Create Notification ─────────────────────────────────────────────────────

export async function createNotification(
  prisma: PrismaClient,
  input: CreateNotificationInput,
): Promise<Notification> {
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      type: input.type,
      titre: input.titre,
      message: input.message,
      data: (input.data as Prisma.InputJsonValue) ?? undefined,
    },
  })

  return notification
}

// ─── Get User Notifications ──────────────────────────────────────────────────

export async function getUserNotifications(
  prisma: PrismaClient,
  userId: string,
  options: NotificationPaginationOptions = {},
): Promise<PaginatedNotifications> {
  const page = Math.max(1, options.page ?? 1)
  const limit = Math.min(100, Math.max(1, options.limit ?? 20))
  const skip = (page - 1) * limit

  const where: { userId: string; read?: boolean } = { userId }
  if (options.unreadOnly) {
    where.read = false
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.notification.count({ where }),
  ])

  return { notifications, total, page, limit }
}

// ─── Mark As Read ────────────────────────────────────────────────────────────

export async function markAsRead(
  prisma: PrismaClient,
  notificationId: string,
): Promise<Notification> {
  const notification = await prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  })

  return notification
}

// ─── Mark All As Read ────────────────────────────────────────────────────────

export async function markAllAsRead(
  prisma: PrismaClient,
  userId: string,
): Promise<{ count: number }> {
  const result = await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  })

  return { count: result.count }
}

// ─── Get Unread Count ────────────────────────────────────────────────────────

export async function getUnreadCount(
  prisma: PrismaClient,
  userId: string,
): Promise<number> {
  const count = await prisma.notification.count({
    where: { userId, read: false },
  })

  return count
}

// ─── Delete Notification ─────────────────────────────────────────────────────

export async function deleteNotification(
  prisma: PrismaClient,
  notificationId: string,
  userId: string,
): Promise<Notification> {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
  })

  if (!notification) {
    throw new Error('Notification introuvable')
  }

  if (notification.userId !== userId) {
    throw new Error("Vous n'êtes pas autorisé à supprimer cette notification")
  }

  const deleted = await prisma.notification.delete({
    where: { id: notificationId },
  })

  return deleted
}
