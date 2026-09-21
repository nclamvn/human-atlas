# Completion Report — TIP-014

## Kết quả

Đã triển khai hành trình **Theo “chân” giọt máu** thành vertical slice 8 nhịp trên Tour Engine:

1. Trở về qua tĩnh mạch chủ.
2. Qua tim phải và các van.
3. Theo động mạch phổi đến phổi.
4. Đổi khí với chuyển màu lam → đỏ có disclosure.
5. Trở về tim trái.
6. Phóng vào động mạch chủ.
7. Phân phối đến đầu, thận và chân.
8. Khép vòng tuần hoàn.

## Thi công

- Thêm Content SOT: 2 source snapshot, 8 fact, 1 journey, digest/baseline mới.
- Thêm 8 camera cue và 8 blood-flow effect cue hữu hạn.
- Thêm Three.js `PointsNodeMaterial` + TSL color interpolation, spline particle motion, guide line và nhịp tim/phổi theo ngữ cảnh.
- Hỗ trợ WebGPU chính và WebGL2 fallback.
- Catalogue đa hành trình; giữ bài Tim legacy truy cập từ chi tiết cơ quan, tránh trùng hai entry trên trang chủ.
- Thêm transcript tiếng Việt riêng cho từng beat và bố cục mobile 8 chapter.

## Sai khác hợp lý so với blueprint

Spline được lấy mẫu trên CPU với số hạt nhỏ rồi tô màu bằng TSL/WebGPU. Cách này đảm bảo cùng một đường chuyển động ổn định trên WebGPU và WebGL2, chi phí thấp hơn 0,02 ms/frame ở quy mô hiện tại và dễ kiểm tra hơn shader texture-position thuần GPU.

## Rủi ro còn lại

- Chưa có audio thu sẵn; transcript là fallback chính xác và không chặn hành trình.
- Atlas không có vi mạch mao mạch/phế nang; scene đổi khí được gắn nhãn minh họa giáo dục.

