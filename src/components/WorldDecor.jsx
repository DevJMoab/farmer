import React from 'react';

// =============================================
// REFLORESTAMENTO - Densidade Alta
// Assets: tree.svg, tree2.svg, tree3.svg
// =============================================

// Matrizes de florestamento, mantendo o corredor diagonal livre para a estrada
// e as construções no centro.

const DECOR_ITEMS = [
  // ===== FLORESTA NOROESTE (Acima da estrada, canto esquerdo)
  ...[
    { t: 'tree', x: 2, y: 3, s: 75 }, { t: 'tree2', x: 8, y: 5, s: 65 }, { t: 'tree3', x: 15, y: 2, s: 70 },
    { t: 'tree2', x: 4, y: 12, s: 80 }, { t: 'tree', x: 12, y: 15, s: 60 }, { t: 'tree3', x: 22, y: 8, s: 70 },
    { t: 'tree', x: 6, y: 20, s: 75 }, { t: 'tree2', x: 18, y: 24, s: 65 }, { t: 'tree', x: 25, y: 16, s: 85 },
    { t: 'tree3', x: 10, y: 28, s: 55 }, { t: 'tree2', x: 2, y: 35, s: 72 }, { t: 'tree', x: 15, y: 32, s: 68 }
  ].map((item, idx) => ({ id: `nw${idx}`, type: item.t, left: item.x, top: item.y, size: item.s })),

  // ===== FLORESTA NORDESTE (Acima da estrada, canto direito)
  ...[
    { t: 'tree2', x: 75, y: 4, s: 60 }, { t: 'tree', x: 85, y: 6, s: 75 }, { t: 'tree3', x: 95, y: 8, s: 50 },
    { t: 'tree', x: 80, y: 14, s: 80 }, { t: 'tree3', x: 92, y: 16, s: 65 }, { t: 'tree2', x: 72, y: 22, s: 70 },
    { t: 'tree2', x: 86, y: 25, s: 72 }, { t: 'tree', x: 78, y: 32, s: 68 }, { t: 'tree3', x: 90, y: 35, s: 55 },
    { t: 'tree', x: 65, y: 18, s: 78 }, { t: 'tree2', x: 55, y: 8, s: 60 }, { t: 'tree3', x: 68, y: 10, s: 75 },
    { t: 'tree', x: 95, y: 24, s: 72 }
  ].map((item, idx) => ({ id: `ne${idx}`, type: item.t, left: item.x, top: item.y, size: item.s })),

  // ===== FLORESTA SUDOESTE (Abaixo da estrada, canto esquerdo)
  ...[
    { t: 'tree', x: 4, y: 65, s: 78 }, { t: 'tree3', x: 12, y: 70, s: 65 }, { t: 'tree2', x: 5, y: 78, s: 70 },
    { t: 'tree2', x: 18, y: 80, s: 65 }, { t: 'tree', x: 8, y: 88, s: 80 }, { t: 'tree3', x: 22, y: 86, s: 55 },
    { t: 'tree', x: 28, y: 92, s: 75 }, { t: 'tree2', x: 15, y: 95, s: 70 }, { t: 'tree3', x: 35, y: 85, s: 60 },
    { t: 'tree', x: 25, y: 75, s: 72 }, { t: 'tree2', x: 32, y: 72, s: 68 }, { t: 'tree', x: 42, y: 88, s: 76 }
  ].map((item, idx) => ({ id: `sw${idx}`, type: item.t, left: item.x, top: item.y, size: item.s })),

  // ===== FLORESTA SUDESTE (Abaixo da estrada, canto direito)
  ...[
    { t: 'tree2', x: 85, y: 65, s: 65 }, { t: 'tree', x: 75, y: 75, s: 80 }, { t: 'tree3', x: 95, y: 70, s: 55 },
    { t: 'tree', x: 88, y: 82, s: 78 }, { t: 'tree2', x: 80, y: 90, s: 68 }, { t: 'tree3', x: 98, y: 85, s: 60 },
    { t: 'tree', x: 65, y: 85, s: 75 }, { t: 'tree2', x: 72, y: 95, s: 62 }, { t: 'tree', x: 60, y: 95, s: 70 },
    { t: 'tree3', x: 55, y: 88, s: 58 }, { t: 'tree2', x: 90, y: 96, s: 72 }, { t: 'tree', x: 50, y: 96, s: 76 }
  ].map((item, idx) => ({ id: `se${idx}`, type: item.t, left: item.x, top: item.y, size: item.s })),
];

const SRC = {
  tree:   '/assets/decor/tree.svg',
  tree2:  '/assets/decor/tree2.svg',
  tree3:  '/assets/decor/tree3.svg',
};

export function WorldDecor() {
  return (
    <>
      {DECOR_ITEMS.map(item => {
        const src = SRC[item.type];
        if (!src) return null;
        return (
          <img
            key={item.id}
            src={src}
            alt={item.type}
            draggable={false}
            className="absolute pointer-events-none select-none"
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              width: `${item.size}px`,
              height: 'auto',
              zIndex: 5,
              transform: 'translateX(-50%)',
              filter: 'drop-shadow(1px 4px 3px rgba(0,0,0,0.20))',
            }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        );
      })}
    </>
  );
}
