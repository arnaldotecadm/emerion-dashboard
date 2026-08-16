# GET /api/v1/dashboard/overview — Field summary (suggested)

Purpose: Single-call aggregated KPIs for the VisaoGeral page (recommended aggregation endpoint).

Suggested fields (backend should provide):
- totalCustomers: number
- totalOrders: number
- totalRevenue: number
- period: { from: string, to: string }
- topCustomers: [{ customerExternalId, name, revenue }]
- ordersByState: [{ state, count, totalValue }]

Note: This endpoint may not exist yet. If not present, React should not attempt large client-side aggregation; instead request this backend capability.