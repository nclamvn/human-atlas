# Verify Report — Product-wide Vietnamese voice

## Coverage contract

- Guided journeys: 13 narrated beats.
- Product voice collection: 43 clips — 2 interface, 15 lesson, 17 system and 9 organ clips.
- Model contract: `eleven_v3`, `vi`, voice “Viết Linh”.

## Automated gates

- TypeScript must compile without emit.
- Content compiler verifies every MP3/alignment path, duration and SHA-256.
- Adversarial bite rejects a forged product-voice checksum.
- Tour-engine test verifies narration coverage and group counts.
- Production build keeps MP3 files outside JavaScript chunks.
