--applyTo: "src/features/dashboard/**/*.{ts,tsx}"

# Dashboard UI

Visual hierarchy:
Page title → Filters → KPIs → Primary insight → Supporting analysis → Details

Guidelines:
- Reuse Tailwind visual language and existing components.
- Widgets must answer a business question; avoid decorative charts.
- Provide loading, error and empty states.
- Use responsive Tailwind grids (grid-cols-1, md:grid-cols-2, ...).
- Drill-down: metrics that map to entities should navigate to detail pages.