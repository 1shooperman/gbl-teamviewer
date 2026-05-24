#!/usr/bin/env python3
"""Patch a single mon in mons.db by id.

Usage: python3 scripts/patch-mon.py <id> <field>=<value> [...]
"""

import json
import sqlite3
import sys
from pathlib import Path

DB = Path.home() / ".cache/pokemon-gbl/mons.db"

ALLOWED = {
    "raw_name", "species", "form",
    "cp", "gl_rank", "shadow", "purified",
    "fast_move", "fast_move_type", "fast_move_turns",
    "charge_move_1", "charge_move_1_type", "charge_move_1_energy", "charge_move_1_attacks",
    "charge_move_2", "charge_move_2_type", "charge_move_2_energy", "charge_move_2_attacks",
    "legacy_move", "legacy_move_name", "has_return",
    "notes", "types", "sprite_url",
}

INTEGER_FIELDS = {
    "cp", "gl_rank", "shadow", "purified", "fast_move_turns",
    "charge_move_1_energy", "charge_move_1_attacks",
    "charge_move_2_energy", "charge_move_2_attacks",
    "legacy_move", "has_return",
}

if len(sys.argv) < 3:
    print("Usage: patch-mon.py <id> <field>=<value> [...]", file=sys.stderr)
    sys.exit(1)

mon_id = int(sys.argv[1])
pairs = sys.argv[2:]

updates = {}
for pair in pairs:
    if "=" not in pair:
        print(f"Bad argument (expected field=value): {pair}", file=sys.stderr)
        sys.exit(1)
    field, _, raw = pair.partition("=")
    if field not in ALLOWED:
        print(f"Unknown field: {field}. Allowed: {sorted(ALLOWED)}", file=sys.stderr)
        sys.exit(1)
    if raw == "null":
        value = None
    elif field == "types":
        value = json.dumps(json.loads(raw))
    elif field in INTEGER_FIELDS:
        value = int(raw)
    else:
        value = raw
    updates[field] = value

conn = sqlite3.connect(DB)
conn.row_factory = sqlite3.Row

row = conn.execute("SELECT * FROM mons WHERE id = ?", (mon_id,)).fetchone()
if not row:
    print(f"No mon with id={mon_id}", file=sys.stderr)
    sys.exit(1)

print(f"Patching: {row['raw_name']} (id={mon_id})")
for field, new_val in updates.items():
    old_val = row[field]
    print(f"  {field}: {old_val!r} → {new_val!r}")

set_clause = ", ".join(f"{f} = ?" for f in updates)
conn.execute(
    f"UPDATE mons SET {set_clause} WHERE id = ?",
    list(updates.values()) + [mon_id],
)
conn.commit()
conn.close()
print("Done.")
