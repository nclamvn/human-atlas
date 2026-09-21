# Thư viện 3D vùng bụng nữ — registry và blueprint triển khai

Ngày kiểm tra: 2026-09-21  
Phạm vi: bài giảng WebGPU/Three.js tiếng Việt về vùng bụng–chậu nữ, ưu tiên dữ liệu miễn phí, có nguồn gốc và giấy phép tái sử dụng rõ ràng.

## Kết luận điều hành

Không có một model miễn phí duy nhất vừa đầy đủ toàn bộ vùng bụng nữ, vừa có độ chi tiết đồng đều, vừa bao phủ hệ tiêu hoá, mô mỡ, sinh dục–sinh sản, mạch máu, bạch huyết, thần kinh, cơ và sàn chậu.

Phương án đúng là một **atlas ghép có provenance**, lấy HRA làm hệ toạ độ chính:

1. **Lõi sản phẩm:** các GLB theo từng cơ quan của Human Reference Atlas (HRA), phiên bản mới nhất theo từng organ, CC BY 4.0.
2. **Mặt cắt thực và kiểm chứng hình thái:** Visible Human Female của NLM, public domain; dùng làm lớp đối chiếu, không coi ảnh thô là mesh đã phân đoạn.
3. **Bổ sung dạ dày, thực quản, tuyến thượng thận và một ca lâm sàng đồng nhất:** AMOS22, CC BY 4.0; chọn ca nữ từ metadata và chỉ dùng sau khi rà soát chất lượng phân đoạn.
4. **Cơ thành bụng:** TotalSegmentator `abdominal_muscles`, Apache-2.0, nhưng phải ghi rõ model chỉ bao phủ T4–L4 và cần kiểm tra thủ công trên ca nguồn.
5. **Mỡ:** HRA có mỡ bụng dưới da và mạc nối/mỡ tạng. TotalSegmentator có phân lớp mỡ tốt hơn nhưng các task `tissue_types`/`tissue_4_types` là task có giấy phép riêng, miễn phí chỉ cho mục đích phi thương mại.
6. **Sàn chậu và tầng sinh môn:** Open3Dmodel/AnatomyTOOL là ứng viên bổ sung CC BY-SA; giữ thành gói asset riêng và xử lý nghĩa vụ ShareAlike trước khi phát hành.
7. **Bạch huyết:** HRA hiện có lách và một hạch mạc treo mẫu với cấu trúc vi mô, **không có mạng dẫn lưu bạch huyết bụng–chậu nữ hoàn chỉnh**. Mạng dòng chảy chỉ được dựng như lớp minh hoạ có nhãn “mô phỏng giáo dục”, không được trình bày như dữ liệu đo từ một cơ thể.

Không dùng BodyParts3D hoặc Z-Anatomy làm “giải phẫu nữ” nền tảng: nguồn BodyParts3D chính thức xác nhận đây là mô hình nam trưởng thành. Chúng có thể làm nguồn đối chiếu tên gọi/hình thái cho cấu trúc không đặc hiệu giới, nhưng không được âm thầm ghép vào vùng chậu nữ.

## Những gì đã được kiểm chứng trực tiếp

### HRA nữ v1.10

- Metadata chính thức ngày 2026-06-09, giấy phép CC BY 4.0.
- GLB whole-body: 374.505.632 byte; quá lớn cho bài giảng web tải một lần.
- Crosswalk chính thức có 874 hàng cấu trúc được gắn ontology, chưa tính header.
- Có cấu trúc nữ quan trọng: âm đạo, tử cung, cổ tử cung, hai buồng trứng, hai vòi tử cung, các dây chằng tử cung/buồng trứng, túi cùng bàng quang–tử cung, mạch tử cung.
- Có lớp bụng quan trọng: mỡ bụng dưới da, mạc nối, gan, tụy, đường mật, ruột non, đại tràng, lách, thận, niệu quản, bàng quang và hệ mạch bụng–chậu.
- Không thấy dạ dày hay thực quản như mesh trong crosswalk `united-female v1.10`.
- Hệ cơ bụng gần như không có; chỉ có một số cơ mắt và cơ đùi. Không dùng node `muscular_system` để suy diễn rằng atlas đã có thành bụng.
- Hệ bạch huyết có lách, tuyến ức và một mô hình hạch mạc treo; không có chuỗi hạch cạnh động mạch chủ, chậu, bẹn và mạng mạch bạch huyết toàn vùng.

### 20 GLB HRA theo cơ quan đã được tải tạm và đo

