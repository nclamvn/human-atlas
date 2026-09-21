# TIP-015 — ElevenLabs narration & motion sync

## Goal

Produce Vietnamese narration for all eight beats of “Theo ‘chân’ giọt máu”, load each beat independently, preserve transcript fallback, and use audio time as the deterministic motion clock.

## Requirements

- NAR-001: Eight independent MP3 files; no API key in repository or client bundle.
- NAR-002: Character timing metadata and SHA-256 for every audio/alignment pair.
- NAR-003: Autoplay failure becomes an explicit “Bắt đầu thuyết minh” state, never a dead control.
- NAR-004: Sound can be disabled and enabled again without reloading.
- NAR-005: End of a beat advances to the next beat while narration is enabled.
- NAR-006: Audio time drives blood particles, heart pulse and lung motion; pause freezes the synchronized state.
- NAR-007: Mobile keeps the narration control above long explanatory copy.
- NAR-008: Missing/tampered audio fails the content publish gate.

## Voice decision

Both supplied legacy voice IDs returned `voice_not_found`. The current account voice “Nhật Phong — Narrative & Compelling” was selected because it is Vietnamese, male and designed for narrative delivery.

