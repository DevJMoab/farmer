import React from 'react'

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

export function Header({ gameState, formatMoney, onAdvanceSeason, currentSeason, seasonLabel }) {
  if (!gameState) return null;

  return (
    <header className="absolute top-0 left-0 w-full p-3 sm:p-4 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-start justify-between flex-wrap gap-2 pointer-events-auto">

        {/* LADO ESQUERDO — Recursos */}
        <div className="flex flex-col gap-2">

          {/* Dinheiro */}
          <div className="flex items-center gap-2.5 bg-black/50 backdrop-blur-md p-1.5 px-3.5 rounded-2xl border border-white/10 shadow-lg hover:bg-black/60 transition-colors cursor-pointer">
            <img src="/assets/icons/cash.svg" alt="cash" className="w-6 h-6 drop-shadow-md" />
            <p className="text-base sm:text-lg font-black text-[#FACC15] font-mono tracking-widest drop-shadow-md">
              {formatMoney(gameState.money)}
            </p>
          </div>

          {/* Trabalhadores */}
          <div className="flex items-center gap-2.5 bg-black/50 backdrop-blur-md p-1.5 px-3.5 rounded-2xl border border-white/10 shadow-lg hover:bg-black/60 transition-colors cursor-pointer">
            <img src="/assets/icons/worker.svg" alt="workers" className="w-6 h-6 drop-shadow-md" />
            <div className="flex flex-col leading-tight">
              <p className="text-sm font-black text-sky-100">12/32</p>
              <span className="text-[9px] text-sky-400 font-bold uppercase tracking-wider">Ociosos / Total</span>
            </div>
          </div>

        </div>

        {/* LADO DIREITO — Clima e Controles */}
        <div className="flex flex-col items-end gap-2">

          {/* Clima + Estação (Clicável para avançar estação em testes) */}
          <div
            className="flex items-center gap-3 bg-black/50 backdrop-blur-md p-1.5 px-4 rounded-2xl border border-white/10 shadow-lg cursor-pointer hover:bg-black/60 transition-colors active:scale-95"
            onClick={onAdvanceSeason}
            title="Clique para avançar a estação (modo teste)"
          >
            <div className="flex flex-col items-end">
              <p className="text-xs font-bold text-white/80">Ano {gameState.year}</p>
              <p className={`text-xs font-black ${SEASON_COLORS[currentSeason]}`}>
                {seasonLabel} — Dia {gameState.dayOfSeason}
              </p>
            </div>
            <div className="h-7 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <div className="text-xl font-light text-white drop-shadow-md">
                {gameState.temperature}
                <span className="text-xs text-white/60">°C</span>
              </div>
              <span className="text-3xl leading-none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}>
                {SEASON_ICONS[currentSeason]}
              </span>
            </div>
          </div>

          {/* Controles do Jogo */}
          <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-lg">
            <button className="p-1.5 hover:bg-white/15 rounded-xl transition-all" title="Pausar">
              <img src="/assets/icons/pause.svg" alt="pause" className="w-4 h-4 sm:w-5 sm:h-5 opacity-70 hover:opacity-100" />
            </button>
            <button className="p-1.5 bg-green-500/20 hover:bg-green-500/40 rounded-xl transition-all border border-green-500/30" title="Continuar">
              <img src="/assets/icons/play2.svg" alt="play" className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-1.5 hover:bg-white/15 rounded-xl transition-all" title="2x">
              <img src="/assets/icons/1x.svg" alt="1x" className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
            </button>
            <button className="p-1.5 hover:bg-white/15 rounded-xl transition-all" title="3x">
              <img src="/assets/icons/2x.svg" alt="2x" className="w-4 h-4 sm:w-5 sm:h-5 opacity-70" />
            </button>
            <div className="w-px h-4 bg-white/15 mx-0.5"></div>
            <button className="p-1.5 hover:bg-white/15 rounded-xl transition-all" title="Avançar">
              <img src="/assets/icons/3x.svg" alt="3x" className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