- Tổng: 41.075.632 byte (39,17 MiB).
- 298 mesh, khoảng 1.363.434 tam giác.
- Có thể progressive-load theo chương thay vì nạp whole-body 357 MiB.
- Mô hình mạch máu nữ có 110 mesh và khoảng 394 nghìn tam giác; đủ giá trị cho một lớp mạch riêng.
- Mô hình hạch nữ có 7 mesh và khoảng 255 nghìn tam giác, thể hiện vi cấu trúc hạch tốt nhưng không đại diện toàn bộ mạng bạch huyết.
- Hai buồng trứng HRA chỉ khoảng 410–424 tam giác mỗi bên: phù hợp để định vị đại thể, không đủ cho cảnh close-up vi cấu trúc. Subdivision hay normal map không thể biến hình học thô thành dữ liệu giải phẫu mới.

Chi tiết từng file nằm trong [hra-abdomen-manifest.csv](./hra-abdomen-manifest.csv).

## Registry nguồn đã lọc

| Ưu tiên | Nguồn | Vai trò | Giấy phép | Quyết định |
|---:|---|---|---|---|
| 1 | HRA 3D Reference Object Library | Hệ toạ độ và mesh cơ quan nữ chính | CC BY 4.0 | Dùng làm lõi |
| 2 | NLM Visible Human Female | Mặt cắt thật, kiểm chứng vị trí/hình thái | Public domain | Dùng làm lớp đối chiếu |
| 3 | AMOS22 | Ca nữ CT/MRI có 15 nhãn tạng, gồm dạ dày và tử cung/prostate tuỳ giới | CC BY 4.0 | Dùng có chọn lọc |
| 4 | Healthy-Total-Body-CTs, TCIA | Ca nữ toàn thân và segmentation CC BY 4.0 | Ảnh CT bị controlled access; segmentation CC BY 4.0 | Ứng viên bổ sung body context |
| 5 | TotalSegmentator | Công cụ tạo phân đoạn cơ bụng/tạng từ CT/MR | Apache-2.0 cho task mở; task mỡ có license riêng | Dùng như công cụ, không coi là asset |
| 6 | Open3Dmodel/AnatomyTOOL | Sàn chậu, tầng sinh môn, dây chằng và mạch | CC BY-SA | Gói bổ sung riêng |
| 7 | BodyParts3D | Đối chiếu ontology/mesh nam | CC BY 4.0 | Không dùng làm nữ |
| 8 | Dundee/Sketchfab | Một số model giảng dạy chi tiết | Tuỳ từng model; nhiều model NC/NoAI/không download | Chỉ nghiên cứu/benchmark nếu chưa kiểm đủ |
| Loại | BioDigital/Zygote | Viewer hoặc asset thương mại | Proprietary | Không đưa vào pipeline miễn phí |

Registry máy đọc được: [source-register.csv](./source-register.csv).

## Các nguồn chính và bằng chứng

### 1. Human Reference Atlas / HuBMAP

- Thư viện 3D chính thức: <https://humanatlas.io/3d-reference-library>
- Metadata HRA united-female v1.10: <https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.10/metadata.json>
- Crosswalk HRA united-female v1.10: <https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.10/assets/crosswalk.csv>
- Portal cũ nêu rõ các reference organ GLB được dựng bởi chuyên gia minh hoạ y khoa, duyệt bởi chuyên gia cơ quan và phát hành CC BY 4.0: <https://hubmapconsortium.github.io/ccf/pages/ccf-3d-reference-library.html>

Điểm mạnh: cùng hệ toạ độ, tên mesh có UBERON/FMA, giấy phép sạch, cơ quan nữ riêng.  
Điểm yếu: mức chi tiết không đồng đều; thiếu dạ dày, cơ thành bụng và mạng bạch huyết bụng–chậu hoàn chỉnh; một số crosswalk có lỗi ngữ nghĩa cần chặn trước khi sinh nội dung tự động.

Ba bất thường metadata đã phát hiện trong crosswalk v1.10:

- `VH_F_superior_rectal_vein` được gắn label “superior rectal artery”.
- `VH_F_inferior_mesenteric_vein` trỏ tới ontology của “superior mesenteric artery”.
- `VH_F_left_anterior_descending_artery` được gắn label thuộc động mạch phổi.

Các entry này phải vào hàng đợi review, không hiển thị mô tả tự động chỉ dựa trên crosswalk.

### 2. NLM Visible Human Female

