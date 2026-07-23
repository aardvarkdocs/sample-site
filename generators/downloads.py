"""Emit the product catalog as downloadable CSV / JSON / YAML files.

Where `generators/pricing.py` uses `generate()` to write a Markdown *page*, this one uses
`emit()` — the generator writer for arbitrary *output files*. It reads the same
`data/products.yaml` the site templates use and publishes three finished exports readers
can download straight from the docs:

    /downloads/products.csv
    /downloads/products.json
    /downloads/products.yaml

`emit(path, content)` writes `content` verbatim to `path` in the build output (a `str` is
encoded UTF-8; pass `bytes` for a binary format — an image, a zip, a Parquet file). The
files aren't pages: they're never parsed, rendered, or listed in the nav/search/sitemap —
they're just bytes served at the URL you name. And because the output tree is rebuilt every
build, dropping one here makes it disappear on the next build; there's nothing stale to clean
up. The [Build-time Python](/generators/) page links to all three as a live demo.

Output is deterministic (a fixed column order and sorted keys), so an unchanged catalog
re-emits identical bytes and `vark dev` never churns.
"""

import csv
import io
import json

import yaml

# The three catalog fields worth exporting (icon/color are presentation-only). One tuple so
# the CSV header, the CSV rows, and the JSON/YAML records all stay in the same order.
FIELDS = ("name", "price", "blurb")

# Project each item into a plain dict: `data` values are read-only DotDicts, which json/yaml
# can't serialize directly, so we pull out just the fields we want. Direct indexing (not
# .get) is deliberate — if the catalog is missing or malformed, fail the build loudly rather
# than publish blank downloads.
records = [{f: item[f] for f in FIELDS} for item in data["products"]["items"]]

# CSV — build it with the stdlib csv writer so quoting/escaping is correct.
buf = io.StringIO()
writer = csv.DictWriter(buf, fieldnames=FIELDS)
writer.writeheader()
writer.writerows(records)
emit("downloads/products.csv", buf.getvalue())

# JSON — pretty-printed, sorted keys for a stable diff across builds.
emit("downloads/products.json", json.dumps(records, indent=2, sort_keys=True) + "\n")

# YAML — sort_keys keeps the output deterministic here too.
emit("downloads/products.yaml", yaml.safe_dump(records, sort_keys=True, allow_unicode=True))
