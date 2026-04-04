# Mobile Money Integration — MABELE / KangaPay

## Overview

KangaPay integrates with the three major mobile money operators in the DRC:

| Operator | Network | Market Share | API |
|----------|---------|--------------|-----|
| Airtel Money | Airtel | ~35% | Africa's Talking / Direct |
| M-Pesa | Vodacom | ~30% | Safaricom / Vodacom API |
| Orange Money | Orange | ~25% | Orange Developer API |
| Africell | Africell | ~10% | Africa's Talking |

---

## Phone Number Prefixes

```
Airtel  : +243 81x, +243 82x
Vodacom : +243 81x, +243 82x
Orange  : +243 84x, +243 85x
Africell: +243 89x, +243 90x
```

---

## Africa's Talking Integration

Africa's Talking is the recommended provider for DRC as it supports multiple operators.

### Installation
```bash
pnpm add africastalking
```

### Configuration
```env
SMS_PROVIDER=africas_talking
AFRICAS_TALKING_API_KEY=your-api-key
AFRICAS_TALKING_USERNAME=your-username
```

### Usage
```typescript
import AfricasTalking from 'africastalking'

const at = AfricasTalking({
  apiKey: process.env.AFRICAS_TALKING_API_KEY!,
  username: process.env.AFRICAS_TALKING_USERNAME!,
})

// Send OTP SMS
const sms = at.SMS
await sms.send({
  to: ['+243812345678'],
  message: `Votre code MABELE: ${otp}. Valable 5 minutes.`,
  from: 'MABELE',
})

// Mobile Money (Payment)
const payments = at.PAYMENTS
await payments.mobileCheckout({
  productName: 'MABELE',
  phoneNumber: '+243812345678',
  currencyCode: 'UGX', // Use local currency
  amount: 5000,
  metadata: { orderId: 'INV-001' },
})
```

---

## Airtel Money API (Direct)

```typescript
// Initialize Airtel client
const airtelClient = {
  baseUrl: process.env.AIRTEL_BASE_URL!,
  clientId: process.env.AIRTEL_CLIENT_ID!,
  clientSecret: process.env.AIRTEL_CLIENT_SECRET!,
}

// Get access token
async function getAirtelToken(): Promise<string> {
  const res = await fetch(`${airtelClient.baseUrl}/auth/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: airtelClient.clientId,
      client_secret: airtelClient.clientSecret,
      grant_type: 'client_credentials',
    }),
  })
  const data = await res.json() as { access_token: string }
  return data.access_token
}

// Request payment from customer (C2B)
async function requestPayment(params: {
  phone: string
  amount: number
  reference: string
  currency?: string
}) {
  const token = await getAirtelToken()
  const res = await fetch(`${airtelClient.baseUrl}/merchant/v2/payments/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'X-Country': 'CD',
      'X-Currency': params.currency ?? 'USD',
    },
    body: JSON.stringify({
      reference: params.reference,
      subscriber: { country: 'CD', currency: 'USD', msisdn: params.phone },
      transaction: {
        amount: params.amount,
        country: 'CD',
        currency: params.currency ?? 'USD',
        id: params.reference,
      },
    }),
  })
  return res.json()
}
```

---

## Tontine Smart Logic

The tontine system manages rotating savings groups (likelembas in Lingala).

### Trust Score Algorithm
```typescript
// Score starts at 100, decreases on late/missed payments
function calculateTrustScore(payments: Payment[]): number {
  let score = 100
  for (const payment of payments) {
    if (payment.status === 'LATE') score -= 5
    if (payment.status === 'MISSED') score -= 20
    if (payment.status === 'ON_TIME') score += 1 // max 100
  }
  return Math.max(0, Math.min(100, score))
}
```

### Rotation Order
```typescript
// Assign payout order based on trust score and join date
function assignRotationOrder(members: TontineGroupMember[]): TontineGroupMember[] {
  return [...members].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.createdAt.getTime() - b.createdAt.getTime()
  })
}
```

---

## Webhook Handlers

Set up webhooks to receive payment confirmations:

```typescript
// app/api/webhooks/airtel/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json() as AirtelWebhookPayload
  
  // Verify signature
  const signature = req.headers.get('x-airtel-signature')
  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  
  // Process payment
  if (body.transaction.status === 'SUCCESS') {
    await handleSuccessfulPayment(body)
  }
  
  return NextResponse.json({ received: true })
}
```

---

## Testing in Sandbox

All mobile money providers offer sandbox environments:

```env
# Airtel sandbox
AIRTEL_BASE_URL=https://openapi.airtel.africa

# Africa's Talking sandbox
AFRICAS_TALKING_USERNAME=sandbox
# Use API key from https://account.africastalking.com/apps/sandbox/settings/key
```

Test phone numbers (sandbox only):
- Airtel: `+243710000000`
- Vodacom: `+243820000000`

---

## Currency Considerations

- Transactions in DRC are primarily in **USD** and **CDF**
- Always store amounts in the currency used at time of transaction
- Use the `cdfToUSD()` utility for display conversion
- Never convert for storage — store original currency