- Trang chính thức: <https://www.nlm.nih.gov/research/visible/visible_human.html>
- NLM xác nhận đây là thư viện public-domain gồm cryosection, CT và MRI của một nữ hiến xác.
- Bộ nữ có 5.189 ảnh giải phẫu, khoảng cách lát 0,33 mm và voxel màu đẳng hướng 0,33 mm; tổng cỡ khoảng 40 GB.

Điểm mạnh: mặt cắt thật, rất giá trị cho cutaway/slice và kiểm chứng.  
Điểm yếu: dữ liệu của một cá thể, không phải “cơ thể nữ trung bình”; ảnh thô không đồng nghĩa với mesh có nhãn. Mọi segmentation mới phải được kiểm tra bởi chuyên gia.

### 3. AMOS22

- DOI/record: <https://zenodo.org/records/7262581>
- License trong Zenodo API: CC BY 4.0; open access.
- 600 ca CT/MRI, 15 cơ quan có nhãn; metadata có 231 ca nữ và 369 ca nam.
- Nhãn có dạ dày, thực quản, gan, tụy, tá tràng, bàng quang và uterus/prostate theo giới.
- Gói đầy đủ khoảng 24,2 GB, là NIfTI/label volume chứ không phải GLB sẵn dùng.

Điểm mạnh: có ca nữ thống nhất, cho phép dựng dạ dày và các tạng còn thiếu.  
Điểm yếu: cohort đa bệnh lý, hình thái một bệnh nhân không phải reference anatomy; không có buồng trứng/vòi tử cung và không có mạng bạch huyết.

### 4. Healthy-Total-Body-CTs / TCIA

- Collection: <https://www.cancerimagingarchive.net/collection/healthy-total-body-cts/>
- 30 người lớn khoẻ mạnh, CT toàn thân, segmentation và metadata nhân khẩu học.
- Segmentation và clinical data là CC BY 4.0; ảnh CT nằm dưới NIH Controlled Data Access Policy.

Điểm mạnh: body context của người thật, có thể chọn ca nữ theo metadata.  
Điểm yếu: nhãn có thể được gộp; không mặc định đủ chi tiết cho bài về sinh sản và bạch huyết. Không dùng ảnh bị hạn chế nếu chưa có quyền truy cập.

### 5. TotalSegmentator

- Repo chính thức: <https://github.com/wasserth/TotalSegmentator>
- Task `total` 117 lớp và `abdominal_muscles` được công bố cho mọi mục đích theo Apache-2.0.
- `total` có dạ dày, ruột non, tá tràng, đại tràng và bàng quang nhưng không có tử cung, buồng trứng hay vòi tử cung.
- `abdominal_muscles` có rectus abdominis, external/internal oblique, psoas, quadratus lumborum… nhưng chỉ trong T4–L4 và tác giả cảnh báo task dấu `*` được học từ tập nhỏ hơn.
- `tissue_types` và `tissue_4_types` chứa mỡ dưới da, mỡ thân, cơ xương và mỡ gian cơ, nhưng thuộc nhóm cần license; miễn phí chỉ cho sử dụng phi thương mại.

Quy tắc: giấy phép code không tự động biến mọi model weight/task thành Apache-2.0; luôn khóa theo tên task và lưu manifest phiên bản.

### 6. BodyParts3D

- Trang tải chính thức: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
- License hiện hành: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html> — CC BY 4.0.
- README chính thức nói rõ đây là whole-body model của **adult human male**.

Vì vậy BodyParts3D hữu ích cho ontology, cấu trúc không đặc hiệu giới và so sánh coverage; không phải nguồn đúng để lấp im lặng những chỗ thiếu trong vùng chậu nữ.

## Ma trận coverage cho bài giảng

