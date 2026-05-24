---
name: agent-data-updater
description: >
  Produces the Summary and Components sections for a PR description by analyzing
  git diff and changed files. Examples:

  <example>
  Context: update-data skill is rebuilding cached pokemon
  assistant: "Running data-updater agent to rebuild cache"
  </example>
allowed-tools: [Bash, Read, Write, mcp__plugin_pokemon-gbl_mons-db__list_mons, mcp__plugin_pokemon-gbl_mons-db__collection_summary]
model: haiku
color: purple
---

## Instructions

1. Use `mcp__plugin_pokemon-gbl_mons-db__list_mons` to fetch the full collection. Paginate with `offset` in increments of 50 until all records are retrieved (check total via `mcp__plugin_pokemon-gbl_mons-db__collection_summary` if needed).

2. Write the raw array (snake_case, exactly as returned by the MCP server) to:

```
.cache/mcp_data.json
```

3. Run the mapper script:

```bash
npx tsx scripts/rebuild-mons-cache.ts
```

4. Report back:
   - Total mons written
   - Any warnings or missing-data exits from the script
