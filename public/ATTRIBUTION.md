# Anatomy data attribution

BodyParts3D, © The Database Center for Life Science licensed under CC Attribution 4.0 International.

- License: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html (updated 2025-02-27)
- Dataset: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- License terms: https://creativecommons.org/licenses/by/4.0/
- Source geometry: `isa_BP3D_4.0_obj_99.zip`, BodyParts3D 4.0.
- English names and relationships: IS-A and PART-OF concept, element, and inclusion tables from the same archive.
- Publication: Mitsuhashi et al. (2009), BodyParts3D: 3D structure database for anatomical concepts. https://doi.org/10.1093/nar/gkn613

Adaptations: axes and units converted from millimeters/Z-up to meters/Y-up; translated to rest at the stage; geometry simplified using meshoptimizer with 0.2% relative error limit per structure; normals quantized to signed 16-bit; packed into binary chunks; curated display system groupings and colors. The source contains 2,234 individual OBJ meshes; all remain represented. The combined hierarchy contains 3,432 named FMA concepts, which may reference multiple meshes. Original source identity is preserved in the manifest.

Source OBJ comments mention an older CC BY-SA 2.1 Japan license. The official current database license linked above supersedes that legacy text and explicitly permits redistribution and adaptation under CC BY 4.0.

BodyParts3D represents an adult male reference anatomy based on TARO MRI and anatomical illustration refinements. It is not a complete model of every possible human anatomical structure or variation. This interface is educational and is not a clinical tool.

## Female reference atlas (restored in this Vietnamese edition)

This edition restores female reference anatomy from the repository history: Kristen Browne and Heidi Schlehlein, Human Reference Atlas / HuBMAP, *3D Reference Organ Set for Female v1.5* (2023). CC BY 4.0. Geometry adapted for this viewer.

- Source DOI: https://doi.org/10.48539/HBM352.BTSQ.586
- Dataset: https://lod.humanatlas.io/ref-organ/united-female/v1.5
- Original GLB: https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.5/assets/3d-vh-f-united.glb
- License: https://creativecommons.org/licenses/by/4.0/

Adaptations: translated native meter/Y-up coordinates onto the stage, coincident vertices welded and source normals averaged, geometry simplified with a 0.2% per-structure relative error bound, and normals quantized. Colors and display systems are curated for this interface. All 888 source meshes are represented, with 1,073 source nodes available as selectable individual or compound concepts.

### Female abdominal layer supplement

The female atlas additionally includes four source meshes from the Human Reference Atlas v1.10 per-organ library: subcutaneous abdominal adipose tissue (umbilicus, right upper quadrant and left upper quadrant areas) and the omentum. CC BY 4.0.

- Female v1.10 metadata: https://cdn.humanatlas.io/digital-objects/ref-organ/united-female/v1.10/metadata.json
- Adipose GLB: https://cdn.humanatlas.io/digital-objects/ref-organ/adipose-female/v1.0/assets/3d-vh-f-adipose.glb
- Omentum GLB: https://cdn.humanatlas.io/digital-objects/ref-organ/omentum-female/v1.0/assets/3d-vh-f-omentum.glb
- HRA 3D Reference Library: https://humanatlas.io/3d-reference-library
- License: https://creativecommons.org/licenses/by/4.0/

Adaptations: source node scale/translation applied, aligned to the existing female stage coordinates, normals quantized to signed 16-bit and packed into a separately compressed progressive-load chunk. The supplement adds 111,864 triangles. It does not claim to represent every abdominal fat compartment; the omentum is not labelled as the entirety of visceral fat.

This is a reference assembly with whole-body surface and selected organs, including female reproductive anatomy. Its skeleton and muscle coverage is partial. It is not a complete model of every human structure or a single-person scan. Eight placenta/umbilical structures are classified under Pregnancy reference and hidden by default.

Vietnamese edition: WebGPU/TSL materials, educational motion illustrations, Vietnamese interface and curated organ labels. 210 female mesh records have missing source labels or identifiers; runtime normalization preserves source mesh IDs and membership and uses an existing singleton concept or a local SOURCE identifier without inventing ontology mappings. Original files are preserved.

Male lung concepts in this package contain bronchial and vascular trees, without parenchymal surface meshes. The UI identifies this coverage. Educational diagrams are schematic, not measured anatomy or physiological simulations.

Educational content references NHLBI (heart/lungs) and NIDDK (digestion/kidneys), linked in each lesson.

## Vietnamese narration

Vietnamese narration across the product was rendered with ElevenLabs `eleven_v3` using the licensed account voice “Viết Linh”. Coverage includes both guided journeys, all four animated lessons, the opening and data-introduction panels, nine curated organ explanations, and fallback explanations for all 17 represented systems. Generation explicitly declares Vietnamese (`vi`); a separate speech-normalization layer supplies natural readings for terms such as “oxy” without changing the educational text shown on screen. Audio loads on demand. This repository contains only rendered MP3 output and timing metadata; it does not contain an API key or reusable voice model.