| Lớp kiến thức | Nguồn lõi | Mức sẵn sàng | Khoảng trống phải xử lý |
|---|---|---:|---|
| Da và silhouette bụng | HRA female surface / TCIA female context | Khá | Tối ưu cắt vùng và LOD |
| Mỡ dưới da | HRA adipose-female | Tốt ở mức đại thể | Không có phân lớp vi thể |
| Mỡ tạng và mạc nối | HRA omentum-female | Tốt ở mức đại thể | Cần giải thích mạc nối ≠ toàn bộ visceral fat |
| Cơ thành bụng | TotalSegmentator abdominal_muscles | Trung bình | T4–L4, cần chọn ca và review |
| Phúc mạc/mesentery | HRA omentum + lớp minh hoạ | Thiếu | Không giả vờ lớp dựng thủ tục là mesh đo thật |
| Dạ dày/thực quản | AMOS22/segmentation được duyệt | Trung bình | HRA female v1.10 không có mesh này |
| Ruột non/đại tràng | HRA per-organ GLB | Tốt | Thiếu nhu động thật; animation chỉ minh hoạ |
| Gan–mật–tụy | HRA per-organ GLB | Tốt | Dùng nội cấu trúc đã có; không vẽ thêm ống tuỳ ý |
| Thận–niệu quản–bàng quang | HRA per-organ GLB | Tốt | Cần giới hạn vùng bài giảng |
| Tử cung–cổ tử cung–âm đạo | HRA v1.10 / per-organ | Tốt ở mức đại thể | Histology/nội mạc cần lớp riêng |
| Buồng trứng | HRA | Chỉ định vị | Mesh quá thô cho close-up; cần model vi mô riêng |
| Vòi tử cung/fimbriae | HRA per-organ | Khá | Cilia và vận chuyển noãn là animation minh hoạ |
| Dây chằng vùng chậu | HRA + Open3Dmodel | Khá | Kiểm tra tương thích license và alignment |
| Sàn chậu/tầng sinh môn | Open3Dmodel | Trung bình–khá | CC BY-SA; cần review chuyên gia |
| Mạch máu | HRA blood-vasculature-female | Tốt | Crosswalk có vài lỗi ontology cần curate |
| Hạch và vi cấu trúc hạch | HRA lymph-node-female | Tốt cho một hạch | Không đại diện toàn mạng |
| Dẫn lưu bạch huyết bụng–chậu | Chưa có nguồn mesh mở đủ tốt | Thiếu | Dựng lớp minh hoạ theo tài liệu và dán nhãn rõ |
| Thần kinh tự chủ vùng chậu | Chưa có trong lõi HRA | Thiếu | Cần nguồn mới hoặc minh hoạ được review |

## Blueprint trải nghiệm bài giảng

### Cấu trúc 8 chương

1. **Bản đồ vùng bụng nữ** — xác định 9 vùng bụng, các mốc xương và quan hệ bụng–chậu.
2. **Từ da đến phúc mạc** — peel da, mỡ dưới da, cơ thành bụng, khoang bụng; có thanh cắt ngang thật.
3. **Con đường tiêu hoá** — dạ dày → tá tràng → ruột non → đại tràng; camera chạy theo đường lòng ống, nhu động được ghi rõ là minh hoạ.
4. **Nhà máy chuyển hoá** — gan, đường mật, tụy, lách; isolate theo chức năng và dòng dịch.
5. **Không gian chậu nữ** — bàng quang, tử cung, trực tràng và các túi cùng; chuyển giữa sagittal/coronal/axial.
6. **Sinh sản và chu kỳ** — tử cung, nội mạc, buồng trứng, vòi tử cung; chuyển động noãn và biến đổi nội mạc là diagram 3D, không phải mô phỏng sinh lý định lượng.
7. **Máu và bạch huyết** — mạch tử cung/ovary, hạch mẫu, đường dẫn lưu được mã màu và nhãn mức bằng chứng.
8. **Những điều thường gặp** — chỉ mở sau khi nội dung được bác sĩ/specialist duyệt: u xơ, lạc nội mạc, nang buồng trứng, thai ngoài tử cung, sa tạng chậu và thay đổi mỡ tạng.

### Tương tác cao cấp nhưng phục vụ học tập

- Click một cấu trúc: isolate nhẹ, camera dolly có kiểm soát, popup Việt ngắn + nút “xem quan hệ”.
- Shift-click: so sánh hai cấu trúc và vẽ khoảng cách/đường liên hệ.
- Section lens: clipping plane thật với axial/coronal/sagittal presets; không dùng mặt phẳng giả che model.
- Layer scrubber: da → mỡ → cơ → phúc mạc → tạng → mạch/hạch.
- “Dòng chảy”: hạt GPU cho thức ăn, mật, máu hoặc bạch huyết; màu và tốc độ không được hiểu là số đo lâm sàng nếu không có dữ liệu.
- “Xem hoạt động”: morph/TSL animation cho co bóp tử cung, nhu động ruột, follicle cycle; luôn có badge `MINH HOẠ`.
- Hotspot 3 cấp: `GIẢI PHẪU ĐO/PHÂN ĐOẠN`, `ATLAS THAM CHIẾU`, `MINH HOẠ GIÁO DỤC`.

