# API Reference — MABELE

> Base URL: `https://mabele.cd/api`

All endpoints return JSON. Authentication uses Bearer tokens via NextAuth.js.

---

## Authentication

### POST /api/auth/send-otp
Sends an OTP SMS to the provided phone number.

**Body:**
```json
{ "phone": "+243812345678" }
```

**Response:**
```json
{ "success": true, "message": "OTP sent", "expiresIn": 300 }
```

---

### POST /api/auth/verify-otp
Verifies the OTP and returns a session token.

**Body:**
```json
{ "phone": "+243812345678", "otp": "123456" }
```

**Response:**
```json
{
  "success": true,
  "user": { "id": "...", "name": "Jean-Pierre", "role": "USER" },
  "token": "eyJ..."
}
```

---

## Module: Immobilier

### GET /api/immo
List immo listings with optional filters.

**Query params:**
| Param | Type | Description |
|-------|------|-------------|
| `type` | `ImmoType` | APPARTEMENT, MAISON, VILLA, etc. |
| `action` | `ImmoAction` | LOCATION \| VENTE |
| `ville` | string | City name |
| `province` | string | Province name |
| `prixMin` | number | Min price (USD) |
| `prixMax` | number | Max price (USD) |
| `chambres` | number | Minimum bedrooms |
| `q` | string | Full-text search |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 20, max: 100) |

**Response:**
```json
{
  "success": true,
  "data": [{ ...ImmoListing }],
  "meta": { "total": 1250, "page": 1, "limit": 20 }
}
```

---

### GET /api/immo/:id
Get a single immo listing by ID.

---

### POST /api/immo
Create a new immo listing. **Requires auth.**

**Body:** `ImmoListingCreateInput`

---

### PATCH /api/immo/:id
Update an immo listing. **Requires auth (owner or ADMIN).**

---

### DELETE /api/immo/:id
Delete an immo listing. **Requires auth (owner or ADMIN).**

---

## Module: Emploi

### GET /api/emploi
List job postings.

**Query params:** `type`, `categorie`, `ville`, `province`, `remote` (bool), `salaireMin`, `q`, `page`, `limit`

---

### POST /api/emploi
Create a job posting. **Requires auth (EMPLOYER or ADMIN).**

---

### POST /api/emploi/:id/apply
Apply to a job. **Requires auth.**

**Body:**
```json
{
  "nom": "Jean-Pierre Mutombo",
  "email": "jp@example.com",
  "phone": "+243812345678",
  "cv": "https://...",
  "message": "Lettre de motivation..."
}
```

---

## Module: Marché

### GET /api/market
List market items. **Query:** `categorie`, `etat`, `ville`, `prixMin`, `prixMax`, `q`

### POST /api/market
Create a market item. **Requires auth.**

---

## Module: AgriTech

### GET /api/agri
List agri products. **Query:** `produit`, `province`, `bio` (bool), `certifie` (bool)

### POST /api/agri
Create an agri product. **Requires auth (FARMER or ADMIN).**

---

## Module: NKISI (Factures)

### GET /api/invoices
List user's invoices. **Requires auth.**

### POST /api/invoices
Create an invoice. **Requires auth.**

**Body:**
```json
{
  "clientNom": "SARL Congo Build",
  "clientPhone": "+243810000099",
  "items": [
    { "description": "Service", "quantite": 1, "prix": 500 }
  ],
  "taxe": 0,
  "devise": "USD",
  "dueDate": "2025-02-28"
}
```

### GET /api/invoices/:id/pdf
Generate and download PDF for an invoice. **Requires auth.**

---

## Module: KangaPay (Finance)

### GET /api/tontines
List user's tontine groups. **Requires auth.**

### POST /api/tontines
Create a tontine group. **Requires auth.**

### POST /api/tontines/:id/join
Join an existing tontine. **Requires auth.**

### POST /api/payments/send
Send mobile money payment.

**Body:**
```json
{
  "to": "+243812345678",
  "amount": 50,
  "devise": "USD",
  "operator": "airtel",
  "note": "Cotisation tontine janvier"
}
```

---

## Module: Congo Data

### GET /api/data/indicators
Get macroeconomic indicators.

### GET /api/data/provinces
Get economic data by province.

### GET /api/data/export
Export data as CSV/Excel. **Query:** `format` (csv|excel|json)

---

## Notifications

### GET /api/notifications
Get user notifications. **Requires auth.**

### PATCH /api/notifications/:id/read
Mark notification as read. **Requires auth.**

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "error": "Message d'erreur",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `UNAUTHORIZED` — Not authenticated
- `FORBIDDEN` — Insufficient permissions
- `NOT_FOUND` — Resource not found
- `VALIDATION_ERROR` — Invalid input data
- `RATE_LIMITED` — Too many requests
