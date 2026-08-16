--applyTo: "src/**/*.{ts,tsx}"

# React Architecture

Follow the feature-based structure already present in src:
src/features/<feature>/{pages,components,hooks,services,types,utils,data}

Rules:
- Pages compose screens; avoid direct API calls in page components.
- Pattern: Page → Hook → Service → API.
- Hooks manage loading/error/data/pagination; services own apiFetch usage.
- Types mirror API responses and live in features/*/types.
- data/ is only for mock/static/prototype data.