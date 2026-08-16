# API Integration Skill

Pattern: API → service → hook → component/page

Service: build URL, call apiFetch, validate, parse JSON.
Hook: manage loading, error, data, pagination, refetch.
Types: represent API responses exactly.

If endpoint is missing: state missing capability, show required data, propose minimal API change.