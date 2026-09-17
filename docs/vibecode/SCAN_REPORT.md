# SCAN REPORT — Human Atlas WebGPU

Generated: 2026-09-17

## TECH_STACK

- Language: TypeScript 5.9, React 19
- Framework: Vite 8 static SPA
- 3D: Three.js 0.159, `WebGLRenderer`, custom GLSL through `onBeforeCompile`
- Styling: Tailwind CSS 4 plus application CSS
- State: local React state; no database, auth, or backend
- Deployment: static Vercel build
- Data: custom JSON manifest plus chunked binary geometry and gzip copies

## EXISTING_MODULES

- `app/page.tsx`: application shell, catalogue, layer controls, search, details, camera controls.
- `app/scene.tsx`: renderer, merged geometry, GPU state texture, lighting, picking, camera framing.
- `app/anatomy.ts`: anatomical taxonomy, descriptions, types, presentation categories.
- `app/explosion-layout.ts`: deterministic non-overlapping exploded layout.
- `app/model-download.ts`: chunked model download and decompression.
- `app/agent-tools.ts`: optional WebMCP inspection/search actions.
- `scripts/*`: conversion, simplification, compression, atlas and interaction validation.

## DATA INVENTORY

| Atlas | Source | Meshes | Concepts | Systems | Triangles | Browser payload |
|---|---|---:|---:|---:|---:|---:|
| Adult male | BodyParts3D 4.0 | 2,234 | 3,432 | 15 | 2,288,268 | ~33 MB gzip |
| Adult female (historical branch) | HRA united-female v1.5 | 888 | 1,073 | 14 | 1,810,038 | 10 lazy chunks |

The public `main` branch is male-only, but the repository history contains a valid female conversion pipeline and browser-ready v1.5 assets. The female source is a reference assembly with partial skeleton and muscle coverage, not a symmetric equivalent of BodyParts3D.

## PATTERNS_DETECTED

- All visible meshes are merged into a small number of batches to reduce draw calls.
- A per-part GPU texture stores translation, visibility, and selection state.
- Hidden individual picker meshes preserve accurate structure selection.
- Camera moves are damped and event-driven; the scene does not render continuously when idle.
- Exploded placement is precomputed from bounds and viewport aspect ratio.
- Dataset attribution and educational limitations are already visible in the product.

## REUSABLE_COMPONENTS

- Batched anatomical scene and picker architecture.
- Deterministic exploded-layout solver.
- Chunked download/decompression path.
- Search over source names, identifiers, and compound concepts.
- Validation scripts for buffers, concepts, search, pointer gestures, and explosion packing.

## GAPS_DETECTED

- The renderer is WebGL-only and Three.js is 27 releases behind current stable `0.186.0`.
- `onBeforeCompile` shader injection cannot be carried forward as-is to WebGPU/TSL.
- Materials are nearly uniform and visually flat; tissue classes lack meaningful optical distinction.
- No cinematic reveal, anatomical lens modes, section plane, depth hierarchy, or premium transition system.
- Female assets exist only in Git history and are not shipped by `main`.
- Male and female coverage differ materially; there is no first-class coverage matrix in the UI.
- Static bundle is 916.37 kB JS / 264.00 kB gzip and 196.58 kB CSS / 31.10 kB gzip.
- The dependency graph contains unused framework/UI packages and 11 audit findings (8 high, 2 moderate, 1 low; no critical).
- Browser visual regression and device performance tests are absent.

## CODE_HEALTH

- Type safety: strict TypeScript check passes.
- Build: production build passes.
- Data validation: all 2,234 male meshes and 3,432 concepts pass.
- Interaction contracts: search, inspection, packing, pointer/touch tests pass.
- Source size: 117 tracked/non-dependency files; core app/scripts are approximately 515 lines.
- Debug artifacts: only intentional command-line reporting in build/validation scripts.
- Git status at scan: clean on `codex/webgpu-anatomy-studio`.

## SOURCE AND LICENSE FINDINGS

- Application code: MIT.
- BodyParts3D: CC BY 4.0; required attribution must ship with the product.
- HRA female reference data: CC BY 4.0; every adaptation must remain documented.
- Z-Anatomy is useful for terminology and comparison but is male-only and CC BY-SA 4.0, so it is not selected as the primary female source.
- Proprietary atlases such as Zygote are excluded from the open-data build.
