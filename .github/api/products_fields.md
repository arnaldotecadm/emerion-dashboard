# GET /api/v1/products — Field summary (compact)

Purpose: Product directory and product-facing widgets.

Key fields:
- id: number
- externalId: string
- nome: string
- codigo: string
- categoria: string | null
- marca: string | null
- availableStock: number | null (if present)

Notes:
- Filters: nome, cnpjEmpresa
- Product analytics (ABC) require backend aggregation; product list is item-level only.

Example: { "data": [{ "id": 10, "externalId": "P-123", "nome": "Widget" }] }