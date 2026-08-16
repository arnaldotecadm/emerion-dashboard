# .github_react/api — README

Purpose: compact, Copilot-friendly API knowledge for the React app. Contains:
- Field summaries (lightweight) in this folder.
- Concrete examples in api/examples/ (short JSON payloads used by Copilot to infer shapes).
- Suggested OpenAPI snippets for proposed backend endpoints in api/openapi/.
- Backend mappings (api/backend_mappings.md) pointing to emerion-load-service authoritative docs.

How to use:
- Copilot: consume these files first when asked to implement API-backed features.
- Developers: when proposing an endpoint change, fill api/ENDPOINT_CHANGE_REQUEST_TEMPLATE.md and reference the OpenAPI snippet if applicable.

Maintenance:
- When the backend changes types, update the corresponding field summary and example JSON here.
- Keep api/backend_mappings.md pointing to the authoritative emergion-load-service path(s).