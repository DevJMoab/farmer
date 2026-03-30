import React from 'react';

const SECTOR_GRID = [
  { id: 'nw', row: 0, col: 0, cost: 50000 },
  { id: 'n',  row: 0, col: 1, cost: 50000 },
  { id: 'ne', row: 0, col: 2, cost: 50000 },
  { id: 'w',  row: 1, col: 0, cost: 35000 },
  { id: 'center', row: 1, col: 1, cost: 0 },
  { id: 'e',  row: 1, col: 2, cost: 35000 },
  { id: 'sw', row: 2, col: 0, cost: 50000 },
  { id: 's',  row: 2, col: 1, cost: 50000 },
  { id: 'se', row: 2, col: 2, cost: 50000 },
];

const SECTOR_LABELS = {
  nw: 'NW', n: 'Norte', ne: 'NE',
  w: 'Oeste', center: 'Sua Fazenda', e: 'Leste',
  sw: 'SO', s: 'Sul', se: 'SE',
};

const fmt = (v) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v);

// Modal de compra de terreno — abre via botão, não fica sempre visível no mapa
export function LandModal({ isOpen, onClose, ownedSectors, onBuySector, money }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={onClose} />
      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

        <header className="bg-slate-100 p-5 flex justify-between items-center border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗺</span>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-wide">Expansão de Terreno</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-200 hover:bg-red-500 hover:text-white text-slate-500 font-bold transition-all"
          >✕</button>
        </header>

        {/* Saldo */}
        <div className="flex items-center gap-3 bg-green-50 border-b border-green-200 px-5 py-3">
          <span className="text-lg font-black text-green-700 font-mono">R$ {fmt(money)}</span>
          <span className="text-xs text-green-600 font-bold">disponível</span>
        </div>

        {/* Grid 3x3 */}
        <div className="p-5">
          <p className="text-sm text-slate-500 mb-4">Compre terrenos adjacentes para expandir sua fazenda.</p>
          <div className="grid grid-cols-3 gap-2">
            {SECTOR_GRID.map(sector => {
              const owned = sector.id === 'center' || ownedSectors.includes(sector.id);
              const canAfford = money >= sector.cost;

              return (
                <div
                  key={sector.id}
                  className={`rounded-xl p-3 border-2 text-center transition-all ${
                    owned
                      ? 'bg-green-50 border-green-300'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`text-xs font-bold mb-2 ${owned ? 'text-green-700' : 'text-slate-500'}`}>
                    {SECTOR_LABELS[sector.id]}
                  </div>
                  {owned ? (
                    <div className="text-green-600 text-lg">✓</div>
                  ) : (
                    <button
                      onClick={() => onBuySector(sector.id, sector.cost)}
                      disabled={!canAfford}
                      className={`w-full py-1.5 px-2 rounded-lg text-xs font-black transition-all ${
                        canAfford
                          ? 'bg-yellow-400 hover:bg-yellow-300 text-yellow-900 shadow-[0_2px_0_0_#92400e] active:translate-y-0.5 active:shadow-none'
                          : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {fmt(sector.cost)}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
