// ─── Room Management ──────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type RoomType = 'CONVERSATION' | 'LISTING' | 'BROADCAST' | 'PRIVATE'

export type RoomPermission = 'READ' | 'WRITE' | 'ADMIN'

export interface RoomMember {
  userId: string
  joinedAt: number
  permissions: RoomPermission[]
}

export interface Room {
  id: string
  name: string
  type: RoomType
  members: Map<string, RoomMember>
  metadata: Record<string, unknown>
  createdAt: number
  createdBy: string
  maxSize: number
}

export interface RoomOptions {
  defaultMaxSize: number
  maxSizeByType: Record<RoomType, number>
  autoCleanupEmptyRooms: boolean
  typingTimeoutMs: number
}

export interface TypingState {
  userId: string
  roomId: string
  startedAt: number
  timerId: ReturnType<typeof setTimeout>
}

// ─── Default Options ──────────────────────────────────────────────────────────

const DEFAULT_OPTIONS: RoomOptions = {
  defaultMaxSize: 100,
  maxSizeByType: {
    CONVERSATION: 2,
    LISTING: 50,
    BROADCAST: 10_000,
    PRIVATE: 10,
  },
  autoCleanupEmptyRooms: true,
  typingTimeoutMs: 5_000,
}

// ─── Room Manager ─────────────────────────────────────────────────────────────

export class RoomManager {
  private rooms: Map<string, Room> = new Map()
  private userRooms: Map<string, Set<string>> = new Map()
  private typingStates: Map<string, Map<string, TypingState>> = new Map()
  private messageHandler:
    | ((userId: string, message: RoomMessage) => void)
    | null = null
  private eventListeners: Array<(event: RoomEvent) => void> = []
  private readonly options: RoomOptions

