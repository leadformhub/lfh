"""Parse GSC Performance xlsx export — used by gsc-ctr-report.ts"""
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

xlsx = sys.argv[1]
ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}

with zipfile.ZipFile(xlsx) as z:
    shared: list[str] = []
    if "xl/sharedStrings.xml" in z.namelist():
        root = ET.fromstring(z.read("xl/sharedStrings.xml"))
        for si in root.findall(".//m:si", ns):
            texts = []
            for t in si.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t"):
                if t.text:
                    texts.append(t.text)
            shared.append("".join(texts))

    def parse_sheet(name: str) -> dict[int, dict[int, str]]:
        root = ET.fromstring(z.read(name))
        rows: dict[int, dict[int, str]] = {}
        for c in root.findall(".//m:c", ns):
            ref = c.get("r", "")
            m = re.match(r"([A-Z]+)(\d+)", ref)
            if not m:
                continue
            col, row = m.group(1), int(m.group(2))
            ci = sum((ord(x) - 64) * (26**i) for i, x in enumerate(reversed(col)))
            t = c.get("t")
            v = c.find("m:v", ns)
            val = v.text if v is not None else ""
            if t == "s" and val.isdigit():
                val = shared[int(val)]
            rows.setdefault(row, {})[ci] = val
        return rows

    daily = parse_sheet("xl/worksheets/sheet1.xml")
    clicks = sum(float(daily[r].get(2, 0) or 0) for r in daily if r > 1)
    impr = sum(float(daily[r].get(3, 0) or 0) for r in daily if r > 1)
    ctr = clicks / impr if impr else 0

    queries = parse_sheet("xl/worksheets/sheet2.xml")
    near = []
    for r in sorted(queries.keys()):
        if r == 1:
            continue
        q = queries[r].get(1, "")
        c = float(queries[r].get(2, 0) or 0)
        i = float(queries[r].get(3, 0) or 0)
        pos = float(queries[r].get(5, 0) or 0)
        if 5 <= pos <= 15 and i >= 5:
            near.append({"q": q[:80], "impr": i, "clicks": c, "pos": pos, "ctr": c / i if i else 0})

    pages = parse_sheet("xl/worksheets/sheet3.xml")
    top0 = []
    for r in sorted(pages.keys()):
        if r == 1:
            continue
        url = pages[r].get(1, "")
        c = float(pages[r].get(2, 0) or 0)
        i = float(pages[r].get(3, 0) or 0)
        pos = float(pages[r].get(5, 0) or 0)
        if c == 0 and i >= 20 and pos <= 20:
            top0.append({"url": url, "impr": i, "pos": pos})

    print(
        json.dumps(
            {
                "clicks": clicks,
                "impr": impr,
                "ctr": ctr,
                "near": sorted(near, key=lambda x: -x["impr"])[:10],
                "zero_ctr": sorted(top0, key=lambda x: -x["impr"])[:10],
            }
        )
    )
