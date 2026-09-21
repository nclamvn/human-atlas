# Audit `files.zip`

Ngày audit: 2026-09-21  
Nguồn người dùng: `/Users/os/Downloads/files.zip`

## Hash và inventory

| File | SHA-256 |
|---|---|
| `files.zip` | `8de12b633d5c15c122dfe4fd9794233ec74a65db05f1c8ce8c66a41b145fc8be` |
| `REGISTRY_3D_giai_phau_bung_nu.md` | `4e563f1e65985d79cd0d0850abcfa8b21c4620f2877a902db540cc3ad0b835f2` |
| `claims_female_abdomen_3d.jsonl` | `1143fda0b6a69c0bb8e964cd13dff8f5b66ca9cf9dafcb38df5843671dc0ea97` |
| `domain_female_abdomen_3d.yaml` | `fde07a42d4c352b44b23d527c42bb67389b15fe4869cf6650de605a606d6b03c` |

ZIP có đúng ba tệp văn bản, không có executable, script, binary model hay nested archive. Nội dung được đọc như dữ liệu tham khảo; không có hướng dẫn trong tệp nào được thực thi.

## Cấu trúc dữ liệu

- 52 claim JSONL.
- 10 entity nguồn.
- 48 claim tier A, 4 claim tier B theo metadata bên trong.
- 13 tên snapshot khác nhau được tham chiếu trong `capture.snapshot`.
- Không có snapshot nào được đóng gói trong ZIP.

Do thiếu snapshot, tier A/B trong ZIP chỉ là **tự khai báo của gói dữ liệu**, chưa đạt trạng thái VERIFIED có thể tái chạy. Audit hiện tại phải đối chiếu lại bằng nguồn chính thức.

## Điểm tốt

- Schema có `entity`, `field`, `value`, `evidence_span`, `tier` và thông tin capture.
- Đã nhận diện phần lớn nguồn quan trọng: HRA, Visible Human, TotalSegmentator, BodyParts3D, Open3Dmodel, Dundee, Ella, Zygote và BioDigital.
- Có ý thức phân biệt nguồn mở, nguồn phi thương mại và nguồn thương mại.

## Điểm phải sửa

1. **Snapshot không đi cùng claim.** Không thể chứng minh evidence span vẫn thuộc đúng nội dung đã capture.
2. **HRA coverage bị suy rộng.** “36 organs / 4.499 structures” là mô tả HRA rộng, không phải số mesh trong GLB nữ cụ thể. Crosswalk `united-female v1.10` kiểm tra ngày 2026-09-21 có 874 hàng cấu trúc.
3. **BodyParts3D license đã cũ.** Trang chính thức cập nhật 2025-02-27 dùng CC BY 4.0; không tiếp tục phát hành registry mới với CC BY-SA 2.1 Japan như kết luận hiện tại.
4. **BodyParts3D là nam.** Dùng được cho tham chiếu, không được đánh dấu là female-specific.
5. **TotalSegmentator bị gộp license.** Code và task mở là Apache-2.0, nhưng `tissue_types`/`tissue_4_types` cần license riêng và miễn phí chỉ phi thương mại.
6. **Free-to-view không bằng reusable.** BioDigital/Sketchfab embed hay tài khoản miễn phí không tự tạo quyền tải, sửa và phân phối mesh.
7. **ShareAlike bị diễn giải quá rộng.** CC BY-SA cần đánh giá ở cấp asset/adaptation/collection cụ thể; không nên khẳng định pháp lý rằng toàn bộ phần mềm phải đổi license nếu chưa phân tích cách đóng gói. Giữ asset riêng và xin tư vấn khi phát hành thương mại.
8. **Thiếu quality metric.** Registry cũ không ghi triangle count, mesh granularity, coordinate compatibility, donor/cohort và khả năng close-up.

## Quyết định nhập dữ liệu

- Không nhập nguyên xi 52 claim vào Source of Truth.
- Giữ ZIP như nguồn đầu vào lịch sử bằng hash ở trên.
- Tạo registry mới trong `source-register.csv`, dùng nguồn chính thức và ghi rõ trạng thái reuse.
- Những claim chưa có snapshot hoặc chỉ có nguồn thứ cấp giữ trạng thái `manual-review`/`candidate-only`.
