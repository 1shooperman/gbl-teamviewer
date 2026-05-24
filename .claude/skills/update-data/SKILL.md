---
name: update-data
description: >
  Use this skill when the user asks to update the mon cache, refresh the data, sync mons.json,
  or push an update to a specific mon. Triggers: "update mon #<id>", "set <field> on <id>",
  "refresh data", "sync mons.json", or runs /update-data [id] [field=value ...].
user-invocable: true
---

## Two modes

### 1. Full refresh (no arguments)

Run:
```bash
npm run update-data
```

### 2. Patch a single mon

Usage: `/update-data <id> <field>=<value> [<field>=<value> ...]`

Updatable fields and their DB column names:

| Field | DB column | Type |
|---|---|---|
| cp | cp | integer |
| gl_rank | gl_rank | integer |
| fast_move | fast_move | text |
| fast_move_type | fast_move_type | text |
| fast_move_turns | fast_move_turns | integer |
| charge_move_1 | charge_move_1 | text |
| charge_move_1_type | charge_move_1_type | text |
| charge_move_1_energy | charge_move_1_energy | integer |
| charge_move_1_attacks | charge_move_1_attacks | integer |
| charge_move_2 | charge_move_2 | text |
| charge_move_2_type | charge_move_2_type | text |
| charge_move_2_energy | charge_move_2_energy | integer |
| charge_move_2_attacks | charge_move_2_attacks | integer |
| legacy_move | legacy_move | boolean (0/1) |
| legacy_move_name | legacy_move_name | text |
| has_return | has_return | boolean (0/1) |
| notes | notes | text |
| types | types | json array e.g. '["fire","flying"]' |
| sprite_url | sprite_url | text |

Steps:
1. Parse `<id>` as integer. Parse each `<field>=<value>` pair.
2. Run the patch directly against the DB:

```bash
python3 scripts/patch-mon.py <id> <field>=<value> ...
```

3. After a successful patch, run `npm run rebuild-cache` to regenerate `src/data/mons.json`.
4. Report what changed (old → new for each field).

If the user doesn't provide an id, ask for it. If a field name is ambiguous, confirm before patching.
