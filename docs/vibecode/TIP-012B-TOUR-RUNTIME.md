# TIP-012B — Tour runtime contracts

## Objective

Build a finite, defensive client runtime for loading, navigating, resuming and narrating data-driven tours.

## Deliverables

- Runtime types and payload validation.
- Tour registry loader with cancellation and recoverable errors.
- Reducer lifecycle, URL normalization/history and version-safe local persistence.
- Concept selection resolver and a single optional-audio narration controller.

## Acceptance criteria

1. Transition table rejects stale or invalid events without corrupting state.
2. `?tour=<id>&beat=<id>` deep links normalize deterministically.
3. Invalid stored progress is discarded without clearing unrelated storage.
4. Missing optional audio continues with transcript.
5. Automated runtime tests pass.

Dependencies: TIP-012A. Priority: P0.
