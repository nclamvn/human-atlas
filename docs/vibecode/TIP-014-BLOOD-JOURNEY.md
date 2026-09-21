# TIP-014 — Theo “chân” giọt máu

**Trạng thái:** APPROVED — tên và hướng triển khai đã được chủ nhà chốt.

## Mục tiêu

Xây flagship journey đầu tiên của Tour Engine ngoài chuyên đề vùng bụng nữ, chứng minh engine có thể kể một quá trình sinh lý bằng dữ liệu, camera và hiệu ứng 3D đồng bộ.

## Requirements

- BJ-001: Content SOT có source snapshot NHLBI, fact registry và journey 8 nhịp.
- BJ-002: Mọi `focusConcepts` phải tồn tại trong `atlas.json`.
- BJ-003: Có 8 camera cue hữu hạn và 8 effect cue hữu hạn.
- BJ-004: Dòng máu là GPU particle layer, không ghi đè hình học nguồn.
- BJ-005: Beat `gas-exchange` chuyển màu lam → đỏ và ghi rõ là minh họa giáo dục.
- BJ-006: Tim đập và phổi thở chỉ khi hành trình cần, tôn trọng reduced motion.
- BJ-007: Catalogue hiển thị nhiều hành trình; bài Tim legacy vẫn còn truy cập qua chi tiết cơ quan.
- BJ-008: Beat có transcript riêng, hiển thị khi audio chưa được cung cấp.
- BJ-009: WebGPU và `?webgl` đều không lỗi runtime.
- BJ-010: Mobile không tràn chapter rail và narrative panel.

## Files dự kiến

- `content/sources/*`, `content/facts/blood-journey.json`, `content/journeys/blood-journey.json`
- `app/tour/types.ts`, `app/tour/validate.ts`, `scripts/content/compile-content.mjs`
- `app/scene-cues/*`, `app/anatomy.ts`, `app/scene.tsx`
- `app/page.tsx`, `app/tour/TourExperience.tsx`, `app/globals.css`
- validation scripts và generated public content

## Rủi ro / rollback

- Rủi ro shader: layer particle tách biệt; có thể tắt bằng effect `none` mà không ảnh hưởng atlas.
- Rủi ro camera: cue registry hữu hạn; rollback từng cue độc lập.
- Rủi ro nội dung: Content SOT fail-loud nếu fact, source hay concept không khớp.

