import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Header } from './components/Header'
import { BuildingsModal } from './components/BuildingsModal'
import { WeatherEffect } from './components/WeatherEffect'
import { LandModal } from './components/LandSector'
import { WorldDecor } from './components/WorldDecor'
import { WorldRoad } from './components/WorldRoad'

// =============================================
// CONSTANTES DO MOTOR DE TEMPO
// =============================================
const SEASONS = ['spring', 'summer', 'autumn', 'winter'];
const SEASON_LABELS = { spring: 'Primavera', summer: 'Verão', autumn: 'Outono', winter: 'Inverno' };
const SEASON_TEMP_RANGE = {
  spring: [12, 22],
  summer: [24, 36],
  autumn: [10, 20],
  winter: [-2, 10],
};
const DAYS_PER_SEASON = 91; // ~3 meses por estação
const MS_PER_GAME_DAY = 3000; // 3 segundos reais = 1 dia no jogo

// Formata moeda BR
const formatMoney = (val) =>
  new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(val);

function App() {
  const [isBuildingsModalOpen, setIsBuildingsModalOpen] = useState(false);
  const [isLandModalOpen, setIsLandModalOpen] = useState(false);

  // MEASURING TOOL STATE
  const [isMeasuringMode, setIsMeasuringMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]); // Array of 4 {x, y} coordinate objects
  const [drawingRect, setDrawingRect] = useState(null); // { startX, startY, currentX, currentY }
  const [dragContext, setDragContext] = useState(null); // { type: 'point' | 'edge', index, startMouseX, startMouseY, startP1, startP2 }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsMeasuringMode(false);
        setMeasurePoints([]);
        setDrawingRect(null);
        setDragContext(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Z-index do preview (para controlar profundidade antes de gravar)
  const [previewZIndex, setPreviewZIndex] = useState(10);

  // =============================================
  // GAME STATE CENTRAL
  // =============================================
  const [gameState, setGameState] = useState({
    baseMap: 'E',
    buildings: [],
    money: 16784165.97,
    // Motor de tempo
    seasonIndex: 0,        // 0=Primavera, 1=Verão, 2=Outono, 3=Inverno
    dayOfSeason: 1,
    year: 1,
    temperature: 18,
    // Terreno
    ownedSectors: ['center'],
    // Toast
    toast: null,
  });

  // =============================================
  // MOTOR DE TEMPO (setInterval)
  // =============================================
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState(prev => {
        let { seasonIndex, dayOfSeason, year, temperature } = prev;

        dayOfSeason += 1;
        if (dayOfSeason > DAYS_PER_SEASON) {
          dayOfSeason = 1;
          seasonIndex = (seasonIndex + 1) % 4;
          if (seasonIndex === 0) year += 1;
        }

        const season = SEASONS[seasonIndex];
        const [minT, maxT] = SEASON_TEMP_RANGE[season];
        // Temperatura flutua levemente dia a dia
        const baseTemp = minT + ((maxT - minT) * (dayOfSeason / DAYS_PER_SEASON));
        temperature = Math.round(baseTemp + (Math.random() * 4 - 2));

        return { ...prev, seasonIndex, dayOfSeason, year, temperature };
      });
    }, MS_PER_GAME_DAY);

    return () => clearInterval(timer);
  }, []);

  // Avançar manualmente para próxima estação (modo teste)
  const advanceSeason = useCallback(() => {
    setGameState(prev => {
      const nextSeasonIndex = (prev.seasonIndex + 1) % 4;
      const season = SEASONS[nextSeasonIndex];
      const [minT, maxT] = SEASON_TEMP_RANGE[season];
      return {
        ...prev,
        seasonIndex: nextSeasonIndex,
        dayOfSeason: 1,
        temperature: Math.round((minT + maxT) / 2),
        year: nextSeasonIndex === 0 ? prev.year + 1 : prev.year,
      };
    });
  }, []);

  // =============================================
  // MOTOR DE ECONOMIA
  // =============================================
  const handleBuildInitiate = useCallback((buildingId, cost) => {
    setPlacementMode({ id: buildingId, cost });
    setPreviewPlacement(null);
    setPreviewScale(8);
    setPreviewZIndex(10); // reset z-index para cada nova construção
  }, [gameState.money]);

  const showToast = (message, type = 'info') => {
    setGameState(prev => ({ ...prev, toast: { message, type } }));
    setTimeout(() => setGameState(prev => ({ ...prev, toast: null })), 3000);
  };

  // =============================================
  // SISTEMA DE SETORES
  // =============================================
  const CENTER_SECTOR_BOUNDS = { minX: 20, maxX: 80, minY: 20, maxY: 80 }; // % do mapa
  const SECTOR_SIZE_PX = 340;

  const isInsideOwnedSector = useCallback((x, y) => {
    // Por ora, verificação simplificada pelo setor central
    if (gameState.ownedSectors.includes('center') &&
      x >= CENTER_SECTOR_BOUNDS.minX && x <= CENTER_SECTOR_BOUNDS.maxX &&
      y >= CENTER_SECTOR_BOUNDS.minY && y <= CENTER_SECTOR_BOUNDS.maxY) return true;
    return false;
  }, [gameState.ownedSectors]);

  const handleBuySector = useCallback((sectorId, cost) => {
    setGameState(prev => {
      if (prev.money < cost) {
        return { ...prev, toast: { message: '❌ Saldo insuficiente para comprar este terreno!', type: 'error' } };
      }
      setTimeout(() => setGameState(p => ({ ...p, toast: null })), 3000);
      return {
        ...prev,
        money: prev.money - cost,
        ownedSectors: [...prev.ownedSectors, sectorId],
        toast: { message: `✅ Terreno "${sectorId}" adquirido!`, type: 'success' },
      };
    });
  }, []);

  // =============================================
  // PLACEMENT PREVIEW SYSTEM
  // =============================================
  const [placementMode, setPlacementMode] = useState(null); // { id, cost }
  const [previewPlacement, setPreviewPlacement] = useState(null); // { x, y }
  const [previewScale, setPreviewScale] = useState(8);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const confirmPlacement = useCallback(() => {
    if (!placementMode || !previewPlacement) return;

    if (!isInsideOwnedSector(previewPlacement.x, previewPlacement.y)) {
      showToast('🚫 Compre este terreno para construir aqui!', 'error');
      return;
    }

    const cost = placementMode.cost || 0;
    setGameState(prev => {
      if (prev.money < cost) {
        return { ...prev, toast: { message: '❌ Saldo insuficiente!', type: 'error' } };
      }
      setTimeout(() => setGameState(p => ({ ...p, toast: null })), 3000);
      return {
        ...prev,
        money: prev.money - cost,
        buildings: [...prev.buildings, { id: placementMode.id, x: previewPlacement.x, y: previewPlacement.y, scale: previewScale, zIndex: previewZIndex }],
        toast: { message: `🏗 Construção "${placementMode.id}" concluída!`, type: 'success' },
      };
    });
    setPlacementMode(null);
    setPreviewPlacement(null);
  }, [placementMode, previewPlacement, previewScale, isInsideOwnedSector]);

  const cancelPlacement = useCallback(() => {
    setPlacementMode(null);
    setPreviewPlacement(null);
  }, []);

  // =============================================
  // PAN E ZOOM
  // =============================================
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isPanning, setIsPanning] = useState(false);
  const startPanRef = useRef({ x: 0, y: 0 });

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setTransform(prev => ({ ...prev, scale: Math.min(Math.max(prev.scale * scaleFactor, 0.4), 3) }));
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (placementMode && e.button === 0) return;

    // Início do desenho da área quadrada
    if (isMeasuringMode && measurePoints.length === 0 && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setDrawingRect({ startX: x, startY: y, currentX: x, currentY: y });
      return;
    }

    setIsPanning(true);
    startPanRef.current = { x: e.clientX - transform.x, y: e.clientY - transform.y };
  }, [placementMode, transform.x, transform.y, isMeasuringMode, measurePoints.length]);

  const handleMouseMove = useCallback((e) => {
    if (drawingRect && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setDrawingRect(prev => ({ ...prev, currentX: x, currentY: y }));
      return;
    }

    if (dragContext !== null && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 100;
      const mouseY = ((e.clientY - rect.top) / rect.height) * 100;

      setMeasurePoints(prev => {
        const np = [...prev];
        const dx = mouseX - dragContext.startMouseX;
        const dy = mouseY - dragContext.startMouseY;

        if (dragContext.type === 'point') {
          np[dragContext.index] = {
            x: dragContext.startP1.x + dx,
            y: dragContext.startP1.y + dy
          };
        } else if (dragContext.type === 'edge') {
          np[dragContext.index] = {
            x: dragContext.startP1.x + dx,
            y: dragContext.startP1.y + dy
          };
          const nextIdx = (dragContext.index + 1) % 4;
          np[nextIdx] = {
            x: dragContext.startP2.x + dx,
            y: dragContext.startP2.y + dy
          };
        }
        return np;
      });
      return;
    }

    if (placementMode && !previewPlacement && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
    if (!isPanning) return;
    setTransform(prev => ({ ...prev, x: e.clientX - startPanRef.current.x, y: e.clientY - startPanRef.current.y }));
  }, [placementMode, previewPlacement, isPanning, drawingRect, dragContext]);

  const handleMouseUp = useCallback(() => {
    if (drawingRect) {
      const p1 = { x: drawingRect.startX, y: drawingRect.startY };
      const p2 = { x: drawingRect.currentX, y: drawingRect.startY };
      const p3 = { x: drawingRect.currentX, y: drawingRect.currentY };
      const p4 = { x: drawingRect.startX, y: drawingRect.currentY };
      // prevent tiny accidental clicks from creating polygons
      if (Math.abs(drawingRect.startX - drawingRect.currentX) > 1) {
        setMeasurePoints([p1, p2, p3, p4]);
      }
      setDrawingRect(null);
    }

    if (dragContext !== null) {
      setDragContext(null);
    }

    setIsPanning(false);
  }, [drawingRect, dragContext]);

  // Touch support para mobile
  const touchRef = useRef(null);
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      touchRef.current = { x: e.touches[0].clientX - transform.x, y: e.touches[0].clientY - transform.y };
      setIsPanning(true);
    }
  }, [transform.x, transform.y]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 1 && isPanning && touchRef.current) {
      e.preventDefault();
      setTransform(prev => ({
        ...prev,
        x: e.touches[0].clientX - touchRef.current.x,
        y: e.touches[0].clientY - touchRef.current.y,
      }));
    }
  }, [isPanning]);

  const handleTouchEnd = useCallback(() => setIsPanning(false), []);

  const handleMapClick = useCallback((e) => {
    if (placementMode && !previewPlacement && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setPreviewPlacement({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    }
  }, [placementMode, previewPlacement]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, [handleWheel]);

  // =============================================
  // RENDER
  // =============================================
  const currentSeason = SEASONS[gameState.seasonIndex];

  return (
    <div className="h-screen w-screen relative overflow-hidden flex flex-col font-sans select-none bg-[#99cc33]">

      {/* VINHETA — sempre presente nas bordas */}
      <div className="vignette absolute inset-0 z-[100] pointer-events-none" />

      {/* EFEITO CLIMÁTICO DA ESTAÇÃO */}
      <WeatherEffect
        season={currentSeason}
        dayOfSeason={gameState.dayOfSeason}
        totalDaysInSeason={DAYS_PER_SEASON}
      />

      {/* HEADER */}
      <Header
        gameState={gameState}
        formatMoney={formatMoney}
        onAdvanceSeason={advanceSeason}
        currentSeason={currentSeason}
        seasonLabel={SEASON_LABELS[currentSeason]}
      />

      {/* MAPA CENTRAL */}
      <main
        ref={containerRef}
        className={`flex-1 relative overflow-hidden pointer-events-auto bg-transparent
          ${isPanning ? 'cursor-grabbing' : placementMode ? 'cursor-crosshair' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={mapRef}
          className="absolute top-1/2 left-1/2 will-change-transform"
          onClick={handleMapClick}
          style={{
            transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) scale(${transform.scale})`,
            transformOrigin: '50% 50%',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Placeholder invisível para dar tamanho ao mapa navegável */}
          <div className="w-[1020px] h-[1020px] opacity-0 pointer-events-none" />

          {/* ESTRADA E-W */}
          <WorldRoad />

          {/* DECORAÇÕES DO MUNDO (abaixo das construções) */}
          <WorldDecor />

          {/* CONSTRUÇÕES CONFIRMADAS */}
          {gameState.buildings.map((b, idx) => (
            <img
              key={idx}
              src={`/assets/STAGE 1/buildings/${b.id}.svg`}
              alt={b.id}
              className="absolute pointer-events-none drop-shadow-xl"
              style={{ top: `${b.y}%`, left: `${b.x}%`, transform: 'translate(-50%, -50%)', width: `${b.scale || 8}%`, zIndex: b.zIndex || 10 }}
            />
          ))}

          {/* PREVIEW DO HOVER */}
          {placementMode && !previewPlacement && (
            <img
              src={`/assets/STAGE 1/buildings/${placementMode.id}.svg`}
              alt="preview_hover"
              className="absolute pointer-events-none opacity-60 z-20"
              style={{
                top: `${mousePos.y}%`, left: `${mousePos.x}%`,
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 0 10px rgba(253, 224, 71, 0.9))',
                width: `${previewScale}%`,
              }}
            />
          )}

          {/* MEDIDOR ISOMÉTRICO AVANÇADO */}
          {isMeasuringMode && (
            <svg width="100%" height="100%" className="absolute inset-0 z-[160] overflow-visible pointer-events-none">
              {/* Retângulo sendo desenhado */}
              {drawingRect && (
                <rect
                  x={`${Math.min(drawingRect.startX, drawingRect.currentX)}%`}
                  y={`${Math.min(drawingRect.startY, drawingRect.currentY)}%`}
                  width={`${Math.abs(drawingRect.startX - drawingRect.currentX)}%`}
                  height={`${Math.abs(drawingRect.startY - drawingRect.currentY)}%`}
                  fill="rgba(168, 85, 247, 0.2)"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  style={{ pointerEvents: 'none' }}
                />
              )}

              {/* Polígono e Linhas/Ângulos */}
              {measurePoints.length === 4 && measurePoints.map((p, i) => {
                const nextP = measurePoints[(i + 1) % 4];
                const dx = nextP.x - p.x;
                const dy = nextP.y - p.y;
                const pixelDx = dx * 10.2;
                const pixelDy = dy * 10.2;
                const dist = Math.sqrt(pixelDx * pixelDx + pixelDy * pixelDy).toFixed(1);

                let angle = Math.atan2(pixelDy, pixelDx) * (180 / Math.PI);
                if (angle < 0) angle += 360;

                // Evitar texto de ponta-cabeça
                let textAngle = angle;
                if (textAngle > 90 && textAngle < 270) {
                  textAngle -= 180;
                }
                const angleFormatted = angle.toFixed(1);

                const midX = p.x + dx / 2;
                const midY = p.y + dy / 2;

                return (
                  <g key={`edge-${i}`}>
                    {/* Bounding box invisível grossa para o mouse hover/drag */}
                    <line
                      x1={`${p.x}%`} y1={`${p.y}%`}
                      x2={`${nextP.x}%`} y2={`${nextP.y}%`}
                      stroke="transparent" strokeWidth={24 / transform.scale}
                      className="cursor-move"
                      style={{ pointerEvents: 'auto' }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!mapRef.current) return;
                        const rect = mapRef.current.getBoundingClientRect();
                        setDragContext({
                          type: 'edge', index: i,
                          startMouseX: ((e.clientX - rect.left) / rect.width) * 100,
                          startMouseY: ((e.clientY - rect.top) / rect.height) * 100,
                          startP1: p,
                          startP2: nextP
                        });
                      }}
                    />
                    <line
                      x1={`${p.x}%`} y1={`${p.y}%`}
                      x2={`${nextP.x}%`} y2={`${nextP.y}%`}
                      stroke="#a855f7" strokeWidth={3 / transform.scale}
                      style={{ pointerEvents: 'none', filter: 'drop-shadow(0 0 4px rgba(168,85,247,0.8))' }}
                    />
                    <text
                      x={`${midX}%`}
                      y={`${midY}%`}
                      textAnchor="middle"
                      dominantBaseline="auto"
                      fill="#f3e8ff"
                      style={{
                        fontSize: `${13 / transform.scale}px`,
                        fontFamily: 'monospace',
                        fontWeight: '900',
                        pointerEvents: 'none',
                        filter: 'drop-shadow(1px 2px 3px rgba(0,0,0,1))'
                      }}
                      transform={`rotate(${textAngle}, ${midX * 10.2}, ${midY * 10.2}) translate(0, ${-6 / transform.scale})`}
                    >
                      {dist}px ∠{angleFormatted}°
                    </text>
                  </g>
                );
              })}

              {/* Vértices arrastáveis */}
              {measurePoints.length === 4 && measurePoints.map((p, i) => (
                <circle
                  key={`anchor-${i}`}
                  cx={`${p.x}%`} cy={`${p.y}%`} r={7 / transform.scale}
                  fill="#f3e8ff" stroke="#9333ea" strokeWidth={3 / transform.scale}
                  className="cursor-move drop-shadow-md"
                  style={{ pointerEvents: 'auto' }}
                  onMouseOver={(e) => e.currentTarget.setAttribute('fill', '#fde047')}
                  onMouseOut={(e) => e.currentTarget.setAttribute('fill', '#f3e8ff')}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!mapRef.current) return;
                    const rect = mapRef.current.getBoundingClientRect();
                    setDragContext({
                      type: 'point', index: i,
                      startMouseX: ((e.clientX - rect.left) / rect.width) * 100,
                      startMouseY: ((e.clientY - rect.top) / rect.height) * 100,
                      startP1: p
                    });
                  }}
                />
              ))}
            </svg>
          )}

          {/* PREVIEW FIXADO + TOOLTIP */}
          {placementMode && previewPlacement && (
            <div
              className="absolute z-30"
              style={{ top: `${previewPlacement.y}%`, left: `${previewPlacement.x}%`, transform: 'translate(-50%, -50%)' }}
            >
              <img
                src={`/assets/STAGE 1/buildings/${placementMode.id}.svg`}
                alt="preview_fixed"
                className="pointer-events-none opacity-95 drop-shadow-[0_0_18px_rgba(34,197,94,1)]"
                style={{ width: `calc(1020px * ${previewScale / 100})` }}
              />

              {/* TOOLTIP COM ÍCONES */}
              <div
                className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-md p-3 rounded-2xl flex flex-col gap-3 pointer-events-auto border border-white/15 shadow-2xl min-w-[220px]"
                onMouseDown={e => e.stopPropagation()}
              >
                {/* Custo da construção */}
                <div className="text-center text-yellow-400 font-mono font-bold text-sm">
                  💰 {formatMoney(placementMode.cost || 0)}
                </div>

                {/* Slider de Escala */}
                <div className="flex flex-col gap-1 px-1">
                  <div className="flex justify-between text-white/70 text-[10px] uppercase font-bold tracking-wider">
                    <span>Escala</span>
                    <span className="font-mono">{previewScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="2" max="30" step="1"
                    value={previewScale}
                    onChange={e => setPreviewScale(Number(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>

                {/* Controle de Camada (Z-Index) */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-white/70 text-[10px] uppercase font-bold tracking-wider">Camada</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); setPreviewZIndex(z => Math.max(1, z - 1)); }}
                      className="w-7 h-7 bg-slate-700 hover:bg-sky-600 text-white rounded-lg text-sm font-black flex items-center justify-center transition-colors"
                      title="Enviar para Trás"
                    >▼</button>
                    <span className="text-white font-mono text-xs w-4 text-center">{previewZIndex}</span>
                    <button
                      onClick={e => { e.stopPropagation(); setPreviewZIndex(z => Math.min(50, z + 1)); }}
                      className="w-7 h-7 bg-slate-700 hover:bg-sky-600 text-white rounded-lg text-sm font-black flex items-center justify-center transition-colors"
                      title="Trazer para Frente"
                    >▲</button>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 w-full">
                  <button
                    onClick={e => { e.stopPropagation(); cancelPlacement(); }}
                    className="bg-slate-700/80 hover:bg-red-600 text-white font-black h-11 w-12 rounded-xl text-xl flex items-center justify-center transition-all border border-white/10 shadow-inner"
                    title="Cancelar"
                  >✕</button>
                  <button
                    onClick={e => { e.stopPropagation(); setPreviewPlacement(null); }}
                    className="bg-slate-700/80 hover:bg-sky-600 text-white font-black h-11 w-12 rounded-xl text-xl flex items-center justify-center transition-all border border-white/10"
                    title="Reposicionar"
                  >✥</button>
                  <button
                    onClick={e => { e.stopPropagation(); confirmPlacement(); }}
                    className="bg-green-600 hover:bg-green-500 text-white font-black h-11 flex-1 rounded-xl text-2xl flex items-center justify-center transition-all shadow-[0_4px_0_0_#166534] active:translate-y-1 active:shadow-none border-2 border-green-400"
                    title="Gravar Local"
                  >✓</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FLANCO ESQUERDO */}
      <aside className="
        absolute z-40 pointer-events-auto
        left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4
        max-sm:left-1/2 max-sm:-translate-x-1/2 max-sm:top-auto max-sm:bottom-4 max-sm:flex-row max-sm:translate-y-0
      ">
        {/* Construir */}
        <button
          onClick={() => setIsBuildingsModalOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-[20px] flex items-center justify-center hover:scale-105 transition-transform shadow-[0_6px_0_0_#b45309,0_12px_18px_rgba(0,0,0,0.35)] active:translate-y-1.5 active:shadow-none border-2 border-yellow-200"
          title="Construir"
        >
          <img src="/assets/icons/hammer.svg" alt="hammer" className="w-7 h-7 sm:w-8 sm:h-8 opacity-90 drop-shadow" />
        </button>

        {/* Expansão de Terreno */}
        <button
          onClick={() => setIsLandModalOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-emerald-800/70 transition-colors border border-white/15 shadow-lg group"
          title="Comprar Terreno"
        >
          <span className="text-xl group-hover:scale-125 transition-transform">🗺</span>
        </button>

        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg group" title="Máquinas">
          <img src="/assets/icons/tractor.svg" alt="tractor" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
        </button>

        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg group" title="Relatórios">
          <img src="/assets/icons/lists.svg" alt="lists" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
        </button>
      </aside>

      {/* FLANCO DIREITO — Desktop flutuante, Mobile dock inferior direita */}
      <aside className="
        absolute z-40 pointer-events-auto
        right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4
        max-sm:right-4 max-sm:top-auto max-sm:bottom-4 max-sm:flex-row max-sm:translate-y-0
      ">
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg group" title="Correio">
          <img src="/assets/icons/mail.svg" alt="mail" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
        </button>
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg relative group" title="Alertas">
          <img src="/assets/icons/alert.svg" alt="alert" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-red-900 shadow-[0_0_6px_rgba(239,68,68,0.8)]"></span>
          </span>
        </button>
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg group" title="Loja">
          <img src="/assets/icons/store.svg" alt="store" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
        </button>
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg group" title="Configurações">
          <img src="/assets/icons/settings.svg" alt="settings" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={() => {
            setIsMeasuringMode(prev => {
              if (prev) {
                setMeasurePoints([]);
                setDrawingRect(null);
                setDragContext(null);
              }
              return !prev;
            });
          }}
          className={`w-12 h-12 sm:w-14 sm:h-14 backdrop-blur-md rounded-xl flex items-center justify-center transition-colors border shadow-lg group ${isMeasuringMode ? 'bg-purple-800 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-900/60 hover:bg-slate-800 border-white/15'}`}
          title="Medidor Geométrico Isométrico">
          <span className="text-xl group-hover:scale-110 transition-transform opacity-95 text-white bg-transparent pt-0.5">📐</span>
        </button>
      </aside>

      {/* GUIA DO PLACEMENT MODE */}
      {placementMode && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-[90] pointer-events-none">
          <div className="bg-yellow-500/90 backdrop-blur-md text-yellow-950 px-6 py-3 rounded-2xl shadow-2xl font-black border-2 border-yellow-300 animate-bounce text-sm">
            {previewPlacement ? 'Ajuste o tamanho e confirme (✓)' : 'Clique no terreno para posicionar a construção'}
          </div>
        </div>
      )}

      {/* TOAST DE FEEDBACK */}
      {gameState.toast && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
          <div className={`
            px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm backdrop-blur-md border
            ${gameState.toast.type === 'error' ? 'bg-red-900/90 text-red-200 border-red-700' : ''}
            ${gameState.toast.type === 'success' ? 'bg-green-900/90 text-green-200 border-green-700' : ''}
            ${gameState.toast.type === 'info' ? 'bg-slate-900/90 text-white border-slate-700' : ''}
          `}>
            {gameState.toast.message}
          </div>
        </div>
      )}

      {/* INSTRUÇÕES DO MEDIDOR TELA INTEIRA */}
      {isMeasuringMode && measurePoints.length === 0 && !drawingRect && (
        <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
          <div className="bg-purple-900/90 backdrop-blur-md text-purple-100 text-[11px] uppercase tracking-wide font-black p-5 flex flex-col items-center rounded-2xl border border-purple-500/50 shadow-[0_10px_40px_rgba(88,28,135,0.8)] text-center leading-relaxed">
            <span className="text-white text-sm mb-3 px-4 py-1.5 rounded-full bg-purple-700/60 shadow-inner">📐 O Mapeador Isométrico</span>
            <span className="opacity-95 text-xs text-purple-200">1. Clique e arraste para desenhar no mapa.</span>
            <span className="opacity-95 text-xs text-purple-200">2. Mova os cantos livremente depois de criar o layout.</span>
            <span className="text-yellow-300 mt-3 uppercase font-bold text-xs tracking-[0.2em] bg-black/30 px-3 py-1 rounded text-opacity-90">Tecla [ESC] fecha ou reseta</span>
          </div>
        </div>
      )}

      {/* INSTRUÇÕES DO MEDIDOR TELA INTEIRA */}
      {isMeasuringMode && measurePoints.length === 0 && !drawingRect && (
        <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
          <div className="bg-purple-900/90 backdrop-blur-md text-purple-100 text-[11px] uppercase tracking-wide font-black p-5 flex flex-col items-center rounded-2xl border border-purple-500/50 shadow-[0_10px_40px_rgba(88,28,135,0.8)] text-center leading-relaxed">
            <span className="text-white text-sm mb-3 px-4 py-1.5 rounded-full bg-purple-700/60 shadow-inner">📐 O Mapeador Isométrico</span>
            <span className="opacity-95 text-xs text-purple-200">1. Clique e arraste para desenhar no mapa.</span>
            <span className="opacity-95 text-xs text-purple-200">2. Mova os cantos livremente depois de criar o layout.</span>
            <span className="text-yellow-300 mt-3 uppercase font-bold text-xs tracking-[0.2em] bg-black/30 px-3 py-1 rounded text-opacity-90">Tecla [ESC] fecha ou reseta</span>
          </div>
        </div>
      )}

      {/* MODAIS */}
      <BuildingsModal
        isOpen={isBuildingsModalOpen}
        onClose={() => setIsBuildingsModalOpen(false)}
        onBuild={handleBuildInitiate}
        money={gameState.money}
      />
      <LandModal
        isOpen={isLandModalOpen}
        onClose={() => setIsLandModalOpen(false)}
        ownedSectors={gameState.ownedSectors}
        onBuySector={handleBuySector}
        money={gameState.money}
      />
    </div>
  );
}

export default App
