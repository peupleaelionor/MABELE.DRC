export type {
  ConversationWithMessages,
  ConversationWithLastMessage,
  MessageWithSender,
  ParticipantWithUser,
  CreateConversationInput,
  SendMessageInput,
  PaginatedMessages,
} from './types'

export {
  createConversation,
  sendMessage,
  getConversationMessages,
  getUserConversations,
  markMessagesAsRead,
  getUnreadCount,
} from './service'
