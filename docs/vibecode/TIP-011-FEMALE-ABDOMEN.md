# TIP-011 — Chuyên đề tương tác vùng bụng nữ

Chủ thầu: chuyển registry nghiên cứu vùng bụng–chậu nữ đã được chủ nhà duyệt thành một vertical slice ngay trong Human Atlas, không tách thành microsite. Phạm vi này kế thừa ADN thị giác, renderer WebGPU/TSL và nguyên tắc nội dung thuần Việt của TIP-010.

## Phạm vi thi công

- Bổ sung hai lớp HRA nữ v1.10 còn thiếu ở atlas hiện tại: mỡ dưới da vùng bụng và mạc nối, giữ nguyên hệ tọa độ HRA và provenance CC BY 4.0.
- Thêm một lối vào chuyên đề nổi bật, tự chuyển sang atlas nữ khi cần.
- Dựng hành trình năm chương: định vị vùng bụng; lớp mỡ; tiêu hóa; không gian chậu nữ; máu và bạch huyết.
- Mỗi chương điều khiển tập cơ quan, camera, isolate/x-ray và bản giải thích tiếng Việt; cho phép tiến/lùi, chọn trực tiếp cơ quan và thoát về toàn thân.
- TSL tạo vi chuyển động ánh sáng có kiểm soát trên cơ quan đang học. Hiệu ứng hoạt động phải có nhãn `MINH HỌA GIÁO DỤC`, không được trình bày như dữ liệu sinh lý đo được.
- Responsive desktop/mobile, keyboard, reduced-motion và fallback WebGL2 tiếp tục hoạt động.

## Ngoài phạm vi

- Không dựng giả cơ thành bụng, dạ dày, mạng mạch bạch huyết hoàn chỉnh hoặc mô bệnh học khi chưa có mesh nguồn được duyệt.
- Không dùng 3D Gaussian Splatting làm lõi vì cấu trúc cần chọn, cô lập và có ngữ nghĩa.
- Không nâng toàn bộ atlas nữ lên GLB whole-body 357 MiB trong TIP này.

## Nghiệm thu

1. Từ màn chính mở được chuyên đề và tự dùng atlas nữ.
2. Có đủ năm chương, tiến/lùi và đóng chuyên đề không mất trạng thái ứng dụng.
3. Mỡ dưới da và mạc nối là mesh HRA thật, đặt đúng hệ tọa độ, có trong tìm kiếm/hệ cơ quan và attribution.
4. Camera tập trung đúng nhóm cơ quan của từng chương; click cơ quan vẫn mở giải thích chuẩn.
5. Nội dung phân biệt rõ `ATLAS THAM CHIẾU` và `MINH HỌA GIÁO DỤC`; nêu thẳng khoảng trống bạch huyết.
6. `npm test`, `npm run check`, `npm run build` đều qua.
7. Có ảnh render kiểm tra desktop và mobile; không che cơ thể, không tràn chữ, không tạo viền neon dày.

Nguồn dữ liệu chính: Human Reference Atlas 3D Reference Object Library v1.10, CC BY 4.0. Nội dung giáo dục dựa trên registry tại `docs/research/female-abdomen-3d/` và phải tiếp tục được chuyên gia giải phẫu/y khoa rà soát trước khi phát hành như học liệu chính thức.
