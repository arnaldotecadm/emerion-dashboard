# .github_react Maintenance Checklist

Purpose: keep Copilot context fresh and accurate.

When backend contract or legacy mapping changes:
- Update corresponding file under .github_react/api/*.md
- Update example JSON in .github_react/api/examples/
- Update .github_react/references/* if legacy mapping changed
- Bump a short entry in CHANGELOG.md (optional) describing the change

When adding a new frontend feature that requires backend work:
- Use api/ENDPOINT_CHANGE_REQUEST_TEMPLATE.md to describe the need
- Add an OpenAPI snippet under api/openapi/ if the change is proposed

General rules:
- Keep docs terse and authoritative; point to emerion-load-service/.github for full legacy details.
- Prefer updating docs in the same PR that changes code to avoid drift.