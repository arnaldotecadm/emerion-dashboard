# Emerion Dashboard — GitHub Copilot Instructions

Important:
- `emerion-dashboard-api` is the source of truth for frontend data.
- `emerion-load-service` is authoritative for legacy Firebird semantics.
- React must consume the API; it must not query Firebird or PostgreSQL directly.

Frontend rules (short):
- Follow existing feature patterns: service → hook → component/page.
- Reuse existing components/styles (Tailwind). Do not introduce new global frameworks.
- Do not invent backend endpoints or fabricate production data.

Product-aware behavior:
- Distinguish data that is available, derivable, or requiring new backend capability.
- If a requested metric is unsupported, state the missing data and propose the minimal API change.

Token-saving guidance:
- Inspect .github_react/INDEX.md first; then only the referenced docs needed for the task.
- Prefer concise, semantic docs here rather than duplicating backend code.

If asked for product suggestions, provide: one-sentence business problem, stakeholder, required data, current API support, and a minimal implementation plan.