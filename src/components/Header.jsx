import React, { useState, useEffect, useRef } from 'react'

const SEASON_ICONS = {
  spring: '🌸',
  summer: '☀️',
  autumn: '🍂',
  winter: '❄️',
};

const SEASON_COLORS = {
  spring: 'text-pink-300',
  summer: 'text-yellow-300',
  autumn: 'text-orange-300',
  winter: 'text-sky-200',
};

export function Header({ 
  gameState, 
  formatMoney, 
  onAdvanceSeason, 
  currentSeason, 
  seasonLabel,
  isMeasuringMode,
  mousePos
}) {
  const [isSeasonDetailsOpen, setIsSeasonDetailsOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setIsSeasonDetailsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!gameState) return null;

  return (
    <header ref={headerRef} className="absolute top-0 left-0 w-full p-0 sm:p-2 z-50 pointer-events-none">
      <div className="w-full flex items-center justify-between pointer-events-auto bg-transparent pt-1 px-1 sm:pt-0 sm:px-0 transition-all duration-500">
        
        {/* ESQUERDA: RECURSOS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Dinheiro */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md hover:bg-black/60 p-1.5 px-3 rounded-full border border-white/10 shadow-lg transition-all cursor-help group" title="Dinheiro">
            <img src="/assets/icons/cash.svg" alt="cash" className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow group-hover:scale-110 transition-transform" />
            <p className="text-sm sm:text-base font-black text-[#FACC15] font-mono tracking-tight">
              {formatMoney(gameState.money)}
            </p>
          </div>

          {/* Trabalhadores */}
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md hover:bg-black/60 p-1.5 px-3 rounded-full border border-white/10 shadow-lg transition-all cursor-help group" title="Trabalhadores Ociosos / Total">
            <img src="/assets/icons/worker.svg" alt="workers" className="w-4 h-4 sm:w-5 sm:h-5 drop-shadow group-hover:scale-110 transition-transform" />
            <p className="text-xs sm:text-sm font-black text-sky-100">12/32</p>
          </div>
        </div>

        {/* CENTRO: MEDIÇÃO OU LOGOTIPO/Vazio */}
        <div className="flex-1 flex justify-center px-4">
          {isMeasuringMode ? (
            <div className="bg-purple-600/20 border border-purple-500/40 px-4 py-1 rounded-full backdrop-blur-md animate-pulse">
              <p className="text-[10px] sm:text-xs font-black text-purple-200 uppercase tracking-widest flex items-center gap-2 text-center">
                <span className="hidden sm:inline">📐 Mapeador Ativo:</span>
                <span className="font-mono">X:{(mousePos.x * 10.2).toFixed(0)} Y:{(mousePos.y * 10.2).toFixed(0)}</span>
              </p>
            </div>
          ) : (
            <div className="opacity-0 pointer-events-none w-10 h-1" />
          )}
        </div>

        {/* DIREITA: TEMPO E ESTAÇÃO */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Controles de Tempo (Visíveis no desktop) */}
          <div className="hidden sm:flex items-center gap-1 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
            <button className="p-1.5 hover:bg-white/10 rounded-full transition-all opacity-60 hover:opacity-100" title="Pausar">
              <img src="/assets/icons/pause.svg" alt="p" className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 bg-green-500/20 hover:bg-green-500/40 rounded-full transition-all border border-green-500/20" title="Continuar">
              <img src="/assets/icons/play2.svg" alt="p" className="w-3.5 h-3.5" />
            </button>
            <div className="flex bg-white/5 rounded-full p-0.5 ml-1">
              {['1x', '2x', '3x'].map(speed => (
                <button key={speed} className="px-2 py-1 text-[9px] font-black text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all">
                  {speed}
                </button>
              ))}
            </div>
          </div>

          {/* Estação e Clima */}
          <div className="relative flex items-center">
            {/* Lógica Mobile: Detalhes flutuantes */}
            {isSeasonDetailsOpen && (
              <div className="absolute top-full right-0 mt-3 bg-black/90 backdrop-blur-2xl p-4 rounded-3xl border border-white/10 shadow-2xl min-w-[180px] animate-in fade-in slide-in-from-top-2 flex flex-col gap-2 sm:hidden pointer-events-auto origin-top-right">
                <p className="text-white/50 text-[9px] font-bold uppercase tracking-widest">Calendário Agrícola</p>
                <p className="text-white font-black text-lg">Ano {gameState.year}</p>
                <p className={`font-black ${SEASON_COLORS[currentSeason]}`}>{seasonLabel}</p>
                <p className="text-white/80 text-sm">Dia {gameState.dayOfSeason}</p>
                
                {/* Controles Mobile dentro do detalhe */}
                <div className="flex items-center justify-between mt-3 p-2 bg-white/5 rounded-2xl border border-white/5">
                   <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"><img src="/assets/icons/pause.svg" className="w-4 h-4" alt="pause" /></button>
                   <button className="p-2 bg-green-500/40 rounded-lg hover:bg-green-500/60 transition-colors border border-green-500/20"><img src="/assets/icons/play2.svg" className="w-4 h-4" alt="play" /></button>
                   <button className="p-2 bg-white/10 rounded-lg text-[10px] font-black w-10 text-center hover:bg-white/20 transition-colors">2x</button>
                </div>
              </div>
            )}

            <div 
              className="flex items-center gap-2 sm:gap-3 bg-black/40 backdrop-blur-md hover:bg-black/60 p-1 pr-2 sm:p-1.5 sm:px-4 rounded-full border border-white/10 shadow-lg cursor-pointer transition-all active:scale-95"
              onClick={() => {
                if (window.innerWidth < 640) {
                  setIsSeasonDetailsOpen(!isSeasonDetailsOpen);
                } else {
                  onAdvanceSeason();
                }
              }}
            >
              <div className="hidden sm:flex flex-col items-end leading-none">
                <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-none mb-0.5">Ano {gameState.year}</p>
                <p className={`text-xs font-black ${SEASON_COLORS[currentSeason]} leading-none`}>
                  {seasonLabel} • Dia {gameState.dayOfSeason}
                </p>
              </div>
              <div className="hidden sm:block h-6 w-px bg-white/10 mx-1"></div>
              <div className="flex items-center gap-1.5">
                <div className="text-sm sm:text-base font-light text-white leading-none">
                  {gameState.temperature}<span className="text-[10px] text-white/50">°C</span>
                </div>
                <span className="text-xl sm:text-2xl filter drop-shadow-md">
                  {SEASON_ICONS[currentSeason]}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

