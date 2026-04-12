import { getPublicPlans } from '@mabele/core-billing'
import { apiSuccess } from '@mabele/core-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  const plans = getPublicPlans()
  return apiSuccess(plans)
}
