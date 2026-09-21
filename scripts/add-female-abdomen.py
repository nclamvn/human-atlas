"""Append HRA female abdominal adipose and omentum meshes to atlas-female.

Usage:
  python3 scripts/add-female-abdomen.py ADIPOSE.glb OMENTUM.glb

The two inputs are official HRA per-organ GLBs (CC BY 4.0).  They share the
Visible Human female coordinate frame used by the current atlas; this script
applies node scale/translation, converts normals to normalized int16 and adds
the same stage Y translation as convert-female.py.
"""
from __future__ import annotations

from array import array
import gzip
import json
import math
from pathlib import Path
import struct
import sys

ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT / "public" / "models"
ATLAS_PATH = MODEL_DIR / "atlas-female.json"
OUTPUT_NAME = "female-abdomen.bin"
OUTPUT_URL = f"/models/{OUTPUT_NAME}"
STAGE_Y_SHIFT = .794760942
PREFIXES = ("VH_F_subcutaneous_abdominal_adipose_tissue", "VH_F_omentum")

FORMATS = {5126: ("f", 4), 5125: ("I", 4), 5123: ("H", 2), 5121: ("B", 1)}
WIDTHS = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}


def load_glb(path: Path):
    source = path.read_bytes()
    if source[:4] != b"glTF":
        raise ValueError(f"{path.name} is not a binary glTF file")
    json_length = struct.unpack_from("<I", source, 12)[0]
    doc = json.loads(source[20:20 + json_length])
    binary_start = 20 + json_length + 8
    return doc, memoryview(source)[binary_start:]


def read_accessor(doc, binary, index: int):
    accessor = doc["accessors"][index]
    view = doc["bufferViews"][accessor["bufferView"]]
    fmt, size = FORMATS[accessor["componentType"]]
    width = WIDTHS[accessor["type"]]
    offset = view.get("byteOffset", 0) + accessor.get("byteOffset", 0)
    stride = view.get("byteStride", width * size)
    if stride == width * size:
        values = array(fmt)
        values.frombytes(binary[offset:offset + accessor["count"] * width * size])
        return values
    values = array(fmt)
    for item in range(accessor["count"]):
        values.extend(struct.unpack_from("<" + fmt * width, binary, offset + item * stride))
    return values


def world_transform(doc, node_index: int):
    parent = {}
    for index, node in enumerate(doc["nodes"]):
        for child in node.get("children", []):
            parent[child] = index
    chain = []
    cursor = node_index
    while True:
        chain.append(cursor)
        if cursor not in parent:
            break
        cursor = parent[cursor]
    scale = [1.0, 1.0, 1.0]
    translation = [0.0, 0.0, 0.0]
    for index in reversed(chain):
        node = doc["nodes"][index]
        if "matrix" in node or "rotation" in node:
            raise ValueError(f"Unsupported rotation/matrix on node {node.get('name', index)}")
        local_scale = node.get("scale", [1.0, 1.0, 1.0])
        local_translation = node.get("translation", [0.0, 0.0, 0.0])
        translation = [translation[i] + scale[i] * local_translation[i] for i in range(3)]
        scale = [scale[i] * local_scale[i] for i in range(3)]
    return scale, translation


def transformed_meshes(path: Path):
    doc, binary = load_glb(path)
    result = []
    for node_index, node in enumerate(doc["nodes"]):
        if "mesh" not in node:
            continue
        scale, translation = world_transform(doc, node_index)
        positions = array("f")
        normals = array("h")
        indices = array("I")
        for primitive in doc["meshes"][node["mesh"]]["primitives"]:
            if primitive.get("mode", 4) != 4:
                raise ValueError(f"Non-triangle primitive in {node.get('name')}")
            source_positions = read_accessor(doc, binary, primitive["attributes"]["POSITION"])
            source_normals = read_accessor(doc, binary, primitive["attributes"]["NORMAL"])
            source_indices = read_accessor(doc, binary, primitive["indices"])
            base = len(positions) // 3
            for i in range(0, len(source_positions), 3):
                positions.extend((
                    source_positions[i] * scale[0] + translation[0],
                    source_positions[i + 1] * scale[1] + translation[1] + STAGE_Y_SHIFT,
                    source_positions[i + 2] * scale[2] + translation[2],
                ))
            for i in range(0, len(source_normals), 3):
                nx = source_normals[i] / scale[0]
                ny = source_normals[i + 1] / scale[1]
                nz = source_normals[i + 2] / scale[2]
                length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
                normals.extend(max(-32767, min(32767, round(v / length * 32767))) for v in (nx, ny, nz))
            indices.extend(int(value) + base for value in source_indices)
        extras = node.get("extras", {})
        result.append({
            "id": node["name"],
            "name": extras.get("label") or node["name"].replace("VH_F_", "").replace("_", " "),
            "conceptId": extras.get("representation_of") or extras.get("ontologyid") or f"HRA:{node['name']}",
            "system": "adipose",
            "positionsData": positions,
            "normalsData": normals,
            "indicesData": indices,
            "vertexCount": len(positions) // 3,
            "indexCount": len(indices),
            "bounds": [
                [min(positions[i::3]) for i in range(3)],
                [max(positions[i::3]) for i in range(3)],
            ],
        })
    return result


