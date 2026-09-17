# BLUEPRINT — HUMAN ATLAS / WEBGPU ANATOMY STUDIO

Vibecode Kit v6.1 · Contractor gate · 2026-09-17

## PROJECT INFO

| Field | Value |
|---|---|
| Project | Human Atlas WebGPU Anatomy Studio |
| Location | project root (`human-atlas/`) |
| Branch | `codex/webgpu-anatomy-studio` |
| Nature | public, self-guided, interactive 3D anatomy reference |
| Audience | families, students, curious adults, educators |
| Contract | educational reference; not diagnosis, treatment, or surgery planning |

## NORTH STAR

The body should feel present, dimensional, and discoverable: a museum-grade anatomical lightbox rather than a flat model viewer. Every cinematic effect must reveal structure, spatial relation, or hierarchy. Effects that only decorate the frame are out of scope.

## EXPERIENCE ARC

1. **Arrival — reveal the whole:** a short, skippable light sweep resolves the body from depth and silhouette; the user can interact immediately.
2. **Orient — choose a reference atlas:** adult male or adult female, with source, coverage, and limitations visible before comparison.
3. **Explore — peel by meaning:** system layers, search, semantic hover, and focused camera moves expose relationships without losing context.
4. **Understand — anatomical lenses:** surface, systems, X-ray/transparency, isolate, explode, and section plane.
5. **Inspect — one structure:** camera frames the selection, neighboring anatomy recedes, and verified description/source metadata appears.
6. **Return — never get lost:** a single action restores the whole body, previous lens, and camera orientation.

## INFORMATION ARCHITECTURE

```text
┌──────────────────────────────────────────────────────────────┐
│ HUMAN ATLAS   Male / Female   Search         Quality / About │
├───────────────┬──────────────────────────────┬───────────────┤
│ Systems       │                              │ Structure     │
│ Coverage      │       3D anatomical stage    │ identity      │
│ Lens modes    │   full-bleed, UI recedes     │ relations     │
│ Presets       │                              │ source        │
├───────────────┴──────────────────────────────┴───────────────┤
│ context trail       explode / section depth       reset view │
└──────────────────────────────────────────────────────────────┘
```

On mobile, the stage remains primary. Systems and structure detail become bottom sheets; camera actions use a compact radial/edge control; no persistent panel may cover the selected anatomy.

## VISUAL SYSTEM

### Art direction

- Dark anatomical lightbox: near-black graphite with a cool, low-contrast volumetric field.
- Anatomical materials carry color; chrome UI stays neutral and thin.
- Titles: Inter Variable 200 (Thin); body: Inter 400/500; technical labels: Geist Mono 500.
- UI uses hairline separators, soft depth, and large negative space—not card grids.
- Accent colors are semantic: bone ivory, muscle carmine, arterial vermilion, venous cobalt, nerve amber, lymph jade.

### Renderer and material model

- Three.js `0.186.0` `WebGPURenderer`, preferring WebGPU and falling back automatically to WebGL2.
- Replace `onBeforeCompile` with TSL node materials.
- Preserve batched geometry; add a compact per-structure state texture sampled by TSL using part indices.
- Tissue-family PBR presets: distinct roughness, subsurface approximation, specular response, and transmission only where anatomically useful.
- Image-based environment plus three-point anatomical lighting and grounded contact shadow.
- RenderPipeline with temporal/edge antialiasing, depth/normal AO, restrained selection bloom, and subtle depth cueing.
- Selection contour derives from ID/depth data; never apply a permanent toon outline to the body.
- Section lens uses a real clipping plane with a readable cap treatment and measurement/context cue.

### Motion

- Camera transitions: critically damped and interruptible, 650–900 ms depending on travel.
- Layer reveal: spatially coherent dissolve, not opacity flicker.
- Explode: deterministic path with eased acceleration; parts never teleport or overlap.
- Reduced-motion: instant state changes with short opacity crossfades.
- No looping idle animation except an opt-in 0.1–0.2°/s museum turntable.

## DATA AND SCIENTIFIC INTEGRITY

### Selected sources

| Reference | Role | License | Decision |
|---|---|---|---|
| BodyParts3D 4.0 | adult male whole-body reference | CC BY 4.0 | ship |
| HRA united-female v1.5 | female surface and selected organs | CC BY 4.0 | restore for vertical slice |
| Official HRA newer releases | future female coverage upgrade | CC BY 4.0 | ingest only after official-source audit |
| Z-Anatomy | terminology/quality comparison | CC BY-SA 4.0; male model | do not mix into this asset set now |
| Zygote and other proprietary atlases | possible commercial benchmark | proprietary | exclude |

