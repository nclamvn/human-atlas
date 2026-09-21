# TASK GRAPH — Human Atlas Tour Engine v1

Blueprint: `BLUEPRINT-TOUR-ENGINE.md` — approved by Homeowner on 2026-09-21.

```text
TIP-012A  Content SOT + compiler + adversarial bites       P0
    │
    ├── TIP-012B  Runtime contracts + state + URL/resume   P0
    │       │
    │       ├── TIP-012C  Generic catalogue/player UI      P0
    │       │
    │       └── TIP-012D  Scene cue bridge + migration     P0
    │                       │
    └───────────────────────┴── TIP-012E  QA/budgets/docs  P0
```

## Execution rule

Tasks run sequentially in dependency order. A task closes only when its acceptance criteria and verification command pass. Existing legacy lessons remain operational throughout migration.

## Definition of done

- One data-only Female Abdomen journey is compiled from canonical content and rendered by the generic engine.
- A synthetic second journey passes compiler/runtime tests without editing application or renderer source.
- Content provenance, digest and adversarial gates fail loudly.
- URL, resume, narration fallback, keyboard and reduced-motion contracts pass.
- WebGPU-first rendering and WebGL2 fallback remain intact.
- Production build respects the approved budgets and visual render gate.