## Kiến trúc đồ hoạ khuyến nghị

```text
HRA per-organ GLB (CC BY 4.0)
        │
        ├── source manifest + checksum + ontology crosswalk
        ├── geometry QC + expert review queue
        ├── canonical female coordinate frame
        └── meshopt/LOD output by chapter
                 │
AMOS/VHP/TCIA volume ──> segmentation QC ──> optional replacement meshes
                 │
                 ▼
Three.js WebGPU renderer
├── TSL tissue materials
├── clipping + cap pass
├── per-structure ID/state texture
├── GPU flow/diagram layer
├── chapter streaming + cache
└── provenance/detail panel
```

### Nguyên tắc render

- WebGPU/TSL PBR với preset mô: mỡ, cơ trơn, cơ vân, tạng đặc, mạch, màng mỏng.
- Subsurface-scattering approximation chỉ tạo cảm giác mô; không dùng để che mesh sai.
- AO, contact shadow, rim light và transmission tiết chế để đọc được lớp, không làm “ướt nhựa”.
- Selection bằng outline/depth-ID mềm; không viền neon dày.
- 3D Gaussian Splatting không phù hợp làm lõi vì bài học cần cơ quan tách rời, chọn được, cắt được và biến đổi có ngữ nghĩa. Nếu dùng, chỉ dùng cho lớp ảnh thật phụ trợ, không thay mesh giải phẫu.
- Progressive load theo chương. Bộ 20 organ hiện chỉ 39,17 MiB raw, có thể giảm thêm sau meshopt; không nạp GLB toàn thân 357 MiB ở màn đầu.

## Quy trình khoa học và QA bắt buộc

1. Mỗi asset có source URL, version, license, checksum và donor/cohort nếu biết.
2. Không trộn hai donor rồi mô tả là “một cơ thể” nếu chưa đăng ký hình học; UI phải nói rõ composite.
3. Mỗi mesh mới từ CT/MRI phải giữ labelmap gốc, thông số meshing và ảnh QC ba mặt phẳng.
4. Review tối thiểu bởi một chuyên gia giải phẫu/y khoa cho vùng chậu nữ trước khi xuất bản nội dung bệnh lý.
5. Automated gate chặn node thiếu label, ontology mâu thuẫn và mesh self-intersection nghiêm trọng.
6. Screenshot gate ở desktop, tablet và mobile cho từng chương; kiểm tra mặt trước, bên, sau và cutaway.
7. Performance gate: initial shell không chứa model; chương đầu tải dưới 8 MiB nén; các chương sau prefetch theo idle/network.
8. Accessibility: transcript Việt, keyboard, reduced motion, colour + text, nội dung 2D fallback.

## Quyết định về file ZIP người dùng cung cấp

Chi tiết audit nằm trong [attached-zip-audit.md](./attached-zip-audit.md). Kết luận:

- ZIP chỉ có Markdown, JSONL và YAML; không có mã thực thi hay model 3D.
- Các claim có cấu trúc tốt, nhưng 13 snapshot được tham chiếu không nằm trong ZIP nên không thể tái kiểm chứng nguyên trạng.
- Registry trộn “free để xem” với “được phép tải/tái sử dụng”; bản này đã tách lại.
- Claim HRA “36 organ/4.499 structure” mô tả hệ sinh thái HRA rộng, không phải coverage của một GLB nữ cụ thể.
- License BodyParts3D trong dữ liệu cũ cần cập nhật từ CC BY-SA 2.1 Japan thành license chính thức hiện hành CC BY 4.0; đồng thời giữ cảnh báo nguồn là nam trưởng thành.
- TotalSegmentator cần tách license theo task; task mỡ không thuộc nhóm Apache-open mặc định.

## Bước triển khai đề xuất

1. Upgrade atlas nữ hiện tại từ HRA v1.5 lên registry per-organ mới; chưa thay whole-body ngay.
2. Dựng vertical slice ba chương: `da–mỡ–cơ`, `tiêu hoá`, `chậu nữ`.
3. Thêm provenance badge và coverage honesty trước khi thêm hiệu ứng.
4. Chạy render/QC trên 20 GLB HRA; quyết định replacement mesh cho ovary và stomach.
5. Sau khi nghiệm thu hình thái, mới triển khai animation chu kỳ, nhu động và dòng bạch huyết.

Không commit model nguồn 374 MB vào Git. Asset build phải nằm ngoài source repo hoặc qua release/object storage, kèm manifest và checksum.
