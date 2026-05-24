/**
 * Maps .cache/mcp_data.json (raw MCP output) → src/data/mons.json.
 *
 * Run /update-data first to refresh .cache/mcp_data.json from the MCP server.
 * Usage: npx tsx scripts/rebuild-mons-cache.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Mon } from '../src/lib/types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_PATH = path.join(__dirname, '..', '.cache', 'mcp_data.json');
const OUT_PATH = path.join(__dirname, '..', 'src', 'data', 'mons.json');

if (!fs.existsSync(CACHE_PATH)) {
  console.error(`ERROR: ${CACHE_PATH} not found. Run /update-data to populate the cache.`);
  process.exit(1);
}

const raw: Record<string, unknown>[] = JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
const warnings: string[] = [];

function req<T>(mon: Record<string, unknown>, key: string): T {
  if (mon[key] == null) warnings.push(`id=${mon['id']} missing required field: ${key}`);
  return mon[key] as T;
}

const output: Mon[] = raw.map((m) => ({
  id: req<number>(m, 'id'),
  rawName: req<string>(m, 'raw_name'),
  species: req<string>(m, 'species'),
  form: m['form'] as string | null,
  shadow: m['shadow'] === 1,
  purified: m['purified'] === 1,
  cp: m['cp'] as number | null,
  glRank: m['gl_rank'] as number | null,
  fastMove: m['fast_move'] as string | null,
  fastMoveType: m['fast_move_type'] as string | null,
  fastMoveTurns: m['fast_move_turns'] as number | null,
  chargeMove1: m['charge_move_1'] as string | null,
  chargeMove1Type: m['charge_move_1_type'] as string | null,
  chargeMove1Energy: m['charge_move_1_energy'] as number | null,
  chargeMove1Attacks: m['charge_move_1_attacks'] as number | null,
  chargeMove2: m['charge_move_2'] as string | null,
  chargeMove2Type: m['charge_move_2_type'] as string | null,
  chargeMove2Energy: m['charge_move_2_energy'] as number | null,
  chargeMove2Attacks: m['charge_move_2_attacks'] as number | null,
  legacyMove: m['legacy_move'] === 1,
  legacyMoveName: m['legacy_move_name'] as string | null,
  hasReturn: m['has_return'] === 1,
  notes: (m['notes'] === '' ? null : m['notes']) as string | null,
  types: (m['types'] as string[] | null) ?? [],
  spriteUrl: req<string>(m, 'sprite_url'),
}));

fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf8');
console.log(`Wrote ${output.length} mons to ${OUT_PATH}`);

if (warnings.length) {
  console.warn(`\n${warnings.length} warning(s):`);
  warnings.forEach((w) => console.warn(`  ${w}`));
  process.exit(1);
}
