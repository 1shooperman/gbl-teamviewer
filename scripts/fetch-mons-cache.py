#!/usr/bin/env python3
"""Read mons.db directly and write .cache/mcp_data.json."""

import json
import sqlite3
from pathlib import Path

DB = Path.home() / ".cache/pokemon-gbl/mons.db"
OUT = Path(__file__).parent.parent / ".cache/mcp_data.json"

conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row
rows = conn.execute("SELECT * FROM mons ORDER BY gl_rank ASC").fetchall()
conn.close()

def row_to_dict(row):
    d = dict(row)
    raw = d.get("types")
    try:
        d["types"] = json.loads(raw) if raw else []
    except (json.JSONDecodeError, TypeError):
        d["types"] = []
    return d

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps([row_to_dict(r) for r in rows], indent=2))
print(f"Wrote {len(rows)} mons to {OUT}")
