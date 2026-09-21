# TIP-012D — Scene cue bridge and migration

## Objective

Translate finite semantic scene cues into existing Three.js/WebGPU renderer state and migrate Female Abdomen fully to generated content.

## Deliverables

- Camera and effect cue registries.
- General scene command fields replacing `abdomenChapter` coupling.
- Generated journey integration in `page.tsx`.
- Removal of redundant bespoke Female Abdomen data/component after parity.

## Acceptance criteria

1. Content cannot inject code or arbitrary camera matrices/effects.
2. Each beat resolves required female atlas concepts before becoming ready.
3. Opening from male loads the correct atlas before applying beat selection.
4. WebGPU and forced WebGL2 use the same semantic cue path.
5. Four legacy lessons remain unchanged and functional.

Dependencies: TIP-012B, TIP-012C. Priority: P0.
