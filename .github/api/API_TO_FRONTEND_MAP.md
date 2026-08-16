# API → Frontend Mapping

Customers
- API: GET /customers
- Service: src/features/dashboard/services/customerService.ts
- Hook: src/features/dashboard/hooks/useCustomers.ts
- Types: src/features/dashboard/types/customer.ts
- Consumers: ClientesPage, ClienteDetailPage

Orders
- API: GET /customer-orders
- Service: customerOrderService.ts
- Hook: useCustomerOrders.ts

Use this file so Copilot knows where to implement service/hook changes.