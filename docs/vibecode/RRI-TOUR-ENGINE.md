# RRI REPORT — Human Atlas Tour Engine v1

Generated: 2026-09-21  
Mode: context-aware RRI; 44 prompts resolved from owner direction, codebase evidence and accepted TIP-011. No blocking question remains for the proposed v1 scope.

## PRODUCT FRAME

Human Atlas is a cinematic Vietnamese exploration webapp, not a clinical atlas. Accuracy means correct mainstream spatial/functional understanding to the best quality supported by the selected sources. Academic provenance is backstage infrastructure, not the primary user experience.

## REQUIREMENTS MATRIX

| ID | Requirement | Priority | Persona | Source |
|---|---|---:|---|---|
| TE-001 | A tour must be authorable from content data without editing React or Three.js engine files. | P0 | Developer | owner strategy + scan gap |
| TE-002 | Female Abdomen must migrate with the accepted five beats and equivalent visual behavior. | P0 | End user | TIP-011 |
| TE-003 | Free exploration, direct structure detail and cinematic tour must coexist without dead ends. | P0 | End user | current UX |
| TE-004 | Each beat controls atlas, concept focus, systems, isolate/lens state, camera cue, effect cue and copy. | P0 | Developer | current duplicated state |
| TE-005 | Effect and camera IDs must resolve through finite engine registries; content cannot execute arbitrary code. | P0 | QA | safety/maintainability |
| TE-006 | Invalid journey data, missing concept IDs, fact IDs, sources or disclosures must fail before build/publish. | P0 | QA | SOT method |
| TE-007 | Every displayed factual claim references an SOT fact; every fact preserves source and captured evidence. | P0 | Business | owner SOT direction |
| TE-008 | Educational illustrations may ship without pretending to be measured anatomy, but require explicit disclosure. | P0 | End user | owner accuracy level |
| TE-009 | Source geometry, curated knowledge and educational illustration remain distinguishable in data and UI. | P0 | QA | TIP-011 pattern |
| TE-010 | Tour and beat are deep-linkable and reload-safe using a static-host-compatible URL. | P0 | End user | product gap |
| TE-011 | Back/forward updates the beat without reloading the atlas. | P1 | End user | web convention |
| TE-012 | Local resume stores only tour progress/preferences and can recover from stale/invalid versions. | P1 | End user | no account decision |
| TE-013 | Switching atlas waits for the correct atlas identity and 100% renderer load before entering a beat. | P0 | QA | verified TIP-011 race |
| TE-014 | A narration contract supports optional audio, transcript and timed cues; silent tours remain valid. | P1 | End user | product direction |
| TE-015 | Audio begins only after an explicit user gesture and stays consistent across beats. | P0 | QA | browser policy + prior UX evidence |
| TE-016 | Reduced-motion replaces cinematic interpolation with direct, readable state changes. | P0 | Accessibility | existing contract |
| TE-017 | Mobile and desktop use the same journey semantics with responsive presentation. | P0 | End user | accepted design |
| TE-018 | Beat loading, missing content and renderer failures have recoverable Vietnamese states. | P0 | QA | failure-path gap |
| TE-019 | Existing anatomy search, selection, explode, x-ray and four legacy lessons must not regress. | P0 | QA | existing value |
| TE-020 | Initial male path must not download female-only journey geometry. | P0 | Operator | performance contract |
| TE-021 | Generated content has stable IDs, deterministic ordering and a digest tied to its source registry. | P0 | Operator | SOT publish discipline |
| TE-022 | New content is not publicly publishable when source drift or unresolved disputed claims are detected. | P0 | Operator | SOT fail-loud rule |
| TE-023 | Web-refinery ingestion is outside runtime and must never scrape during an end-user session. | P0 | Operator | privacy/reliability |
| TE-024 | The accepted Inter-thin title, readable regular body and restrained premium visual language remain unchanged. | P0 | End user | owner-approved ADN |
| TE-025 | Runtime growth stays within 90 kB gzip app JS and 270 kB gzip lazy graphics JS for v1. | P1 | Operator | current budget |
| TE-026 | Adding a data-only tour is covered by schema, concept-resolution, SOT and URL-state tests. | P0 | Developer | maintainability |

## AUTO-ANSWERED BY PERSONA

### End user

- Anonymous and immediate; no account gate.
- Primary loop: choose journey → travel beat by beat → pause/explore → resume/finish → return to body map.
- Vietnamese-first; medical jargon is subordinate to spatial storytelling.
- Mobile remains first-class; touch and keyboard paths continue.

### Business analyst

- v1 proves a repeatable tour platform, not monetization.
- Product claims educational/reference use, not diagnosis or treatment.
- One gold-standard migrated tour is more valuable than several new hard-coded tours.
- Public landing, subscription, school dashboard and partner licensing remain later initiatives.

### QA/tester

- Malformed content, missing structures, stale digest and source conflicts fail loudly.
- Missing optional audio degrades to transcript rather than blocking the tour.
- URL and stored progress are untrusted inputs and must be normalized.
- WebGPU and forced-WebGL2 paths remain supported.

### Developer

- Reuse React/Vite/Three.js; no router, state or schema dependency is required for v1.
- Use a reducer/state machine for journey lifecycle rather than adding page-level booleans.
- Build-generated JSON is the only runtime content; canonical authoring/SOT stays outside `public/`.
- Existing lesson model is not migrated in this architectural slice.

### Operator

- Static deployment remains the operating model.
- Deterministic content compiler runs before `vite build` and in tests.
- No runtime secret, database or remote CMS.
- Current uncommitted owner work is preserved; no commit/push/deploy without instruction.

## DECISIONS LOG

| ID | Options | Decision | Rationale |
|---|---|---|---|
| TD-001 | Static site / native app / PWA-ready webapp | PWA-ready static webapp | best fit for WebGPU, sharing and later offline support |
| TD-002 | TypeScript hard-code / runtime CMS / compiled canonical JSON | compiled canonical JSON | data-authored tours without backend or runtime schema risk |
| TD-003 | Full routing dependency / query URL / hash | `?tour=<id>&beat=<id>` | static-host safe and dependency-free for v1 |
| TD-004 | Global store dependency / reducer | project-owned reducer | finite lifecycle, testable transitions, small bundle |
| TD-005 | Arbitrary shader hooks / effect registry | effect registry | preserves renderer safety and performance budgets |
| TD-006 | Full SOT/refinery platform first / no provenance / SOT-minimum vertical | SOT-minimum vertical with deterministic publish gate | proves the chain without delaying the engine |
| TD-007 | Migrate all lessons / one oracle tour | migrate Female Abdomen only | contains architecture risk while preserving current product |
| TD-008 | Mandatory narration / optional narration contract | optional audio + required transcript text | resilient to browser policy and unfinished voice assets |
| TD-009 | Exact medical product / entertainment / trustworthy popular science | trustworthy popular-science exploration | matches owner direction and available sources |

## OPEN QUESTIONS — NON-BLOCKING / DEFERRED

- OQ-001: final public product name and domain.
- OQ-002: analytics provider and privacy policy.
- OQ-003: ElevenLabs voice ownership and production budget.
- OQ-004: PWA/offline caching scope.
- OQ-005: which two journeys follow Female Abdomen after v1 proves reusable authoring.

## PROCESS DECISION

The owner has already resolved the strategic unknown: prioritize cinematic travel and repeatable AI-assisted content production over academic completeness. Therefore the RRI review checkpoint is merged into Blueprint approval; this avoids asking the owner to reconfirm codebase facts and accepted product direction.
