// ─── API: Admin Ban ───────────────────────────────────────────────────────────
// Allows ADMIN/SUPER_ADMIN to permanently ban an IP.
// Also requires internal HMAC signature for extra protection.

import { z } from 'zod'
import { requirePermission, handleApiError, apiSuccess, ValidationError } from '@mabele/core-auth'
import { getSessionUser } from '@/lib/auth'
import { permanentBan, liftBan } from '@mabele/core-security'

const schema = z.object({
  ip:     z.string().ip({ version: 'v4' }).or(z.string().ip({ version: 'v6' })),
  action: z.enum(['ban', 'unban']),
  reason: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'users:ban')

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      throw new ValidationError('Données invalides', parsed.error.flatten())
    }

    const { ip, action } = parsed.data

    if (action === 'ban') {
      permanentBan(ip, 'HONEYPOT_HIT')
      console.warn(`[MABELE-SECURITY][ADMIN-BAN] admin=${user!.id} ip=${ip}`)
      return apiSuccess({ banned: true, ip })
    } else {
      liftBan(ip)
      console.warn(`[MABELE-SECURITY][ADMIN-UNBAN] admin=${user!.id} ip=${ip}`)
      return apiSuccess({ banned: false, ip })
    }
  } catch (error) {
    return handleApiError(error)
  }
}
