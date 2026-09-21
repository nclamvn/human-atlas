# Verify Report — TIP-015

## Asset verification

- Eight MP3 files generated successfully.
- Manifest identifies `eleven_v3`, Vietnamese `vi`, and the approved Viết Linh voice.
- `afinfo`: MPEG-3, mono, 44,100 Hz, ~128 kbps.
- Each MP3 and alignment JSON matches the SHA-256 stored in `content/narration/blood-journey.json`.
- Corrupt-checksum bite is rejected by the compiler.

## Runtime verification

- Enable narration: audio starts and progress clock advances.
- Disable then re-enable: playback resumes without reload.
- End of beat: URL, narrative, scene cue and next audio advance together.
- Autoplay restriction: explicit start state is rendered.
- Mobile 390 × 844: player is visible immediately beneath the lead paragraph.
- No browser console errors observed during playback.

## Automated verification

- `npm run check` — PASS
- `npm test` — PASS
- `npm run build` — PASS
- Bundle budgets — PASS; MP3 assets remain outside JS chunks.
