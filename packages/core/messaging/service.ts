import type { PrismaClient } from '@prisma/client'
import type {
  CreateConversationInput,
  SendMessageInput,
  MessageWithSender,
  ConversationWithMessages,
  ConversationWithLastMessage,
  PaginatedMessages,
} from './types'

// ─── Reusable Includes ───────────────────────────────────────────────────────

const userSelect = {
  id: true,
  name: true,
  phone: true,
  avatar: true,
} as const

const messageWithSenderInclude = {
  sender: { select: userSelect },
} as const

const participantWithUserInclude = {
  user: { select: userSelect },
} as const

// ─── Create Conversation ─────────────────────────────────────────────────────

export async function createConversation(
  prisma: PrismaClient,
  input: CreateConversationInput,
): Promise<ConversationWithMessages> {
  const { listingId, participantIds } = input

  if (participantIds.length < 2) {
    throw new Error('Une conversation nécessite au moins 2 participants')
  }

  const uniqueIds = Array.from(new Set(participantIds))

  const conversation = await prisma.conversation.create({
    data: {
      listingId: listingId ?? null,
      participants: {
        create: uniqueIds.map((userId) => ({ userId })),
      },
    },
    include: {
      participants: { include: participantWithUserInclude },
      messages: { include: messageWithSenderInclude },
    },
  })

  return conversation as ConversationWithMessages
}

// ─── Send Message ────────────────────────────────────────────────────────────

export async function sendMessage(
  prisma: PrismaClient,
  input: SendMessageInput,
): Promise<MessageWithSender> {
  const { conversationId, senderId, content, type } = input

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: senderId },
    },
  })

  if (!participant) {
    throw new Error("L'expéditeur n'est pas un participant de cette conversation")
  }

  const message = await prisma.message.create({
    data: {
      conversationId,
      senderId,
      content,
      type: type ?? 'TEXT',
    },
    include: messageWithSenderInclude,
  })

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  })

  return message as MessageWithSender
}

// ─── Get Conversation Messages ───────────────────────────────────────────────

export async function getConversationMessages(
  prisma: PrismaClient,
  conversationId: string,
  options: { page?: number; limit?: number } = {},
): Promise<PaginatedMessages> {
  const page = Math.max(1, options.page ?? 1)
  const limit = Math.min(100, Math.max(1, options.limit ?? 20))
  const skip = (page - 1) * limit

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { conversationId },
      include: messageWithSenderInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.message.count({ where: { conversationId } }),
  ])

  return {
    messages: messages as MessageWithSender[],
    total,
    page,
    limit,
  }
}

// ─── Get User Conversations ──────────────────────────────────────────────────

export async function getUserConversations(
  prisma: PrismaClient,
  userId: string,
): Promise<ConversationWithLastMessage[]> {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: {
      participants: { include: participantWithUserInclude },
      messages: {
        include: messageWithSenderInclude,
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return conversations as ConversationWithLastMessage[]
}

// ─── Mark Messages As Read ───────────────────────────────────────────────────

export async function markMessagesAsRead(
  prisma: PrismaClient,
  conversationId: string,
  userId: string,
): Promise<{ count: number }> {
  const result = await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      read: false,
    },
    data: { read: true },
  })

  return { count: result.count }
}

// ─── Get Unread Count ────────────────────────────────────────────────────────

export async function getUnreadCount(
  prisma: PrismaClient,
  userId: string,
): Promise<number> {
  const participantConversations = await prisma.conversationParticipant.findMany({
    where: { userId },
    select: { conversationId: true },
  })

  const conversationIds = participantConversations.map((p) => p.conversationId)

  if (conversationIds.length === 0) return 0

  const count = await prisma.message.count({
    where: {
      conversationId: { in: conversationIds },
      senderId: { not: userId },
      read: false,
    },
  })

  return count
}
