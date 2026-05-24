---
name: update-data
description: Use this skill when the user asks to update the mon cache, refresh the data, sync mons.json, or runs /update-data. Pulls the full collection from the mons-db MCP server and writes it to src/data/mons.json.
user-invocable: true
---

## Instructions

Use the `mcp__plugin_pokemon-gbl_mons-db__list_mons` tool to fetch the full collection. The collection may exceed the default limit — paginate using `offset` in increments of 50 until you have retrieved all records (check against `collection_summary` total if needed).

Assemble all records into a single JSON array and write it to:

```
src/data/mons.json
```

Keys in the output must be camelCase to match the existing file schema (e.g. `gl_rank` → `glRank`, `raw_name` → `rawName`, `fast_move` → `fastMove`, etc.).

Report back:
- Total mons written
- Any records that were skipped or had missing data
