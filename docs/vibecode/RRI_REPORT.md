# RRI REPORT — Human Atlas WebGPU

Generated: 2026-09-17

## REQUIREMENTS MATRIX

| ID | Requirement | Source | Priority | Verification |
|---|---|---|---|---|
| REQ-001 | Clone into a project fully separate from COSMOS and Rasuwa | User | P0 | independent folder, Git branch, build |
| REQ-002 | Preserve searchable/selectable anatomical structures | Existing product | P0 | data and interaction suites |
| REQ-003 | Ship adult male and female reference atlases | User | P0 | atlas switch plus coverage tests |
| REQ-004 | Use open, attributable, provenance-tracked anatomical data | User + source licenses | P0 | attribution/provenance gate |
| REQ-005 | Replace WebGL-only rendering with Three.js WebGPU-first architecture | User | P0 | WebGPU and forced-WebGL2 matrix |
| REQ-006 | Maximize visual quality without reducing anatomical legibility | User | P0 | cinematic visual acceptance set |
| REQ-007 | Make tissue families visually distinguishable | Product audit | P0 | material/layer comparison shots |
| REQ-008 | Add surface, systems, X-ray, isolate, explode, and section lens modes | Product audit | P1 | interaction E2E tests |
| REQ-009 | Preserve touch-first mobile usability | Existing product | P0 | phone/tablet visual tests |
| REQ-010 | Lazy-load only the chosen atlas and adapt quality to device capability | Performance audit | P0 | network and frame-budget tests |
| REQ-011 | Disclose unequal male/female dataset coverage | Scientific integrity | P0 | visible coverage matrix |
| REQ-012 | State educational/reference use and non-diagnostic limitations | Scientific integrity | P0 | visible content assertion |
| REQ-013 | Remove unused/vulnerable dependency surface | Security audit | P0 | audit and dependency review |
| REQ-014 | Keep effects restrained, deterministic, and reduced-motion accessible | UX audit | P0 | accessibility tests |

## AUTO-ANSWERED FROM SCAN

- Reuse the static Vite/React architecture; no backend is required for the atlas viewer.
- Reuse batched geometry, picker meshes, chunk loader, search, and exploded-layout solver.
- Female v1.5 assets can be restored from project history with known CC BY 4.0 provenance.
- Three.js must move from `0.159` to current stable `0.186.0`; Vite must move from `8.0.13` to `8.3.0`.

## DECISIONS LOG

| ID | Options considered | Decision | Rationale |
|---|---|---|---|
| D-001 | WebGPU-only / WebGPU-first with fallback | WebGPU-first, automatic WebGL2 fallback | visual ambition without excluding Safari/older mobile GPUs |
| D-002 | Preserve GLSL injection / migrate to TSL | TSL node materials | one material graph can compile to WGSL or GLSL |
| D-003 | One universal body / separate atlases | separate male and female atlases | the source coverage and donors are not equivalent |
| D-004 | Restore HRA v1.5 / import unverified third-party v1.10 | restore audited v1.5 first; validate official v1.10 as a later data upgrade | removes provenance and transformation ambiguity from the vertical slice |
| D-005 | Photoreal gore / clinical plastic / premium educational realism | premium educational realism | materially rich and dimensional without sensationalism |
| D-006 | blanket bloom and outlines / semantic emphasis | restrained, selection-only emphasis | protects scientific readability |

## OPEN QUESTIONS DEFERRED BEYOND VERTICAL SLICE

- Whether the official HRA v1.10 assembly should replace v1.5 after a separate provenance and coverage audit.
- Whether Vietnamese anatomical terminology should use a licensed specialist terminology source or a reviewed editorial layer.
- Whether future narratives should include motion illustrations such as breathing or cardiac pulsation; if added, they must be labelled as illustrative, not physiological simulation.
