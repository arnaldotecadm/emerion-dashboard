--applyTo: "src/features/**/{services,hooks,types}/**/*.{ts,tsx}"

# API Integration

- Emerion-dashboard-api is the source of truth.
- Services: construct URL, call apiFetch, validate response, return typed JSON.
- Hooks: call services, manage loading/error/data/pagination, expose refetch.

Common endpoints (compact):
- GET /api/v1/customers[?page,size,nomeFantasia,bloqueado,cnpjEmpresa]
- GET /api/v1/customers/{id}
- GET /api/v1/customer-orders[?page,size,codCli,sitres,cnpjEmpresa]
- GET /api/v1/products
- GET /api/v1/vendedores
- GET /api/v1/notifications

Pagination: zero-based ?page=0&size=20

If a metric needs substantial aggregation, prefer a backend endpoint rather than large client-side aggregation.