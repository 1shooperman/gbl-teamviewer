# pokemon-cards

## Data

The authoritative source is `~/.cache/pokemon-gbl/mons.db` (SQLite). Derived outputs:

- `.cache/mcp_data.json` — raw rows from the DB
- `src/data/mons.json` — camelCase-mapped frontend data

### Full refresh

```bash
npm run update-data
```

Reads all rows from `mons.db` → writes `.cache/mcp_data.json` → runs `rebuild-mons-cache.ts` → writes `src/data/mons.json`.

### Patch a single mon

```bash
python3 scripts/patch-mon.py <id> <field>=<value> [...]
```

Or via Claude Code: `/update-data <id> <field>=<value> [...]`

Patchable fields: `cp`, `gl_rank`, `shadow`, `purified`, `raw_name`, `species`, `form`, `types`, `sprite_url`, `fast_move`, `fast_move_type`, `fast_move_turns`, `charge_move_1/2` and their `_type/_energy/_attacks`, `legacy_move`, `legacy_move_name`, `has_return`, `notes`.

After patching, run `npm run rebuild-cache` to regenerate `src/data/mons.json`.
