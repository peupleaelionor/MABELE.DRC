import { z } from 'zod'
import { createSubscription } from '@mabele/core-billing'
import {
  requirePermission,
  handleApiError,
  apiSuccess,
  ValidationError,
} from '@mabele/core-auth'
import { rateLimit, RATE_LIMITS } from '@mabele/core-rate-limit'
import { getSessionUser } from '@/lib/auth'
import db from '@/lib/db'

const schema = z.object({
  planKey: z.string().min(1),
  cycle: z.enum(['MONTHLY', 'QUARTERLY', 'YEARLY']).default('MONTHLY'),
})

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'payments:initiate')

    const rl = await rateLimit(`billing:${user!.id}`, RATE_LIMITS.payment)
    if (!rl.allowed) {
      return Response.json(
        { success: false, error: 'Trop de requêtes', code: 'RATE_LIMITED' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError('Données invalides', parsed.error.flatten())
    }

    const result = await createSubscription(db, {
      userId: user!.id,
      planKey: parsed.data.planKey,
      cycle: parsed.data.cycle,
    })

    return apiSuccess(result, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
