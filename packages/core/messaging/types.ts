import type { Conversation, ConversationParticipant, Message, User } from '@prisma/client'

// ─── Composite Types ─────────────────────────────────────────────────────────

export type ParticipantWithUser = ConversationParticipant & {
  user: Pick<User, 'id' | 'name' | 'phone' | 'avatar'>
}

export type MessageWithSender = Message & {
  sender: Pick<User, 'id' | 'name' | 'phone' | 'avatar'>
}

export type ConversationWithMessages = Conversation & {
  messages: MessageWithSender[]
  participants: ParticipantWithUser[]
}

export type ConversationWithLastMessage = Conversation & {
  messages: MessageWithSender[]
  participants: ParticipantWithUser[]
}

// ─── Input Types ─────────────────────────────────────────────────────────────

export interface CreateConversationInput {
  listingId?: string
  participantIds: string[]
}

export interface SendMessageInput {
  conversationId: string
  senderId: string
  content: string
  type?: 'TEXT' | 'IMAGE' | 'FILE'
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedMessages {
  messages: MessageWithSender[]
  total: number
  page: number
  limit: number
}
