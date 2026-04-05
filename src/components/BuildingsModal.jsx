import React, { useState } from 'react';

// Catálogo completo de todas as construções disponíveis em /STAGE 1/buildings/
const BUILDINGS = [
  // SOCIAL
  { id: 'sede', name: 'Sede da Fazenda', category: 'Social', level: 1, cost: 85000 },
  // ANIMALS
  { id: 'curral', name: 'Curral', category: 'Animals', level: 1, cost: 28000 },
  { id: 'aprisco', name: 'Aprisco', category: 'Animals', level: 1, cost: 22000 },
  { id: 'pocilga', name: 'Pocilga', category: 'Animals', level: 1, cost: 19500 },
  { id: 'estabulo', name: 'Estábulo', category: 'Animals', level: 1, cost: 35000 },
  { id: 'galinhas', name: 'Galinheiro', category: 'Animals', level: 1, cost: 18000 },
  { id: 'patos', name: 'Patos', category: 'Animals', level: 1, cost: 15000 },
  { id: 'codornas', name: 'Codornas', category: 'Animals', level: 1, cost: 12000 },
  { id: 'avestrus', name: 'Avestruzes', category: 'Animals', level: 1, cost: 25000 },
  { id: 'viveirosParaPeixes', name: 'Viveiros para Peixes', category: 'Animals', level: 1, cost: 18000 },
  // PRODUCTION
  { id: 'pomar', name: 'Pomar', category: 'Production', level: 1, cost: 32000 },
  { id: 'horta', name: 'Horta', category: 'Production', level: 1, cost: 14000 },
  { id: 'estufas', name: 'Estufas', category: 'Production', level: 1, cost: 45000 },
  { id: 'moinho', name: 'Moinho', category: 'Production', level: 1, cost: 38000 },
  { id: 'processamento', name: 'Processamento', category: 'Production', level: 1, cost: 55000 },
  // CROPS
  { id: 'campo', name: 'Campo de Cultivo', category: 'Crops', level: 1, cost: 20000 },
  // STORAGE
  { id: 'celeiro', name: 'Celeiro', category: 'Storage', level: 1, cost: 16897 },
  { id: 'silo', name: 'Silo', category: 'Storage', level: 1, cost: 25000 },
  { id: 'silagem', name: 'Silagem', category: 'Storage', level: 1, cost: 18000 },
  { id: 'estoque', name: 'Estoque', category: 'Storage', level: 1, cost: 12000 },
  // MACHINES
  { id: 'garagem', name: 'Garagem', category: 'Machines', level: 1, cost: 30000 },
  { id: 'oficina', name: 'Oficina', category: 'Machines', level: 1, cost: 28000 },
  { id: 'logistica', name: 'Logística', category: 'Machines', level: 1, cost: 22000 },
  // OTHERS
  { id: 'esterco', name: 'Esterco', category: 'Others', level: 1, cost: 8000 },
  // DECORATIONS
  { id: 'tree', name: 'Árvore 1', category: 'Decorations', level: 1, cost: 50 },
  { id: 'tree2', name: 'Árvore 2', category: 'Decorations', level: 1, cost: 50 },
  { id: 'tree3', name: 'Árvore 3', category: 'Decorations', level: 1, cost: 50 },
];

const TABS = ['All', 'Social', 'Animals', 'Production', 'Crops', 'Storage', 'Machines', 'Decorations', 'Others'];

const fmt = (v) => new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(v);

// Preview thumbnail do building — tenta carregar do STAGE 1 ou decor, mostra placeholder se falhar
function BuildingThumb({ id, category }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div className="w-14 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-2xl">
        🏗
      </div>
    );
  }

  const ext = (id === 'sede' || id === 'silo') ? 'svg' : 'png';
  const src = category === 'Decorations'
    ? `/assets/decor/${id}.svg`
    : `/assets/STAGE 1/buildings/${id}.${ext}`;

  return (
    <img
      src={src}
      alt={id}
      className="w-14 h-14 object-contain rounded-lg bg-slate-50"
      onError={() => setErr(true)}
    />
  );
}

export function BuildingsModal({ isOpen, onClose, onBuild, money = 0 }) {
  const [activeTab, setActiveTab] = useState('All');

  if (!isOpen) return null;

  const filtered = activeTab === 'All'
    ? BUILDINGS
    : BUILDINGS.filter(b => b.category === activeTab);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white text-slate-800 rounded-3xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <header className="bg-slate-100 p-5 flex justify-between items-center border-b border-slate-300 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-sky-100 p-2 rounded-xl">
              <img src="/assets/icons/hammer.svg" alt="hammer" className="w-6 h-6" onError={() => { }} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-wide uppercase">Construções</h2>
              <p className="text-xs text-slate-500">{BUILDINGS.length} estruturas disponíveis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-200 hover:bg-red-500 hover:text-white text-slate-500 font-bold transition-all"
          >✕</button>
        </header>

        {/* Saldo */}
        <div className="flex items-center gap-3 bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 flex-shrink-0">
          <span className="text-emerald-600 text-xl">💰</span>
          <p className="text-lg font-black text-emerald-800 font-mono tracking-wider">R$ {fmt(money)}</p>
          <span className="text-xs text-emerald-600 font-bold ml-1">disponível</span>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100 border-b border-slate-200 overflow-x-auto flex-shrink-0">
          {TABS.map(tab => {
            const count = tab === 'All' ? BUILDINGS.length : BUILDINGS.filter(b => b.category === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 font-bold text-xs uppercase tracking-wider transition-colors border-b-4 whitespace-nowrap flex items-center gap-1.5 ${activeTab === tab
                  ? 'border-sky-500 text-sky-700 bg-white'
                  : 'border-transparent text-slate-500 hover:bg-slate-200'
                  }`}
              >
                {tab}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${activeTab === tab ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'
                  }`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Lista de Buildings */}
        <section className="flex-1 overflow-y-auto p-3 bg-slate-50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filtered.map((b) => {
              const canAfford = money >= b.cost;
              return (
                <div
                  key={b.id}
                  className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition-all ${canAfford
                    ? 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-md'
                    : 'bg-slate-50 border-slate-100 opacity-60'
                    }`}
                >
                  {/* Thumbnail */}
                  <BuildingThumb id={b.id} category={b.category} />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-slate-800 text-sm truncate">{b.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                        Lvl {b.level}
                      </span>
                      <span className={`text-xs font-black font-mono ${canAfford ? 'text-emerald-700' : 'text-red-400'}`}>
                        R$ {fmt(b.cost)}
                      </span>
                    </div>
                  </div>

                  {/* Botão */}
                  <button
                    disabled={!canAfford}
                    onClick={() => { if (onBuild) onBuild(b.id, b.cost); onClose(); }}
                    className={`flex-shrink-0 font-black py-2 px-4 rounded-xl transition-all text-sm ${canAfford
                      ? 'bg-gradient-to-b from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white shadow-[0_4px_0_0_#0369a1] active:translate-y-1 active:shadow-none'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                  >
                    {canAfford ? '+ Construir' : '💸'}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