The UI must never imply that the two atlases have identical completeness or represent all human variation. Search results, layer availability, and comparisons are scoped to the selected source. Source ID, version, adaptation log, and attribution remain reachable from every detail view.

## ARCHITECTURE

```text
React application shell
├── AtlasRegistry (male/female manifests, coverage, provenance)
├── ExperienceState (atlas, lens, systems, selection, camera)
├── AnatomyRenderer
│   ├── WebGPURenderer → WebGL2 fallback
│   ├── TSL material graph + structure state texture
│   ├── RenderPipeline + capability-based quality tier
│   ├── Batched visible geometry
│   ├── Picker/ID path
│   └── Camera, section, explode controllers
├── AtlasLoader (manifest → progressive chunks → cache)
├── SearchIndex (source terms + reviewed aliases)
├── Coverage/Provenance UI
└── Test instrumentation (GPU backend, timings, draw calls)
```

## PERFORMANCE CONTRACT

- Load only the selected atlas; prefetch the other only after idle and only on capable connections.
- First interactive shell: ≤ 2.5 s on a mid-range phone over fast 4G; visible geometry arrives progressively.
- Initial JS target: < 220 kB gzip, excluding Three.js GPU modules split into a dedicated lazy chunk.
- Desktop target: 60 fps at 1440p on a recent integrated GPU; mobile target: stable 30 fps at 1080p-equivalent.
- Frame governor adapts pixel ratio, AO, shadow resolution, temporal AA, and post stack based on measured GPU time—not user-agent strings.
- Idle scene stops rendering; camera/layer changes invalidate frames.
- No duplicate uncompressed anatomy buffers in the deployment artifact when compressed chunks are served.

## ACCESSIBILITY AND INPUT

- Full keyboard operation for search, atlas switch, systems, lenses, selection history, and reset.
- Visible focus independent of color; semantic color always paired with name/icon/text.
- Touch targets ≥ 44 px; pinch/orbit gestures do not fight page scroll or sheets.
- `prefers-reduced-motion`, contrast-safe labels, screen-reader structure summaries, and a non-3D catalogue fallback.
- WebGPU failure is non-fatal: the product reports the active backend and uses WebGL2 automatically.

## FILE STRUCTURE TARGET

```text
app/
├── atlas/          registry, provenance, coverage, search
├── experience/     state machine and user journeys
├── renderer/       WebGPU, TSL, pipeline, quality, picking
├── controls/       camera, explode, section, gestures
├── ui/             chrome, sheets, detail, loading, fallback
└── styles/         tokens and responsive composition
public/models/
├── male/
└── female/
scripts/            conversion, provenance, compression, validation
tests/              unit, interaction, visual, performance
docs/vibecode/      scan, RRI, blueprint, TIPs, completion reports
```

## TASK GRAPH PREVIEW

| TIP | Scope | Depends on | Acceptance gate |
|---|---|---|---|
| TIP-001 | dependency/security cleanup and stable toolchain | none | clean build/check; audit materially reduced |
| TIP-002 | atlas registry, female restore, provenance and coverage | 001 | both atlases validate; only selected assets load |
| TIP-003 | WebGPU-first renderer and TSL state/material migration | 001 | WebGPU + forced-WebGL2 parity |
| TIP-004 | cinematic lightbox, tissue materials, light and post stack | 003 | approved reference screenshots at 3 viewports |
| TIP-005 | lens modes: surface, X-ray, isolate, explode, section | 002,003 | deterministic interaction suite |
| TIP-006 | premium desktop/mobile UI and accessible control model | 002,005 | keyboard/touch/mobile visual QA |
| TIP-007 | streaming, cache, adaptive quality, bundle reduction | 003,006 | budgets met or measured exception documented |
| TIP-008 | scientific content, attribution, source/coverage disclosures | 002,006 | provenance gate passes |
| TIP-009 | end-to-end, visual regression, performance and device matrix | all | release candidate report |

## DEFINITION OF DONE

- Both reference atlases work end-to-end and disclose their unequal coverage.
- WebGPU is genuinely active where supported; WebGL2 fallback is visually and functionally complete.
- All core actions work on desktop and touch: switch, search, select, isolate, layers, lenses, section, explode, reset.
- The body reads as materially rich and spatially grounded, with no decorative effect obscuring anatomy.
- Type, build, data, interaction, visual, accessibility, and performance gates pass.
- Attribution and limitation copy ship in-product and in the repository.
- Completion reports record files, tests, deviations, issues, and follow-up work.

## APPROVAL GATE

- [ ] Architecture accepted
- [ ] Visual direction accepted
- [ ] Open-data/provenance strategy accepted
- [ ] Male/female coverage contract accepted
- [ ] Task graph and quality budgets accepted

Reply `APPROVED` to start BUILD.
