# Blueprint — Theo “chân” giọt máu

## Lời hứa trải nghiệm

Người học đi theo một giọt máu qua một vòng tuần hoàn: mô → tĩnh mạch chủ → tim phải → phổi → tim trái → động mạch chủ → các mô. Mỗi nhịp đồng bộ nội dung tiếng Việt, cấu trúc atlas, góc máy và lớp dòng chảy GPU.

## Phạm vi vertical slice

- 8 nhịp kể chuyện, dùng atlas nam vì có độ phủ tim–mạch–phổi tốt nhất trong kho hiện tại.
- Hiệu ứng dòng máu WebGPU/TSL, có fallback WebGL2; màu lam–đỏ là quy ước oxy hóa, không phải phép đo sinh lý.
- Camera bespoke cho từng chặng; nhịp tim và nhịp thở chỉ chạy khi phù hợp.
- Nội dung nguồn chính thức NHLBI, provenance được khóa vào Content SOT.
- Bản chữ tiếng Việt theo từng nhịp; kiến trúc giữ chỗ cho audio có nguồn sau.

## Ngoài phạm vi

- Không mô phỏng CFD, vận tốc thật, áp suất thật hay vi tuần hoàn mao mạch.
- Không dùng cho chẩn đoán hoặc đào tạo thủ thuật y khoa.
- Không thay thế bốn bài học legacy; bài Tim cũ vẫn dùng được từ chi tiết cơ quan.

## Nghiệm thu

1. Người dùng mở hành trình từ màn khám phá và đi đủ 8 nhịp bằng chuột, bàn phím, URL sâu.
2. Mỗi nhịp chọn đúng khái niệm atlas; không có tên cấu trúc ảo.
3. Dòng hạt chạy theo tuyến riêng của từng nhịp; nhịp đổi khí chuyển lam sang đỏ.
4. Nội dung có nguồn, disclosure và fallback bản chữ.
5. TypeScript, content gate, bite tests, interaction tests và production build đều đạt.

