# GET /api/v1/customer-orders — Field summary (compact)

Purpose: Paginated orders list for lists and pipeline widgets.

Envelope: { data: Order[], pagination: { total, page, size, totalPages } }

Key fields:
- id: number
- externalId: string (legacy order id)
- codCli / customerExternalId: string
- dteres: string (ISO date — business date)
- sitres: string (status code; several workflow states)
- total: number (monetary)
- createdAt, updatedAt: string

Notes:
- sitres is a status string; consult emerion-load-service mapping for exact values.
- Use filters: codCli, sitres, cnpjEmpresa, page, size.

Example: { "data": [{ "id": 88, "externalId": "9001", "total": 1234.5 }], "pagination": { ... } }