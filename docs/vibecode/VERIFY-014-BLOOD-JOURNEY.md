# Verify Report — TIP-014

## Automated gates

- `npm run check` — PASS
- `npm test` — PASS
  - Content provenance + digest gate
  - 5/5 adversarial content bites
  - Atlas nam/nữ + interaction + abdomen + presentation profile
  - Tour reducer, URL, persistence, multi-journey fixture
- `npm run build` — PASS
- Bundle budget — PASS
  - app: ~80,2 kB gzip
  - graphics: ~260,9 kB gzip
  - journey catalogue/runtime: ~12,8 kB raw

## Visual/runtime audit

- Desktop WebGPU: PASS — xác nhận `.scene[data-backend="webgpu"]`.
- Desktop WebGL2 `?webgl`: PASS — xác nhận `.scene[data-backend="webgl2"]`, không console error/warning.
- Mobile 390 × 844: PASS — 8 chapter vừa một hàng; narrative cuộn; catalogue hai journey không chồng view controls.
- URL sâu: PASS — `/\?tour=blood-journey&beat=right-heart` và `gas-exchange` mở đúng beat.
- Reduced-motion contract: PASS theo code path — tắt particle progression, nhịp tim/phổi; vẫn giữ hình tĩnh và nội dung.

## Requirement trace

- BJ-001…BJ-005: PASS qua content compiler, fact evidence và visual audit.
- BJ-006: PASS qua scene timing/reduced-motion branch.
- BJ-007…BJ-008: PASS qua catalogue và per-beat transcript.
- BJ-009: PASS trên WebGPU + WebGL2 thực tế.
- BJ-010: PASS ở viewport 390 × 844.

