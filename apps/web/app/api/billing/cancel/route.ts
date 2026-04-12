import { z } from 'zod'
import { cancelSubscription } from '@mabele/core-billing'
import { requireAuth, handleApiError, apiSuccess, ValidationError } from '@mabele/core-auth'
import { getSessionUser } from '@/lib/auth'
import db from '@/lib/db'

const schema = z.object({
  atPeriodEnd: z.boolean().default(true),
})

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    requireAuth(user)

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError('Données invalides', parsed.error.flatten())
    }

    await cancelSubscription(db, user!.id, parsed.data.atPeriodEnd)
    return apiSuccess({ cancelled: true })
  } catch (error) {
    return handleApiError(error)
  }
}
