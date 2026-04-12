import type { PrismaClient } from '@prisma/client'
import { logger } from '../logger/index'
import { emitEvent } from '../events/bus'

// ─── Wallet Service ───────────────────────────────────────────────────────────

const log = logger.child({ module: 'wallet' })

export async function getOrCreateWallet(prisma: PrismaClient, userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } })
  if (wallet) return wallet

  return prisma.wallet.create({
    data: { userId, balance: 0, currency: 'USD', status: 'ACTIVE' },
  })
}

export async function creditWallet(
  prisma: PrismaClient,
  userId: string,
  amount: number,
  opts: {
    type: string
    description?: string
    reference?: string
    metadata?: Record<string, unknown>
  },
) {
  if (amount <= 0) throw new Error('Le montant doit être positif')

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } })

    if (wallet.status !== 'ACTIVE') {
      throw new Error('Portefeuille non actif')
    }

    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { increment: amount } },
    })

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: opts.type as never,
        amount,
        currency: wallet.currency,
        balanceBefore: wallet.balance,
        balanceAfter: updated.balance,
        description: opts.description ?? null,
        reference: opts.reference ?? null,
        metadata: (opts.metadata ?? null) as never,
      },
    })

    log.info('Wallet credited', { userId, amount })
    await emitEvent('wallet.credited', { userId, amount, currency: wallet.currency }, { userId })

    return updated
  })
}

export async function debitWallet(
  prisma: PrismaClient,
  userId: string,
  amount: number,
  opts: {
    type: string
    description?: string
    reference?: string
    metadata?: Record<string, unknown>
  },
) {
  if (amount <= 0) throw new Error('Le montant doit être positif')

  return prisma.$transaction(async (tx) => {
    const wallet = await tx.wallet.findUniqueOrThrow({ where: { userId } })

    if (wallet.status !== 'ACTIVE') {
      throw new Error('Portefeuille non actif')
    }

    if (wallet.balance < amount) {
      throw new Error('Solde insuffisant')
    }

    const updated = await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: { decrement: amount } },
    })

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: opts.type as never,
        amount,
        currency: wallet.currency,
        balanceBefore: wallet.balance,
        balanceAfter: updated.balance,
        description: opts.description ?? null,
        reference: opts.reference ?? null,
        metadata: (opts.metadata ?? null) as never,
      },
    })

    log.info('Wallet debited', { userId, amount })
    await emitEvent('wallet.debited', { userId, amount, currency: wallet.currency }, { userId })

    return updated
  })
}

export async function transferBetweenWallets(
  prisma: PrismaClient,
  fromUserId: string,
  toUserId: string,
  amount: number,
  description?: string,
) {
  if (amount <= 0) throw new Error('Le montant doit être positif')
  if (fromUserId === toUserId) throw new Error('Impossible de transférer vers le même portefeuille')

  return prisma.$transaction(async (tx) => {
    const [sender, receiver] = await Promise.all([
      tx.wallet.findUniqueOrThrow({ where: { userId: fromUserId } }),
      tx.wallet.findUniqueOrThrow({ where: { userId: toUserId } }),
    ])

    if (sender.status !== 'ACTIVE') throw new Error('Portefeuille expéditeur non actif')
    if (receiver.status !== 'ACTIVE') throw new Error('Portefeuille destinataire non actif')
    if (sender.balance < amount) throw new Error('Solde insuffisant')

    const ref = `TRANSFER-${Date.now()}`

    const [updatedSender, updatedReceiver] = await Promise.all([
      tx.wallet.update({ where: { id: sender.id }, data: { balance: { decrement: amount } } }),
      tx.wallet.update({ where: { id: receiver.id }, data: { balance: { increment: amount } } }),
    ])

    await Promise.all([
      tx.walletTransaction.create({
        data: {
          walletId: sender.id,
          type: 'TRANSFER_OUT',
          amount,
          currency: sender.currency,
          balanceBefore: sender.balance,
          balanceAfter: updatedSender.balance,
          description: description ?? 'Transfert envoyé',
          reference: ref,
        },
      }),
      tx.walletTransaction.create({
        data: {
          walletId: receiver.id,
          type: 'TRANSFER_IN',
          amount,
          currency: receiver.currency,
          balanceBefore: receiver.balance,
          balanceAfter: updatedReceiver.balance,
          description: description ?? 'Transfert reçu',
          reference: ref,
        },
      }),
    ])

    log.info('Wallet transfer completed', { fromUserId, toUserId, amount, ref })
    await emitEvent(
      'wallet.transfer',
      { fromUserId, toUserId, amount, reference: ref },
      { userId: fromUserId },
    )

    return { sender: updatedSender, receiver: updatedReceiver, reference: ref }
  })
}
