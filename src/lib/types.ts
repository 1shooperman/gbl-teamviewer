export interface Mon {
  id: number;
  rawName: string;
  species: string;
  form: string | null;
  shadow: boolean;
  purified: boolean;
  cp: number | null;
  glRank: number | null;
  fastMove: string | null;
  fastMoveType: string | null;
  fastMoveTurns: number | null;
  chargeMove1: string | null;
  chargeMove1Type: string | null;
  chargeMove1Energy: number | null;
  chargeMove1Attacks: number | null;
  chargeMove2: string | null;
  chargeMove2Type: string | null;
  chargeMove2Energy: number | null;
  chargeMove2Attacks: number | null;
  legacyMove: boolean;
  legacyMoveName: string | null;
  hasReturn: boolean;
  notes: string | null;
  types: string[];
  spriteUrl: string;
}

export const TYPE_COLORS: Record<string, string> = {
  normal:   '#8A8A6A',
  fire:     '#E8601A',
  water:    '#2E7EE8',
  electric: '#E8B800',
  grass:    '#38A838',
  ice:      '#38B8C0',
  fighting: '#C02020',
  poison:   '#8020A8',
  ground:   '#C08018',
  flying:   '#6040D8',
  psychic:  '#E81868',
  bug:      '#68A808',
  rock:     '#988028',
  ghost:    '#403890',
  dragon:   '#4010D8',
  dark:     '#3A2C28',
  steel:    '#6878A8',
  fairy:    '#D83878',
};

export function cardBackground(types: string[]): string {
  if (types.length === 0) return '#C6C6A7';
  if (types.length === 1) return TYPE_COLORS[types[0]] ?? '#C6C6A7';
  const c1 = TYPE_COLORS[types[0]] ?? '#C6C6A7';
  const c2 = TYPE_COLORS[types[1]] ?? '#C6C6A7';
  return `linear-gradient(135deg, ${c1} 0%, ${c2} 100%)`;
}

export function typeIconUrl(type: string): string {
  return `https://raw.githubusercontent.com/msikma/pokesprite/master/misc/types/gen8/${type}.png`;
}
