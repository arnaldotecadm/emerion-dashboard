--applyTo: "src/**/*.{ts,tsx}"

# Testing

When adding dashboard logic, consider tests for:
- data formatting and transformations
- loading/error/empty states
- pagination
- conditional rendering
- navigation and drill-down

Prefer unit/behavior tests; do not introduce new testing frameworks without justification.