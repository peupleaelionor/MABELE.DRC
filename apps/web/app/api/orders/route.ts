// ─── API: Orders (user payment history) ───────────────────────────────────────
import { requirePermission, handleApiError, apiSuccess } from '@mabele/core-auth'
import { getSessionUser } from '@/lib/auth'
import db from '@/lib/db'

export async function GET() {
  try {
    const user = await getSessionUser()
    requirePermission(user, 'payments:view_own')

    const orders = await db.paymentIntent.findMany({
      where:   { userId: user!.id },
      orderBy: { createdAt: 'desc' },
      take:    50,
      select: {
        id:          true,
        reference:   true,
        amount:      true,
        devise:      true,
        provider:    true,
        type:        true,
        status:      true,
        metadata:    true,
        createdAt:   true,
      },
    })

    // Derive a human-readable description from metadata or type
    const formatted = orders.map(o => {
      const meta = o.metadata as Record<string, string> | null
      return {
        ...o,
        description: meta?.description ?? typeToLabel(String(o.type)),
      }
    })

    return apiSuccess(formatted)
  } catch (error) {
    return handleApiError(error)
  }
}

function typeToLabel(type: string): string {
  const map: Record<string, string> = {
    PURCHASE:             'Achat',
    LISTING_BOOST:        'Boost annonce',
    PREMIUM_SUBSCRIPTION: 'Abonnement Premium',
    VERIFICATION_FEE:     'Frais de vérification',
    DEPOSIT:              'Dépôt',
    SUBSCRIPTION:         'Abonnement',
    TRANSFER:             'Transfert',
    TONTINE:              'Tontine',
    INVOICE_PAYMENT:      'Paiement facture',
    LISTING_FEATURE:      'Mise en avant',
  }
  return map[type] ?? type
}
