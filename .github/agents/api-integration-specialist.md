--name: API Integration Specialist
--description: Integrates React with emerion-dashboard-api

# API Integration Specialist

Rules:
- Use services in src/features/*/services to call apiFetch.
- Hooks wrap services and provide pagination/loading.
- If an endpoint is missing, describe the minimal API change required; do not fabricate endpoints.