  constructor(options: Partial<RoomOptions> = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options,
      maxSizeByType: {
        ...DEFAULT_OPTIONS.maxSizeByType,
        ...options.maxSizeByType,
      },
    }
  }

  // ─── Room Lifecycle ───────────────────────────────────────────────────────

  createRoom(
    id: string,
    name: string,
    type: RoomType,
    createdBy: string,
    metadata: Record<string, unknown> = {},
  ): Room {
    if (this.rooms.has(id)) {
      throw new Error(`La salle '${id}' existe déjà`)
    }

    const maxSize = this.options.maxSizeByType[type] ?? this.options.defaultMaxSize

    const room: Room = {
      id,
      name,
      type,
      members: new Map(),
      metadata,
      createdAt: Date.now(),
      createdBy,
      maxSize,
    }

    this.rooms.set(id, room)

    this.join(id, createdBy, ['READ', 'WRITE', 'ADMIN'])
    this.emitEvent({ type: 'ROOM_CREATED', roomId: id, userId: createdBy, timestamp: Date.now() })

    return room
  }

  deleteRoom(roomId: string, requestedBy: string): boolean {
    const room = this.rooms.get(roomId)
    if (!room) return false

    const member = room.members.get(requestedBy)
    if (!member || !member.permissions.includes('ADMIN')) {
      throw new Error('Permission refusée : droits administrateur requis')
    }

    const memberIds = Array.from(room.members.keys())
    for (const userId of memberIds) {
      this.removeUserFromRoom(userId, roomId)
    }

    this.cleanupTyping(roomId)
    this.rooms.delete(roomId)
    this.emitEvent({ type: 'ROOM_DELETED', roomId, userId: requestedBy, timestamp: Date.now() })

    return true
  }

  // ─── Join / Leave ─────────────────────────────────────────────────────────

  join(
    roomId: string,
    userId: string,
    permissions: RoomPermission[] = ['READ', 'WRITE'],
  ): RoomMember {
    const room = this.rooms.get(roomId)
    if (!room) {
      throw new Error(`Salle '${roomId}' introuvable`)
    }

    if (room.members.has(userId)) {
      return room.members.get(userId)!
    }

    if (room.members.size >= room.maxSize) {
      throw new Error(`La salle '${roomId}' est pleine (max: ${room.maxSize})`)
    }

    const member: RoomMember = {
      userId,
      joinedAt: Date.now(),
      permissions,
    }

    room.members.set(userId, member)
    this.trackUserRoom(userId, roomId)
    this.emitEvent({ type: 'MEMBER_JOINED', roomId, userId, timestamp: Date.now() })

    return member
  }

  leave(roomId: string, userId: string): boolean {
    const room = this.rooms.get(roomId)
    if (!room) return false
    if (!room.members.has(userId)) return false

    this.removeUserFromRoom(userId, roomId)
    this.stopTyping(userId, roomId)
    this.emitEvent({ type: 'MEMBER_LEFT', roomId, userId, timestamp: Date.now() })

    if (this.options.autoCleanupEmptyRooms && room.members.size === 0) {
      this.rooms.delete(roomId)
      this.cleanupTyping(roomId)
      this.emitEvent({ type: 'ROOM_DELETED', roomId, userId, timestamp: Date.now() })
    }

    return true
  }

  private removeUserFromRoom(userId: string, roomId: string): void {
    const room = this.rooms.get(roomId)
    if (room) {
      room.members.delete(userId)
    }

    const userRoomSet = this.userRooms.get(userId)
    if (userRoomSet) {
      userRoomSet.delete(roomId)
      if (userRoomSet.size === 0) {
        this.userRooms.delete(userId)
      }
    }
  }

  private trackUserRoom(userId: string, roomId: string): void {
    let roomSet = this.userRooms.get(userId)
    if (!roomSet) {
      roomSet = new Set()
      this.userRooms.set(userId, roomSet)
    }
    roomSet.add(roomId)
  }

  // ─── Messaging ────────────────────────────────────────────────────────────

  onMessage(handler: (userId: string, message: RoomMessage) => void): void {
    this.messageHandler = handler
  }

  broadcastToRoom(
    roomId: string,
    message: RoomMessage,
    excludeUserId?: string,
  ): string[] {
    const room = this.rooms.get(roomId)
    if (!room) {
      throw new Error(`Salle '${roomId}' introuvable`)
    }

    const recipients: string[] = []
    for (const [userId, member] of room.members) {
      if (userId === excludeUserId) continue
      if (!member.permissions.includes('READ')) continue

      if (this.messageHandler) {
        this.messageHandler(userId, message)
      }
      recipients.push(userId)
    }

    return recipients
  }

  // ─── Typing Indicators ───────────────────────────────────────────────────

  startTyping(userId: string, roomId: string): void {
    const room = this.rooms.get(roomId)
    if (!room || !room.members.has(userId)) return

    let roomTyping = this.typingStates.get(roomId)
    if (!roomTyping) {
      roomTyping = new Map()
      this.typingStates.set(roomId, roomTyping)
    }

    const existing = roomTyping.get(userId)
    if (existing) {
      clearTimeout(existing.timerId)
    }

    const timerId = setTimeout(() => {
      this.stopTyping(userId, roomId)
    }, this.options.typingTimeoutMs)

    roomTyping.set(userId, {
      userId,
      roomId,
      startedAt: Date.now(),
      timerId,
    })
  }

  stopTyping(userId: string, roomId: string): void {
    const roomTyping = this.typingStates.get(roomId)
    if (!roomTyping) return

    const state = roomTyping.get(userId)
    if (state) {
      clearTimeout(state.timerId)
      roomTyping.delete(userId)
      if (roomTyping.size === 0) {
        this.typingStates.delete(roomId)
      }
    }
  }

  getTyping(roomId: string): string[] {
    const roomTyping = this.typingStates.get(roomId)
    if (!roomTyping) return []
    return Array.from(roomTyping.keys())
  }

  private cleanupTyping(roomId: string): void {
    const roomTyping = this.typingStates.get(roomId)
    if (roomTyping) {
      for (const state of roomTyping.values()) {
        clearTimeout(state.timerId)
      }
      this.typingStates.delete(roomId)
    }
  }

  // ─── Queries ──────────────────────────────────────────────────────────────

  getRoom(roomId: string): Room | undefined {
    return this.rooms.get(roomId)
  }

  getRoomMembers(roomId: string): RoomMember[] {
    const room = this.rooms.get(roomId)
    return room ? Array.from(room.members.values()) : []
  }

  getUserRooms(userId: string): Room[] {
    const roomIds = this.userRooms.get(userId)
    if (!roomIds) return []

    const rooms: Room[] = []
    for (const roomId of roomIds) {
      const room = this.rooms.get(roomId)
      if (room) rooms.push(room)
    }
    return rooms
  }

  isUserInRoom(userId: string, roomId: string): boolean {
    const room = this.rooms.get(roomId)
    return room ? room.members.has(userId) : false
  }

  hasPermission(
    userId: string,
    roomId: string,
    permission: RoomPermission,
  ): boolean {
    const room = this.rooms.get(roomId)
    if (!room) return false
    const member = room.members.get(userId)
    return member ? member.permissions.includes(permission) : false
  }

  getRoomCount(): number {
    return this.rooms.size
  }

  // ─── Events ───────────────────────────────────────────────────────────────

  onEvent(listener: (event: RoomEvent) => void): () => void {
    this.eventListeners.push(listener)
    return () => {
      const idx = this.eventListeners.indexOf(listener)
      if (idx >= 0) this.eventListeners.splice(idx, 1)
    }
  }

  private emitEvent(event: RoomEvent): void {
    for (const listener of this.eventListeners) {
      listener(event)
    }
  }
}

// ─── Supporting Types ─────────────────────────────────────────────────────────

export interface RoomMessage {
  type: string
  payload: unknown
  senderId: string
  timestamp: number
}

export interface RoomEvent {
  type: 'ROOM_CREATED' | 'ROOM_DELETED' | 'MEMBER_JOINED' | 'MEMBER_LEFT'
  roomId: string
  userId: string
  timestamp: number
}
