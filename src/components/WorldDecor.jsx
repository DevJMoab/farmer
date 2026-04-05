import React, { useMemo } from 'react';

/**
 * REFLORESTAMENTO NATIVO - v2.7.0
 * Algoritmo procedural de alta densidade.
 * As árvores são geradas evitando a estrada central e o centro (sede).
 * O zIndex é amarrado à posição Y (top) para sobreposição isométrica perfeita.
 */

const TREE_TYPES = ['tree', 'tree2', 'tree3'];
const MAX_TREES = 3500; // Densidade hipermaciça para terreno gigante de 800px-lado

function generateNativeFlora() {
  const items = [];

  // Zonas de Exclusão (Centro da fazenda e Eixo Geométrico da Estrada)
  // Centro (Sede): x ~ 45-58%, y ~ 35-48%

  for (let i = 0; i < MAX_TREES; i++) {
    // Espalhando pelo mapa 5x5 expandido além do 1020px viewport
    const top = -150 + (Math.random() * 400); // de -150% até 250%
    const left = -150 + (Math.random() * 400); 

    // Geometria de colisão da Estrada (WorldRoad.jsx)
    // A estrada é uma linha 2:1 isómetrica que cruza o ponto (655, 230) com inclinação de -0.5
    // Equação cartesiana linear: 0.5 * x + y - 557.5 = 0
    const x_px = (left / 100) * 1020;
    const y_px = (top / 100) * 1020;
    const roadDist = Math.abs((0.5 * x_px) + y_px - 557.5) / 1.118; // 1.118 = sqrt(0.5^2 + 1^2)
    
    // Pular se árvore cair na faixa proibida da estrada asfaltada
    if (roadDist < 140) continue;

    // Pular se estiver no centro (Sede inicial)
    if (left > 40 && left < 60 && top > 30 && top < 50) continue;

    const type = TREE_TYPES[Math.floor(Math.random() * TREE_TYPES.length)];
    const size = 45 + Math.random() * 30; // 45px a 75px max

    items.push({
      id: `native-${i}`,
      type,
      top,
      left,
      size,
      // Quanto mais p/ baixo (maior top), maior o zIndex
      // Usamos top * 10 para ter uma granulação fina de camadas
      zIndex: Math.floor(top * 10) + 10
    });
  }

  // Opcional: ordenar o array por top para garantir renderização DOM top-down (ajuda no feeling isométrico)
  return items.sort((a, b) => a.top - b.top);
}

const SRC = {
  tree: '/assets/decor/tree.svg',
  tree2: '/assets/decor/tree2.svg',
  tree3: '/assets/decor/tree3.svg',
};

export function WorldDecor({ isDemolitionMode, removedIds = [], onDemolish, isInsideOwnedSector }) {
  // Memoizamos p/ não regenerar a floresta a cada re-render do App
  const DECOR_ITEMS = useMemo(() => generateNativeFlora(), []);

  // Filtra as que já foram demolidas E que residem sobre um setor PROPRIETÁRIO
  const activeItems = DECOR_ITEMS.filter(item => {
    if (removedIds.includes(item.id)) return false;
    if (isInsideOwnedSector && !isInsideOwnedSector(item.left, item.top)) return false;
    return true;
  });

  return (
    <>
      {activeItems.map(item => {
        const src = SRC[item.type];
        if (!src) return null;
        return (
          <img
            key={item.id}
            src={src}
            alt={item.type}
            draggable={false}
            onClick={isDemolitionMode ? (e) => {
              e.stopPropagation();
              onDemolish(item.id);
            } : undefined}
            className={`absolute select-none transition-all ${isDemolitionMode ? 'hover-demolish-tree pointer-events-auto' : 'pointer-events-none'}`}
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
              height: `${item.size}px`,
              maxHeight: '75px',
              width: 'auto',
              // Z-INDEX ISOMÉTRICO DINÂMICO
              zIndex: item.zIndex,
              transform: 'translateX(-50%)',
              filter: 'drop-shadow(1px 4px 3px rgba(0,0,0,0.15))',
            }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        );
      })}
    </>
  );
}
