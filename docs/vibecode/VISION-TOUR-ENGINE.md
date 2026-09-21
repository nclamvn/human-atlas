# VISION — Human Atlas Tour Engine v1

Generated: 2026-09-21

## PROJECT NATURE

- Interface: immersive responsive webapp/PWA-ready shell.
- Lifecycle: choose journey → load exact atlas/assets → play/pause/branch through beats → explore → finish/resume.
- Data flow: canonical sources and captured evidence → deterministic SOT registry → journey compiler → static runtime catalogue → WebGPU scene.
- User model: anonymous public user; progress stored locally.
- Scale: public static delivery, content-heavy but compute-local.
- State: URL for shareable location; reducer for live journey state; localStorage for resume only.

## PRODUCT PROMISE

“Du hành bên trong cơ thể bằng câu chuyện, không gian 3D và tương tác—dễ hiểu bằng tiếng Việt, đáng tin ở mức khoa học phổ thông.”

## ARCHITECTURE

```text
CANONICAL CONTENT (not served directly)
content/
├── sources/ + snapshots/       provenance and captured evidence
├── facts/                      sourced/disputed/illustrative claims
├── assets/                     atlas/geometry/license registry
└── journeys/                   narrative beats and scene cues
                 │
                 ▼
DETERMINISTIC CONTENT GATE
validate IDs · evidence spans · source drift · concept resolution
digest registry · reject unresolved publish blockers
                 │
                 ▼
GENERATED RUNTIME CONTENT
public/content/catalog.json + journey bundles
                 │
                 ▼
TOUR RUNTIME
URL adapter ↔ state-machine reducer ↔ persistence
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
GENERIC TOUR UI        SCENE COMMAND BRIDGE
catalogue/story/audio  focus/layers/camera/effect
       │                   │
       └─────────┬─────────┘
                 ▼
EXISTING THREE.JS WEBGPU / WEBGL2 ENGINE
```

## CORE CONTRACTS

### Journey

- Stable ID, version, title, summary, audience and atlas requirement.
- Ordered beat IDs.
- Optional narration defaults and resume policy.
- Source and asset dependencies generated into the build manifest.

### Beat

- Story copy and referenced SOT fact IDs.
- Structure selectors and exact required concepts.
- Scene cue: systems, focus, isolate, lens and transition.
- Camera cue: semantic view, distance multiplier, target offset, duration and easing.
- Effect cue selected from a finite engine registry.
- Evidence badge and educational-illustration disclosure.
- Optional narration source, transcript and timed cue markers.

### Runtime state

```text
idle → resolving → atlas-loading → beat-entering → ready
                                      ↕
                                  playing/paused
                                      ↓
                                  completing → complete
Any state → recoverable-error → retry/exit
```

## USER FLOWS

### First visit

Body map → choose “Vùng bụng nữ” → explicit start gesture → switch/load female atlas → cinematic beat 01 → next/back/direct beat → finish → return to body map.

### Deep link

Open `?tour=female-abdomen&beat=pelvis` → validate IDs → load female atlas → enter pelvis beat → browser back returns to the previous beat or exits the tour.

### Resume

Return to product → offer lightweight “Tiếp tục chuyến đi” → reject stored state if journey version or beat no longer exists.

### Failure

Missing geometry/audio/network → retain transcript and exit path → retry exact failed dependency → never leave a blank canvas.

## DESIGN DIRECTION

Preserve the accepted Human Atlas ADN:

- Inter Variable weight 200 for cinematic titles; 400 for body.
- Graphite/navy environment, tissue-derived accent per journey.
- Hairline navigation and restrained glass only where readability needs it.
- Camera movement and model reveal carry the spectacle; UI remains quiet.
- Evidence is a compact badge/footnote, not an academic panel.
- Mobile uses a top beat rail, central 3D viewport and bottom narrative sheet.

## TECHNICAL DIRECTION

- Retain React, Vite, strict TypeScript and Three.js WebGPU/TSL.
- No new router/state/schema dependency for v1.
- Canonical data authored as JSON; generated runtime JSON imported/fetched statically.
- Project-owned deterministic compiler/validator in Node.
- Web Audio/HTMLAudio lifecycle isolated behind one narration controller.
- Effect and camera registries expose declarative IDs only.
- Scene remains responsible for geometry and rendering; Tour runtime never reaches into Three objects.

## CONTENT/SOT DIRECTION

- SOT is intentionally invisible during normal travel.
- Each fact keeps `statement`, `evidenceLevel`, `status`, `sourceIds`, `captureId`, exact `evidenceSpan` and optional conflict records.
- Each asset keeps source URL, license, version, checksum and coordinate-frame note.
- A compiler digest binds catalogue, journey, facts and source registry.
- Runtime bundles contain only approved public fields; captured source snapshots remain build-time artifacts.
- Live web scraping is never part of the viewer.

## SUCCESS DEFINITION FOR V1

The engine is proven when Female Abdomen renders from generated journey data with accepted visual equivalence, deep-link/resume works, malformed/provenance-incomplete content cannot build, and a second synthetic fixture journey can pass the compiler/tests without editing application or renderer source.
