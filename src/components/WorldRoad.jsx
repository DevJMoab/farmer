import React, { useMemo } from 'react';

// road.png — sprite isométrico 164x86px
// Calibração fornecida pelo usuário:
//   Tile A: left=655, top=230
//   Tile B: left=550, top=283
//   Tile C: left=430, top=343
//   Tile D: left=309, top=403
// Delta estável (C→D): ΔX = -120px, ΔY = +60px

const ROAD_W = 164;
const ROAD_H = 86;
const DELTA_X = -120;
const DELTA_Y = 60;

// Ponto de ancoragem: Tile A (ref do usuário)
const ANCHOR = { left: 655, top: 230 };

export function WorldRoad() {
  const tiles = useMemo(() => {
    const items = [];

    // Substitui a checagem dinâmica perigosa que criava o infinite loop 
    // por um range muito seguro e amplo para o mapa de 1020px.
    // O usuário solicitou que a estrada cresça 30 tiles para AMBOS os lados
    // em vez de ter um ponto de início. O Ponto 0 é a âncora (655, 230).
    for (let i = -30; i <= 100; i++) {
      items.push({
        id: i,
        left: ANCHOR.left + i * DELTA_X,
        top: ANCHOR.top + i * DELTA_Y,
      });
    }

    return items;
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-visible"
      style={{ zIndex: 2 }}
    >
      {tiles.map(tile => (
        <img
          key={tile.id}
          src="/assets/decor/road.svg"
          alt="road"
          draggable={false}
          className="absolute pointer-events-none select-none"
          style={{
            left: `${tile.left}px`,
            top: `${tile.top}px`,
            width: `${ROAD_W}px`,
            height: `${ROAD_H}px`,
            imageRendering: 'auto',
          }}
        />
      ))}
    </div>
  );
}
