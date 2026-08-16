# GET /api/v1/vendedores — Field summary (compact)

Purpose: Salespeople directory and seller-related widgets.

Key fields:
- id: number
- externalId: string
- nome: string
- situacao: string (status)
- telefone/email: string | null

Notes:
- Use GET /vendedores/{id} for detail. Sales performance metrics need aggregation endpoints (by seller).

Example: { "data": [{ "id": 5, "externalId": "V-12", "nome": "João" }] }