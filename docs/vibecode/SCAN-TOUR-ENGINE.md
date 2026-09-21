# SCAN REPORT — Human Atlas Tour Engine v1

Generated: 2026-09-21  
Scan type: focused full scan for architectural change  
Branch: `codex/webgpu-anatomy-studio`

## TECH_STACK

- Language: TypeScript 5.9 strict, Python 3 conversion tools, Node.js validation scripts.
- Framework: React 19.2 + Vite 8.3 static SPA.
- Graphics: Three.js 0.186 WebGPU-first, TSL node materials, automatic WebGL2 fallback.
- Styling: one project-owned CSS system, local Inter Variable Vietnamese/Latin fonts.
- State: local React state; no router, reducer, persistence, database or authentication.
- Data: custom atlas JSON + aligned binary chunks + gzip variants.
- Deploy shape: static output, no server dependency and no runtime API keys.

## CURRENT MODULES

- `app/page.tsx`: shell, atlas loading, lesson/tour state, search, selection, dialogs and nearly every UI transition.
- `app/scene.tsx`: renderer, material graphs, chunk loading, picking, camera fitting, semantic state textures and hard-coded lesson effects.
- `app/education.ts`: Vietnamese taxonomy, four lesson records, descriptions and selection rules.
- `app/female-abdomen.ts`: five hard-coded beats and their organ focus.
- `app/female-abdomen-experience.tsx`: bespoke chapter navigation and story panel.
- `app/anatomy.ts`: atlas and scene contracts.
- `app/model-download.ts`: progressive binary fetch/decompression.
- `app/agent-tools.ts`: optional WebMCP anatomy search/inspection.
- `scripts/*`: source conversion, compression, atlas/interaction/content validation.

## REUSABLE FOUNDATIONS

- Batched geometry plus per-part GPU visibility/selection texture.
- Source concept → mesh selection and automatic focus bounds.
- Event-driven renderer with damped camera flight and reduced-motion support.
- Progressive atlas/chunk loading and safe dataset switch.
- Mobile/desktop visual language already accepted by the owner.
- Five-beat female-abdomen vertical slice is a suitable migration oracle.
- Deterministic source/mesh validation and interaction regression tests.

## PATTERNS DETECTED

- UI and runtime state are colocated in a single page component.
- Lessons and tours use different data shapes and different UI paths.
- Scene behavior is selected by string fields such as `lesson` and `abdomenChapter`.
- Camera framing is semantic and robust, but cues are not addressable as reusable content data.
- URL does not encode atlas, tour or beat; refresh/back/forward cannot preserve a journey.
- No local progress or resume contract.
- Provenance exists in Markdown/research files but is not a machine-enforced publishing dependency for each fact/beat.
- Asset source, educational claim and visual-effect disclosure are not yet linked by one registry.

## GAPS DETECTED

### P0 architecture

- A new tour requires modifying React/Three.js source.
- No canonical journey schema, validator, compiler, registry or player state machine.
- No generic effect/camera cue registry; arbitrary per-tour conditionals will accumulate in `scene.tsx`.
- No deterministic content publish gate tying facts and assets to provenance.
- No deep link, browser-history integration or resume behavior.

### P1 product

- Tour catalogue and free exploration share one shell but have no explicit navigation model.
- Narration schema and global audio lifecycle are absent.
- Loading state is atlas-wide rather than beat-aware.
- Existing four lessons cannot yet be authored through the future engine.

### P2 operations

- No content preview command or generated catalogue report.
- No telemetry contract, PWA/offline cache or content CMS.
- No automatic web-refinery ingestion; current research is curated manually.

## CODE HEALTH

- Type safety: strict TypeScript, current check passes.
- Automated checks: atlas buffers/concepts, packing, pointer/touch, search/inspection and female-abdomen contracts.
- Visual verification: desktop 1280×720 and mobile 390×844 performed for TIP-011.
- Linting: not configured.
- Debug artifacts: no browser console warning/error observed; CLI reporting is intentional.
- Core app/scripts: approximately 1,000 physical lines, with several files intentionally compressed into long lines.
- Current production bundle: 79.48 kB gzip application JS; 260.23 kB gzip lazy graphics JS; 7.24 kB gzip CSS.
- Git state: contains the approved but uncommitted TIP-011 feature and research artifacts; they must be preserved.

## CONTRACTOR CONCLUSION

Keep the renderer, atlas format, visual system and accepted female-abdomen experience. Replace only the coupling layer between content and runtime. Tour Engine v1 should first prove that an equivalent tour can be created from validated content data without editing `page.tsx` or `scene.tsx`.
