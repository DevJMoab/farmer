import React, { useMemo } from 'react';

/**
 * REFLORESTAMENTO NATIVO - v2.7.0
 * Algoritmo procedural de alta densidade.
 * As árvores são geradas evitando a estrada central e o centro (sede).
 * O zIndex é amarrado à posição Y (top) para sobreposição isométrica perfeita.
 */

const TREE_TYPES = ['tree', 'tree2', 'tree3'];
const MAX_TREES = 280; // Densidade muito maior

function generateNativeFlora() {
  const items = [];

  // Zonas de Exclusão (estrada e centro da fazenda)
  // Estrada EW: y ~ 45-55%
  // Centro (Sede): x ~ 45-58%, y ~ 35-48%

  for (let i = 0; i < MAX_TREES; i++) {
    const top = Math.random() * 100;
    const left = Math.random() * 100;

    // Pular se estiver na estrada
    if (top > 44 && top < 56) continue;

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

export function WorldDecor() {
  // Memoizamos p/ não regenerar a floresta a cada re-render do App
  const DECOR_ITEMS = useMemo(() => generateNativeFlora(), []);

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
