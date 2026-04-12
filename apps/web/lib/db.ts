import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { _prisma: PrismaClient | undefined }

export const db =
  globalForPrisma._prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma._prisma = db

export default db
