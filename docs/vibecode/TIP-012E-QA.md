# TIP-012E — QA, performance and handover

## Objective

Prove the engine is reusable, visually equivalent and production-safe.

## Deliverables

- Synthetic fixture journey proving data-only extensibility.
- Content/runtime/regression tests and bundle budget checker.
- Browser verification matrix and render captures.
- Completion reports and final Vibecode Verify Report.

## Acceptance criteria

1. `npm test`, `npm run check` and `npm run build` pass.
2. App ≤90 kB gzip; lazy graphics ≤270 kB gzip; journey ≤100 kB raw.
3. Synthetic journey compiles without app/renderer edits.
4. Desktop, mobile, deep link, refresh, back/forward, reduced motion and fallback paths are checked.
5. Final report includes numeric coverage, scenarios, health and status.

Dependencies: TIP-012A–D. Priority: P0.
