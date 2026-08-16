# API Endpoint Catalog (compact)

Customers
- GET /api/v1/customers [?page,size,nomeFantasia,bloqueado,cnpjEmpresa]
- GET /api/v1/customers/{id}
- GET /api/v1/customers/by-external-id/{externalId}

Orders
- GET /api/v1/customer-orders [?page,size,codCli,sitres,cnpjEmpresa]
- GET /api/v1/customer-orders/{id}

Products
- GET /api/v1/products
- GET /api/v1/products/{id}

Salespeople
- GET /api/v1/vendedores
- GET /api/v1/vendedores/{id}

Notifications
- GET /api/v1/notifications
- PATCH /api/v1/notifications/{id}/read
- PATCH /api/v1/notifications/{id}/dismiss

(This is a compact summary—see emerion-dashboard-api OpenAPI for full details.)

Field summaries (compact):
- api/customers_fields.md — GET /api/v1/customers field summary
- api/customer_orders_fields.md — GET /api/v1/customer-orders field summary
- api/products_fields.md — GET /api/v1/products field summary
- api/vendedores_fields.md — GET /api/v1/vendedores field summary
- api/notifications_fields.md — GET /api/v1/notifications field summary
- api/dashboard_overview_fields.md — suggested aggregated KPIs (recommended)

Field examples (small):
- api/examples/customers_example.json
- api/examples/customer_order_example.json
- api/examples/products_example.json
- api/examples/vendedores_example.json
- api/examples/notifications_example.json

OpenAPI snippets:
- api/openapi/dashboard_overview_openapi.yaml

Backend mappings: api/backend_mappings.md