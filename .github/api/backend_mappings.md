# Backend mapping (compact)

This file points to authoritative backend docs for legacy/contract details.

Frontend resource → authoritative backend reference

Customers
- Contract & generation: emerion-dashboard-api/.github/ (OpenAPI + copilot instructions)
- Legacy field mapping: emerion-load-service/.github/database-metadata/FINCLI_CUSTOMER_TABLE.md

Orders
- Contract: emerion-dashboard-api OpenAPI (in its .github or src resources)
- Legacy mapping: emerion-load-service/.github/database-metadata/PEDRES_PEDRE2_ORDER_TABLES.md

Products
- Legacy mapping: emerion-load-service/.github/database-metadata/ESTPRO_PRODUCT_TABLE.md

Status/enums
- Check emerion-load-service/.github for enum/value dictionaries (e.g., sitres mappings, status names).

Guidance:
- Do not copy Firebird SQL into React. Consult emerion-load-service/.github for precise legacy semantics when needed.
- When proposing new backend endpoints, reference emerion-dashboard-api/.github and link to the exact OpenAPI path if possible.