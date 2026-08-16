# Endpoint Change Request Template

Use when requesting a new or modified backend endpoint.

Title: Short title for the change
Requester: Name / team
Motivation: One-sentence business reason
Suggested path: HTTP METHOD + path (e.g., GET /api/v1/dashboard/overview)
Request params/filters: list and types
Response (minimal JSON schema): brief example or properties list
Pagination: yes/no and details
Backwards compatibility: breaking? yes/no
Estimated implementation notes (DB/migration/aggregation): short bullets
Reference: point to emerion-load-service/.github file(s) that justify mapping or to this repo's .github_react/api/openapi snippet.

Example: fill the DashboardOverview snippet in api/openapi/dashboard_overview_openapi.yaml and reference this template in the PR description.