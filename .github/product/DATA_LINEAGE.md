# Data Lineage

System flow:
Firebird (legacy) → emerion-load-service (transform) → emerion-dashboard-api (Postgres, REST) → emerion-dashboard (React)

Rules:
- React must consume emerion-dashboard-api only.
- emerion-load-service is authoritative for Firebird semantics and field mappings.
- For aggregation-heavy metrics, prefer backend endpoints.