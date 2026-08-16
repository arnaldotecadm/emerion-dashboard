# GET /api/v1/customers — Field summary (compact)

Purpose: Paginated customer list used by directory and KPIs.

Envelope: { data: Customer[], pagination: { total, page, size, totalPages } }

Key fields (frontend names → type → notes):
- id: number (internal PK)
- externalId: string (legacy codCli)
- nomeFantasia: string
- razaoSocial: string | null
- cpfCnpj: string | null
- bloqueado: boolean (ERP block flag)
- limiteCredito: number | null (monetary)
- vendedorExternalId: string | null
- createdAt: string (ISO timestamp)

Caveats:
- externalId is the id used for upserts/legacy lookup.
- Pagination is zero-based.

Example (short):
{
  "data": [{ "id": 123, "externalId": "4567", "nomeFantasia": "ACME" }],
  "pagination": { "total": 100, "page": 0, "size": 20, "totalPages": 5 }
}