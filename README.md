# Cơ thể người — Khám phá từ bên trong

Bản trải nghiệm giáo dục tiếng Việt phát triển từ [Human Atlas của ashemag](https://github.com/ashemag/human-atlas). Kho mã nguồn độc lập: [nclamvn/human-atlas](https://github.com/nclamvn/human-atlas). Bản này đang ở giai đoạn trải nghiệm thử; chưa triển khai website công khai.

## Chạy thử

Yêu cầu Node.js 22.13+.

```sh
git clone https://github.com/nclamvn/human-atlas.git
cd human-atlas
npm ci
npm run dev
```

Mở http://127.0.0.1:3016/. Thêm `?webgl` để kiểm tra WebGL2 dự phòng. Không cần tài khoản hoặc API key.

## Đã triển khai

- Giao diện tiếng Việt, font Inter cục bộ, bố cục desktop/mobile.
- Atlas nam BodyParts3D 4.0: 2.234 mesh / 3.432 khái niệm.
- Atlas nữ HRA v1.5 + lớp bụng HRA v1.10: 892 mesh / 1.075 khái niệm.
- Click/chạm cấu trúc để mở giải thích; tìm kiếm không dấu, xem cận cảnh, bật/tắt hệ cơ quan, xoay/phóng to, tách bộ phận và xuyên thấu.
- Bốn bài: tim, hô hấp, tiêu hóa, thận; sơ đồ chức năng, phát/dừng, tua, tốc độ và giải thích từng giai đoạn.
- Tour Engine dữ liệu hóa: catalogue tải nhẹ, deep link `?tour=<id>&beat=<id>`, lịch sử tiến/lùi, resume cục bộ và scene cue hữu hạn.
- Hành trình 8 nhịp “Theo ‘chân’ giọt máu”: camera và tuyến tuần hoàn riêng theo beat, thuyết minh ElevenLabs tiếng Việt tải động, timestamp/checksum và đồng hồ âm thanh đồng bộ chuyển động.
- Voice Viết Linh phủ toàn bộ lớp nội dung biên tập: 13 cảnh hành trình, 15 bước mô phỏng, mở đầu/giới thiệu dữ liệu, 9 cơ quan chuyên biệt và 17 hệ cơ quan; audio tải theo nhu cầu và dùng chung một tùy chọn bật/tắt được ghi nhớ.
- Chuyên đề Vùng bụng nữ được biên dịch từ registry nguồn/fact/asset/journey, không còn hard-code trong React.
- Three.js 0.186 WebGPU-first / WebGL2 fallback, TSL, vật liệu theo nhóm mô, tải riêng phần đồ họa và từng atlas.

## Kiểm tra

```sh
npm run check
npm test
npm run build
npm audit --omit=dev
```

Biên tập nội dung nằm trong `content/`. Sau khi nội dung được chủ sở hữu duyệt, chạy `npm run content:accept` để cập nhật fingerprint; build thường chỉ chấp nhận dữ liệu khớp baseline. `npm run content:bites` chứng minh gate chặn nguồn thiếu, bằng chứng giả, claim tranh chấp, concept/effect không hợp lệ và checksum thuyết minh bị thay đổi.

Build tĩnh ở `dist/`. Bộ test xác minh mọi buffer của cả hai atlas, ánh xạ ID, bố trí tách ở ba tỷ lệ màn hình và phân biệt chạm/kéo/đa điểm. Xem [báo cáo kiểm thử](docs/vibecode/VERIFY-010.md) để biết phạm vi kiểm tra trực tiếp và các hạng mục chưa nghiệm thu.

## Giới hạn phải đọc

Hai atlas không có cùng độ phủ. Mẫu nữ có các cơ quan chọn lọc; xương và cơ chưa đầy đủ. Phổi mẫu nam chứa cây phế quản và mạch máu nhưng không có bề mặt nhu mô phổi trong gói mesh hiện tại.

Chuyên đề `Vùng bụng nữ` dẫn qua năm lớp kiến thức (định vị, mô mỡ, tiêu hóa, chậu nữ, máu–bạch huyết), tự chuyển sang atlas nữ và progressive-load mỡ dưới da/mạc nối HRA trong một chunk riêng 1,87 MB gzip. Hiệu ứng ánh sáng TSL được dán nhãn minh họa giáo dục; ứng dụng không dựng giả cơ thành bụng hay mạng bạch huyết còn thiếu. Bề mặt nữ có profile tạo hình trình bày nhẹ ở GPU, tăng dần khi tách lớp; profile không thay đổi cơ quan, xương hoặc file HRA nguồn và không dùng cho đo đạc.

Tên Việt đã biên tập cho các cấu trúc phổ biến, chưa bao phủ mọi thuật ngữ chuyên sâu. Cấu trúc chưa dịch dùng tên hệ bằng tiếng Việt kèm mã định danh; tên nguồn giữ trong mục đối chiếu. Không suy đoán tên giải phẫu để lấp dữ liệu trống.

Chuyển động tim/phổi là biến dạng minh họa, không phải mô phỏng cơ sinh học. Tiêu hóa và lọc thận được giải thích bằng sơ đồ chức năng riêng; không giả định mesh bề mặt chứa cấu trúc vi thể. Nội dung tham khảo NHLBI/NIDDK. Cần phản biện chuyên môn trước phát hành giáo dục rộng rãi; không dùng để chẩn đoán hay điều trị.

## Giấy phép

Mã nguồn gốc: [MIT](LICENSE). Dữ liệu giải phẫu: CC BY 4.0, giữ đầy đủ [ghi công và nguồn](public/ATTRIBUTION.md). Không tái sử dụng dữ liệu atlas thương mại có bản quyền hạn chế.

## Lộ trình còn lại

Mặt cắt giải phẫu, biên tập đầy đủ thuật ngữ Việt, đánh giá chuyên gia, tối ưu theo thời gian GPU thực đo, kiểm thử điện thoại thật và ma trận trình duyệt. Hiệu ứng hậu kỳ nâng cao chỉ thêm khi giữ được độ rõ giải phẫu và ngân sách hiệu năng.

Nghiên cứu chuyên đề: [registry 3D vùng bụng–chậu nữ](docs/research/female-abdomen-3d/README.md), gồm manifest 20 GLB HRA, audit nguồn/giấy phép, ma trận coverage và blueprint bài giảng WebGPU.
