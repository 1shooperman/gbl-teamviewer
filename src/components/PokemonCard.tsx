'use client';
import { Mon, cardBackground, typeIconUrl } from '@/lib/types';
import styles from './PokemonCard.module.css';

function ShadowFlame() {
  return (
    <svg width="39" height="39" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C11 5 8 8 8 12c0 2.8 1.8 5 4 5s4-2.2 4-5c0-4-4-10-4-10z" fill="url(#flameGrad)"/>
      <path d="M11 10c-.8 1.5-1.2 2.5-1.2 3.5 0 1.2.8 2 1.7 2a1.8 1.8 0 0 0 1.4-.7c-.3-.8-.3-1.8.1-2.8C12.4 13 11 10 11 10z" fill="#D7BDE2" opacity="0.85"/>
      <defs>
        <linearGradient id="flameGrad" x1="12" y1="2" x2="12" y2="17" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6C3483"/>
          <stop offset="100%" stopColor="#C39BD3"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

function PurifiedSunburst() {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * 45 * Math.PI) / 180;
    const x1 = 12 + 5.5 * Math.cos(angle);
    const y1 = 12 + 5.5 * Math.sin(angle);
    const x2 = 12 + 9.5 * Math.cos(angle);
    const y2 = 12 + 9.5 * Math.sin(angle);
    return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1.5" strokeLinecap="round"/>;
  });
  return (
    <svg width="39" height="39" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {rays}
      <circle cx="12" cy="12" r="4" fill="white"/>
      <circle cx="12" cy="12" r="2.5" fill="#FFF9C4"/>
    </svg>
  );
}

export default function PokemonCard({ mon }: { mon: Mon }) {
  const bg = cardBackground(mon.types);
  const displayName = [mon.species, mon.form ? `(${mon.form})` : null].filter(Boolean).join(' ');
  const hasMoves = mon.fastMove || mon.chargeMove1;

  const rankFontSize = mon.glRank != null
    ? (mon.glRank >= 1000 ? 8 : mon.glRank >= 100 ? 10 : 12)
    : 12;

  return (
    <div
      className={[styles.card, mon.shadow ? styles.shadowCard : '', mon.purified ? styles.purifiedCard : ''].join(' ')}
      style={{ background: bg }}
    >
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.name}>{displayName}</span>
        <span className={styles.headerId}>#{mon.id}</span>
        <div className={styles.cpTypes}>
          <span className={styles.cp}>{mon.cp ?? '—'}</span>
          {mon.types.map(t => (
            <img key={t} src={typeIconUrl(t)} alt={t} className={styles.typeIcon} title={t} />
          ))}
        </div>
      </div>

      {/* Pokemon image + overlays */}
      <div className={styles.imageWrap}>
        <img
          src={mon.spriteUrl}
          alt={displayName}
          className={[styles.sprite, mon.shadow ? styles.shadowSprite : ''].join(' ')}
          onError={e => {
            (e.target as HTMLImageElement).src =
              'https://img.pokemondb.net/sprites/home/normal/substitute.png';
          }}
        />

        {/* GL rank — bottom left */}
        {mon.glRank != null && (
          <div className={styles.rankOverlay} style={{ fontSize: rankFontSize }}>
            #{mon.glRank}
          </div>
        )}

        {/* Shadow flame / purified sunburst — bottom right */}
        {mon.shadow   && <div className={styles.iconOverlay}><ShadowFlame /></div>}
        {mon.purified && <div className={styles.iconOverlay}><PurifiedSunburst /></div>}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        {hasMoves ? (
          <div className={styles.moves}>
            {mon.fastMove && (
              <MoveRow
                move={mon.fastMove}
                moveType={mon.fastMoveType}
                stat={mon.fastMoveTurns != null ? `${mon.fastMoveTurns}t` : null}
              />
            )}
            {mon.chargeMove1 && (
              <MoveRow
                move={mon.chargeMove1}
                moveType={mon.chargeMove1Type}
                stat={mon.chargeMove1Energy != null
                  ? `${mon.chargeMove1Energy}e${mon.chargeMove1Attacks != null ? ` (${mon.chargeMove1Attacks})` : ''}`
                  : null}
              />
            )}
            {mon.chargeMove2 && (
              <MoveRow
                move={mon.chargeMove2}
                moveType={mon.chargeMove2Type}
                stat={mon.chargeMove2Energy != null
                  ? `${mon.chargeMove2Energy}e${mon.chargeMove2Attacks != null ? ` (${mon.chargeMove2Attacks})` : ''}`
                  : null}
              />
            )}
          </div>
        ) : (
          <div className={styles.noMoves}>no move data</div>
        )}

        <div className={styles.badges}>
        </div>
      </div>
    </div>
  );
}

function MoveRow({
  move, moveType, stat,
}: {
  move: string;
  moveType: string | null;
  stat: string | null;
}) {
  return (
    <div className={styles.move}>
      {moveType
        ? <img src={typeIconUrl(moveType)} alt={moveType} className={styles.moveTypeIcon} />
        : <span className={styles.moveTypePlaceholder} />
      }
      <span className={styles.moveName}>{move}</span>
      {stat && <span className={styles.moveStat}>{stat}</span>}
    </div>
  );
}
