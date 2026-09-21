# BLUEPRINT — Human Atlas Tour Engine v1

## Vibecode Kit v6.2

### PROJECT INFO

| Field | Value |
|---|---|
| Project | Human Atlas — Tour Engine v1 |
| Nature | Cinematic, data-driven, static educational webapp |
| Date | 2026-09-21 |
| Architecture status | Approved 2026-09-21; implemented |

## GOALS

**Primary goal:** decouple journeys from React/Three.js so a new tour can be authored, validated and published through content/SOT data.

**Vertical proof:** migrate the accepted five-beat Female Abdomen experience without visual or interaction regression.

**Audience:** Vietnamese children, teenagers, families and curious adults. Not clinical users.

**Key message:** travel through the body and understand by seeing.

## SCOPE

### Included

- Canonical journey/fact/source/asset schemas.
- Deterministic content compiler, digest and publish-blocking validation.
- Generic tour catalogue card, player, narrative panel and beat navigation.
- URL deep links, history and version-safe local resume.
- Scene command bridge with finite camera/effect registries.
- Optional narration contract/controller with transcript-first fallback.
- Migration of Female Abdomen from TypeScript hard-code to generated content.
- Regression, content, URL, reducer, WebGPU/WebGL2 and visual verification.

### Explicitly not included

- New anatomical tour content beyond the migrated Female Abdomen.
- Full migration of the four legacy lessons.
- Accounts, backend, analytics provider, CMS, PWA service worker or payments.
- Live scraping or automatic medical fact approval.
- New 3D assets or new clinical/pathology content.
- Commit, push or deploy unless separately requested.

## FILE STRUCTURE

```text
content/
├── sources/
│   ├── sources.json
│   └── snapshots/                  build-time evidence captures
├── facts/
│   └── female-abdomen.json
├── assets/
│   └── anatomy-assets.json
└── journeys/
    └── female-abdomen.json

app/tour/
├── types.ts                        canonical runtime contracts
├── validate.ts                     runtime defensive validation
├── registry.ts                     catalogue/journey loading
├── reducer.ts                      finite journey lifecycle
├── url-state.ts                    query/history normalization
├── persistence.ts                  version-safe local resume
├── selection.ts                    atlas concept resolution
├── narration.ts                    one audio lifecycle controller
├── TourEntry.tsx
└── TourExperience.tsx

app/scene-cues/
├── camera-cues.ts                  finite semantic cue registry
└── effect-cues.ts                  finite TSL/display cue registry

scripts/content/
├── compile-content.mjs
├── validate-content.mjs
└── content-bites.mjs               injected failures prove gates bite

public/content/                      generated, not hand-edited
├── catalog.json
└── journeys/female-abdomen.json
```

## CANONICAL DATA CONTRACT

### Evidence levels

- `source_geometry`: directly represented by sourced atlas geometry.
- `curated_knowledge`: mainstream explanatory fact supported by captured sources.
- `educational_illustration`: UI/motion convention that requires a disclosure, not a factual source claim.

### Fact status

- `corroborated`, `sourced`, `disputed`, `honest_null`.
- `disputed` and `honest_null` cannot silently produce hard factual copy.
- Compiler fails when verbatim `evidenceSpan` is absent from its referenced snapshot.

### SceneCue

```ts
interface SceneCue {
  atlas: 'male'|'female';
  systems: SystemId[];
  focusConcepts: string[];
  isolate: boolean;
  lens: 'solid'|'xray';
  camera: CameraCueId;
  effect: EffectCueId;
  accent: string;
}
```

Content can select an existing cue ID but cannot inject JavaScript, TSL or arbitrary camera matrices.

## STATE OWNERSHIP

- `TourProvider/useReducer`: journey lifecycle, active beat, playback, loading and recoverable error.
- URL: shareable tour and beat only.
- localStorage: last valid journey/beat, narration preference and speed; no personal or health data.
- `page.tsx`: atlas/free-explore shell and top-level composition only.
- `scene.tsx`: rendering/picking only; consumes generalized scene commands.
- Generated runtime content: immutable during a session.

## MIGRATION PLAN

