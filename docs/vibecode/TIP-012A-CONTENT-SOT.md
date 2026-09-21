# TIP-012A — Content SOT, compiler and bites

## Objective

Create canonical source/fact/asset/journey registries and a deterministic publish gate for Female Abdomen.

## Deliverables

- `content/` registries, captured evidence snapshots and source fingerprints.
- Deterministic compiler producing `public/content/catalog.json` and journey payloads.
- Validation for schema, provenance, evidence spans, atlas concepts, cue allowlists, asset checksum and digest.
- Adversarial bites proving the gates reject corrupted inputs.

## Acceptance criteria

1. Generated output is byte-stable for unchanged input.
2. Missing source, false evidence span, hard disputed claim, unknown concept and unknown cue all fail.
3. Every published fact and asset has provenance; generated payload has a bound SHA-256 digest.
4. Female Abdomen runtime payload is ≤100 kB uncompressed.
5. `npm run content:check` and `npm run content:bites` pass.

Dependencies: approved Blueprint. Priority: P0.
