export type {
  NotificationType,
  CreateNotificationInput,
  NotificationPaginationOptions,
  PaginatedNotifications,
} from './types'

export {
  createNotification,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification,
} from './service'