1. Freeze TIP-011 screenshots and data selections as the oracle.
2. Add compiler/gates and generate Female Abdomen runtime content while old code still runs.
3. Add reducer, URL and persistence unit tests.
4. Add generic Tour UI beside the existing feature and compare behavior.
5. Generalize `abdomenChapter` into scene effect/camera cue IDs.
6. Switch the entry to generated content.
7. Delete only the now-redundant bespoke content/component after visual equivalence passes.
8. Keep legacy lessons untouched.

## ERROR AND RECOVERY CONTRACT

- Unknown tour/beat URL: normalize to the catalogue; do not crash.
- Missing required concept: block the compiled journey before production build.
- Wrong atlas still loading: remain in `atlas-loading`; never enter a beat using stale progress.
- Optional audio missing: show transcript and continue silently.
- Required runtime content missing: Vietnamese recovery panel with retry and exit.
- Stored progress version mismatch: discard only that resume record.
- WebGPU failure: existing WebGL2 fallback remains; both share the same scene cues.

## PERFORMANCE BUDGET

- Application JS ≤ 90 kB gzip.
- Lazy graphics JS ≤ 270 kB gzip.
- Generated Female Abdomen runtime content ≤ 100 kB uncompressed.
- Male opening path fetches no female geometry or journey bundle.
- Tour catalogue may preload metadata only; exact journey and atlas load on intent.
- Continuous rendering is allowed only while a declared active effect/camera transition needs it.

## ACCESSIBILITY

- All beat navigation reachable by keyboard.
- URL/history and visible state remain synchronized.
- Reduced motion uses direct camera/state updates.
- Transcript exists for every narration record.
- Evidence meaning is expressed by text, not color alone.
- Mobile touch targets maintain the existing accepted pattern.

## TEST AND VERIFY PLAN

### Automated

- Schema and reference validation.
- Evidence-span and source-drift gates.
- Adversarial bites: missing source, bad evidence span, disputed hard claim, unknown concept, arbitrary effect ID, stale resume and unknown URL.
- Reducer transition table.
- URL/history normalization.
- Female Abdomen selection parity against TIP-011.
- Existing atlas/gesture/search/explosion tests.
- Typecheck and production build budgets.

### Visual/browser

- Desktop 1280×720 and ≥1440×900.
- Mobile 390×844 and landscape-height stress case.
- WebGPU and forced WebGL2.
- Start from male, direct female, deep link, refresh, back/forward, resume, missing optional audio, reduced motion and network failure.

## RRI TRACEABILITY

| Blueprint area | Requirements |
|---|---|
| Canonical content/SOT | TE-006–009, TE-021–023, TE-026 |
| Tour runtime | TE-001–004, TE-010–013 |
| Narration | TE-014–015 |
| Scene bridge | TE-004–005, TE-016, TE-020 |
| UI/design | TE-002–003, TE-017–019, TE-024 |
| Performance/operations | TE-018, TE-020–026 |

## TASK DECOMPOSITION PREVIEW

```text
TIP-012A  Content SOT + compiler + bites                 P0
    │
    ├── TIP-012B  Tour contracts + reducer + URL/resume  P0
    │       │
    │       ├── TIP-012C  Generic catalogue/player UI    P0
    │       │
    │       └── TIP-012D  Scene cue bridge + migration   P0
    │                       │
    └───────────────────────┴── TIP-012E  QA/performance/docs  P0
```

Task Graph and final TIPs are created only after Blueprint approval.

## DECISIONS AND CHECKPOINT

- RRI checkpoint was merged into this checkpoint because strategy, audience and non-clinical accuracy level were explicitly decided by the owner; codebase questions were auto-answered by Scan.
- No code has been changed during Contractor architecture work.
- Existing uncommitted TIP-011 changes remain untouched.

- [x] Architecture matches expectations.
- [x] Data/SOT discipline is strong but invisible to normal users.
- [x] Female Abdomen is the only migrated tour in v1.
- [x] Existing four lessons remain unchanged.
- [x] Task decomposition is acceptable.

Reply `APPROVED` to authorize Task Graph and begin the Builder phase.
