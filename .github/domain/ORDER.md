# Order (compact domain summary)

Core concepts
- Legacy tables: PEDRES/PEDRE2
- Important fields: dteres (date), sitres (status), codCli (customer externalId), total

API
- GET /customer-orders
- GET /customer-orders/{id}

Notes
- Order workflow has multiple states (programming, commercial release, financial release, stock separation, billing, payment). Use these for pipeline widgets.