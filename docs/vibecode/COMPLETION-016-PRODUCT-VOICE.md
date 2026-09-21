# Completion Report — Product-wide Vietnamese voice

## Delivered

- One consistent narrator: Viết Linh, ElevenLabs `eleven_v3`, language `vi`.
- 13/13 guided-journey beats narrated: 8 blood-circulation beats and 5 female-abdomen beats.
- 43 reusable product clips: opening, data introduction, 15 animated-lesson steps, 17 system explanations and 9 curated organ explanations.
- Lesson audio advances the lesson step and drives the visual phase instead of running beside an unrelated animation clock.
- Audio remains opt-in when browser autoplay is blocked, persists one global narration preference across every surface, and loads only for the current screen.
- Standard written Vietnamese remains on screen; speech-only normalization handles technical pronunciation.

## Security and delivery

- The ElevenLabs key is used only as a generation-process environment variable.
- The client receives static MP3 and timing metadata; no credential or reusable voice model is shipped.
- Every asset has a SHA-256 digest and character-level timing file checked by the content gate.