def append_aligned(blob: bytearray, values: array):
    while len(blob) % 4:
        blob.append(0)
    offset = len(blob)
    blob.extend(values.tobytes())
    return offset


def main():
    if len(sys.argv) != 3:
        raise SystemExit("Expected adipose.glb and omentum.glb")
    atlas = json.loads(ATLAS_PATH.read_text())
    original_chunks = list(atlas["chunks"])
    old_chunk_urls = {chunk["url"] for chunk in original_chunks}
    atlas["parts"] = [part for part in atlas["parts"] if not part["id"].startswith(PREFIXES)]
    atlas["concepts"] = [concept for concept in atlas["concepts"] if not concept["id"].startswith("HRA:VH_F_subcutaneous_abdominal_adipose_tissue") and concept["id"] != "HRA:VH_F_omentum"]
    atlas["chunks"] = [chunk for chunk in atlas["chunks"] if chunk["url"] != OUTPUT_URL]
    old_to_new = {url: index for index, url in enumerate(chunk["url"] for chunk in atlas["chunks"])}
    for part in atlas["parts"]:
        old_url = original_chunks[part["chunk"]]["url"]
        if old_url in old_to_new:
            part["chunk"] = old_to_new[old_url]

    source_parts = transformed_meshes(Path(sys.argv[1])) + transformed_meshes(Path(sys.argv[2]))
    blob = bytearray()
    chunk_index = len(atlas["chunks"])
    new_parts = []
    for item in source_parts:
        part = {key: value for key, value in item.items() if not key.endswith("Data")}
        part.update({
            "chunk": chunk_index,
            "positions": append_aligned(blob, item["positionsData"]),
            "normals": append_aligned(blob, item["normalsData"]),
            "indices": append_aligned(blob, item["indicesData"]),
        })
        new_parts.append(part)
    output = MODEL_DIR / OUTPUT_NAME
    output.write_bytes(blob)
    compressed = gzip.compress(bytes(blob), compresslevel=9)
    output.with_suffix(".bin.gz").write_bytes(compressed)
    atlas["parts"].extend(new_parts)
    atlas["chunks"].append({"url": OUTPUT_URL, "bytes": len(blob), "gzip": OUTPUT_URL + ".gz", "gzipBytes": len(compressed)})
    atlas["concepts"].extend([
        {"id": "HRA:VH_F_subcutaneous_abdominal_adipose_tissue", "name": "subcutaneous abdominal adipose tissue", "elements": [part["id"] for part in new_parts if "subcutaneous_abdominal" in part["id"]]},
        {"id": "HRA:VH_F_omentum", "name": "omentum", "elements": [part["id"] for part in new_parts if part["id"] == "VH_F_omentum"]},
    ])
    atlas["triangles"] = sum(part["indexCount"] // 3 for part in atlas["parts"])
    atlas["version"] = "HRA united-female v1.5 + abdominal layers v1.10"
    atlas["scope"] = "Female reference assembly · selected v1.10 adipose layers · partial skeleton and muscle coverage"
    ATLAS_PATH.write_text(json.dumps(atlas, separators=(",", ":")))
    print(json.dumps({
        "partsAdded": len(new_parts),
        "trianglesAdded": sum(part["indexCount"] // 3 for part in new_parts),
        "bytes": len(blob),
        "gzipBytes": len(compressed),
        "bounds": {part["id"]: part["bounds"] for part in new_parts},
        "previousChunkUrls": len(old_chunk_urls),
    }, ensure_ascii=False))


if __name__ == "__main__":
    main()
