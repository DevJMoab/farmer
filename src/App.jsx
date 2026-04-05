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

// =============================================
// CONFIGURAÇÕES DE CONSTRUÇÕES v2.10.0
// =============================================
const BUILDING_CONFIG = {
  // SOCIAL
  sede: { scale: 8, ext: 'svg' },
  // ANIMALS
  curral: { scale: 10, ext: 'png' },
  aprisco: { scale: 8, ext: 'png' },
  pocilga: { scale: 8, ext: 'png' },
  estabulo: { scale: 12, ext: 'png' },
  galinhas: { scale: 8, ext: 'png' },
  patos: { scale: 8, ext: 'png' },
  codornas: { scale: 6, ext: 'png' },
  avestrus: { scale: 10, ext: 'png' },
  viveirosParaPeixes: { scale: 12, ext: 'png' },
  // PRODUCTION
  pomar: { scale: 12, ext: 'png' },
  horta: { scale: 8, ext: 'png' },
  estufas: { scale: 15, ext: 'png' },
  moinho: { scale: 10, ext: 'png' },
  processamento: { scale: 12, ext: 'png' },
  // CROPS
  campo: { scale: 10, ext: 'png' },
  // STORAGE
  celeiro: { scale: 12, ext: 'png' },
  silo: { scale: 4, ext: 'svg' },
  silagem: { scale: 8, ext: 'png' },
  estoque: { scale: 10, ext: 'png' },
  // MACHINES
  garagem: { scale: 10, ext: 'png' },
  oficina: { scale: 12, ext: 'png' },
  logistica: { scale: 10, ext: 'png' },
  // OTHERS
  esterco: { scale: 6, ext: 'png' },
};

// HELPER: Calcula Z-index isométrico com base na posição vertical (Y)
const calculateIsometricZIndex = (y) => Math.floor(y * 10) + 10;

// Formata moeda BR
const formatMoney = (val) =>
  new Intl.NumberFormat('pt-BR', { style: 'decimal', minimumFractionDigits: 2 }).format(val);

function App() {
  const [isBuildingsModalOpen, setIsBuildingsModalOpen] = useState(false);
  const [isLandModalOpen, setIsLandModalOpen] = useState(false);

  // ROAD DRAWING STATE
  const [isRoadMode, setIsRoadMode] = useState(false);
  const [roadDrawing, setRoadDrawing] = useState(null); // { startX, startY, currentX, currentY, pathTiles: [] }

  // MEASURING TOOL STATE
  const [isMeasuringMode, setIsMeasuringMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState([]); // Array of 4 {x, y} coordinate objects
  const [drawingRect, setDrawingRect] = useState(null); // { startX, startY, currentX, currentY }
  const [dragContext, setDragContext] = useState(null); // { type: 'point' | 'edge', index, startMouseX, startMouseY, startP1, startP2 }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsRoadMode(false);
        setRoadDrawing(null);
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
    // Ruas (Construções Viárias)
    roads: [],
    // Demolição
    isDemolitionMode: false,
    removedNativeTreeIds: [],
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
    const config = BUILDING_CONFIG[buildingId] || { scale: 8, ext: 'png' };
    setPlacementMode({ id: buildingId, cost });
    setPreviewPlacement(null);
    setPreviewScale(config.scale);
    setPreviewZIndex(25); // Valor base que será recalculado ao confirmar
  }, [gameState.money]);

  const showToast = (message, type = 'info') => {
    setGameState(prev => ({ ...prev, toast: { message, type } }));
    setTimeout(() => setGameState(prev => ({ ...prev, toast: null })), 3000);
  };

  // =============================================
  // SISTEMA DE SETORES
  // =============================================
  const isInsideOwnedSector = useCallback((x_pct, y_pct) => {
    // A grade isométrica exata: 1020px base map, lado=800px (tile_rx=720, tile_ry=360)
    const px = (x_pct / 100) * 1020;
    const py = (y_pct / 100) * 1020;
    
    // Transformação reversa matemática (centro exato visual da engine: 510,510)
    const dx = px - 510;
    const dy = py - 510;
    
    // Para a grade 5x5, o offset central eleva de 2 para 4
    const A = dx / 720;
    const B = dy / 360 + 4;
    
    // Convertendo as offsets para a matriz tridimensional cartesiana de vetores
    const sCol = Math.round((A + B) / 2);
    const sRow = Math.round((B - A) / 2);
    
    // Fora das dimensões da matriz 5x5 do mapa expansivo
    if (sCol < 0 || sCol > 4 || sRow < 0 || sRow > 4) return false;
    
    const sectorId = sCol === 2 && sRow === 2 ? 'center' : `sec_${sCol}_${sRow}`;
    return sectorId === 'center' || gameState.ownedSectors.includes(sectorId);
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

  // SISTEMA DE EDIÇÃO DE CONSTRUÇÕES v2.9.0
  const [editingBuildingIndex, setEditingBuildingIndex] = useState(null);
  const [editState, setEditState] = useState('placed'); // 'moving' | 'placed'
  const [editBackup, setEditBackup] = useState(null);
  const longPressTimeoutRef = useRef(null);

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
      const config = BUILDING_CONFIG[placementMode.id] || { scale: 8, ext: 'png' };
      const finalZIndex = calculateIsometricZIndex(previewPlacement.y);
      return {
        ...prev,
        money: prev.money - cost,
        buildings: [...prev.buildings, { 
          id: placementMode.id, 
          x: previewPlacement.x, 
          y: previewPlacement.y, 
          scale: previewScale, 
          zIndex: finalZIndex,
          ext: config.ext 
        }],
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
  // FUNÇÕES DE EDIÇÃO v2.9.0
  // =============================================
  const handleBuildingMouseDown = useCallback((e, idx) => {
    // Só permite clique longo se for botão ESQUERDO e não houver outros modos ativos
    if (e.button !== 0 || gameState.isDemolitionMode || isMeasuringMode || placementMode || editingBuildingIndex !== null) return;
    
    // Armazena o índice alvo no ref para garantir que o timeout use o valor correto
    longPressTimeoutRef.current = setTimeout(() => {
      setEditingBuildingIndex(idx);
      setEditBackup({ ...gameState.buildings[idx] });
      setEditState('moving');
      // Pulso visual e feedback
      showToast('🖱️ Mova o mouse e clique para reposicionar!', 'info');
    }, 2000);
  }, [gameState.isDemolitionMode, isMeasuringMode, placementMode, editingBuildingIndex, gameState.buildings]);

  const handleBuildingMouseUp = useCallback(() => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  }, []);

  const confirmEdit = useCallback(() => {
    setEditingBuildingIndex(null);
    setEditState('placed');
    setEditBackup(null);
    showToast('✅ Alterações salvas!', 'success');
  }, []);

  const cancelEdit = useCallback(() => {
    if (editingBuildingIndex !== null && editBackup) {
      setGameState(prev => {
        const newBuildings = [...prev.buildings];
        newBuildings[editingBuildingIndex] = editBackup;
        return { ...prev, buildings: newBuildings };
      });
    }
    setEditingBuildingIndex(null);
    setEditState('placed');
    setEditBackup(null);
    showToast('✕ Edição cancelada', 'info');
  }, [editingBuildingIndex, editBackup]);

  const toggleFlipX = useCallback(() => {
    if (editingBuildingIndex === null) return;
    setGameState(prev => {
      const newBuildings = [...prev.buildings];
      const b = newBuildings[editingBuildingIndex];
      newBuildings[editingBuildingIndex] = { ...b, flipX: !b.flipX };
      return { ...prev, buildings: newBuildings };
    });
  }, [editingBuildingIndex]);

  // =============================================
  // PAN E ZOOM
  // =============================================
  const [isPlacementMenuOpen, setIsPlacementMenuOpen] = useState(false);
  const [windowMousePos, setWindowMousePos] = useState({ x: 0, y: 0 });
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

    // Início de desenho de Rua
    if (isRoadMode && mapRef.current && e.button === 0) {
      const rect = mapRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      // Impede início de curva/rua fora do próprio território
      if (!isInsideOwnedSector(x, y)) {
        showToast('❌ Você só pode construir estradas nos seus terrenos!', 'error');
        return;
      }
      setRoadDrawing({ startX: x, startY: y, currentX: x, currentY: y, pathTiles: [{x, y, zIndex: calculateIsometricZIndex(y)}] });
      return;
    }

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
    // RENDERIZADOR ISOMÉTRICO (RUAS) EM TEMPO REAL
    if (roadDrawing && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const pctX = ((e.clientX - rect.left) / rect.width) * 100;
      const pctY = ((e.clientY - rect.top) / rect.height) * 100;
      
      const dx = pctX - roadDrawing.startX;
      const dy = pctY - roadDrawing.startY;
      
      // Validação logarítmica/vetorial: força snap perfeito isométrica (y=0.5x ou y=-0.5x)
      const slope = Math.abs(dx * 1 + dy * 0.5) > Math.abs(dx * 1 + dy * -0.5) ? 0.5 : -0.5;
      
      // Distância visual entre os "tiles" de asfalto (pode ser calibrado)
      const stepX = 5; 
      const stepY = slope * stepX;
      
      const distanceX = Math.abs(dx);
      const steps = Math.max(1, Math.floor(distanceX / stepX) + 1);
      const signX = dx >= 0 ? 1 : -1;
      
      const newTiles = [];
      for (let i = 0; i < steps; i++) {
        const nx = roadDrawing.startX + (signX * stepX * i);
        const ny = roadDrawing.startY + (signX * stepY * i);
        // Só gera o asfalto por cima se estiver dentro da casa e terras adquiridas
        if (isInsideOwnedSector(nx, ny)) {
          newTiles.push({
            x: nx,
            y: ny,
            zIndex: calculateIsometricZIndex(ny)
          });
        }
      }
      setRoadDrawing(prev => ({ ...prev, currentX: pctX, currentY: pctY, pathTiles: newTiles }));
      return;
    }

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

    // Posicionamento do cursor em pixels para o mapeador
    if (isMeasuringMode && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
        screenX: e.clientX,
        screenY: e.clientY
      });
    }

    // Atualiza mousePos também quando no modo de mover (fantasma)
    if ((placementMode && !previewPlacement || editState === 'moving' || isRoadMode) && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
        screenX: e.clientX,
        screenY: e.clientY
      });
    }
    if (!isPanning) return;
    setTransform(prev => ({ ...prev, x: e.clientX - startPanRef.current.x, y: e.clientY - startPanRef.current.y }));
  }, [placementMode, previewPlacement, isPanning, drawingRect, dragContext, editState, isRoadMode, roadDrawing, isInsideOwnedSector]);

  const handleMouseUp = useCallback(() => {
    if (roadDrawing) {
      if (roadDrawing.pathTiles.length > 0) {
        setGameState(prev => ({
          ...prev,
          roads: [...prev.roads, ...roadDrawing.pathTiles] // Transplanta pro array final estático
        }));
      }
      setRoadDrawing(null);
    }

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
  }, [drawingRect, dragContext, roadDrawing]);

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
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      if (!isInsideOwnedSector(x, y)) {
        showToast('❌ Você precisa comprar este terreno primeiro!', 'error');
        return;
      }
      
      setPreviewPlacement({ x, y });
    }

    // Se estiver editando e clicar no mapa para reposicionar
    if (editingBuildingIndex !== null && editState === 'moving' && mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      const newX = ((e.clientX - rect.left) / rect.width) * 100;
      const newY = ((e.clientY - rect.top) / rect.height) * 100;
      
      if (!isInsideOwnedSector(newX, newY)) {
        showToast('❌ Você precisa comprar este terreno primeiro!', 'error');
        return;
      }
      
      setGameState(prev => {
        const newBuildings = [...prev.buildings];
        newBuildings[editingBuildingIndex] = { 
          ...newBuildings[editingBuildingIndex], 
          x: newX, 
          y: newY,
          zIndex: calculateIsometricZIndex(newY) // Atualiza profundidade ao mover
        };
        return { ...prev, buildings: newBuildings };
      });
      setEditState('placed');
      showToast('📍 Posição confirmada! Ajuste as opções.', 'success');
    }
  }, [placementMode, previewPlacement, editingBuildingIndex, editState]);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.addEventListener('wheel', handleWheel, { passive: false });
    return () => { if (el) el.removeEventListener('wheel', handleWheel); };
  }, [handleWheel]);

  // =============================================
  // RENDER
  // =============================================
  const currentSeason = SEASONS[gameState.seasonIndex];

  // Monitorar posição do mouse global para o Custom Cursor
  useEffect(() => {
    const handleGlobalMouseMove = (e) => {
      setWindowMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  // Tecla ESC para desligar o modo de demolição v2.8.8
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setGameState(prev => ({ ...prev, isDemolitionMode: false }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`h-screen w-screen relative overflow-hidden flex flex-col font-sans select-none bg-[#99cc33] ${gameState.isDemolitionMode ? 'cursor-none' : ''}`}>

      {/* CURSOR CUSTOMIZADO (DEMOLIÇÃO) v2.8.7 */}
      {gameState.isDemolitionMode && (
        <div 
          className="fixed pointer-events-none z-[9999] select-none"
          style={{ 
            left: windowMousePos.x, 
            top: windowMousePos.y, 
            transform: 'translate(-50%, -50%)',
            width: '45px',
            height: '45px'
          }}
        >
          <img 
            src="/assets/icons/demolish.svg" 
            alt="demolition-cursor" 
            className="w-full h-full filter drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]"
            style={{ animation: 'demolish-shake 0.3s infinite ease-in-out' }}
          />
        </div>
      )}

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
        isMeasuringMode={isMeasuringMode}
        mousePos={mousePos}
      />

      {/* MAPA CENTRAL */}
      <main
        ref={containerRef}
        className={`flex-1 relative overflow-hidden pointer-events-auto bg-transparent
          ${isPanning ? 'cursor-grabbing' : gameState.isDemolitionMode ? 'cursor-none' : ''}`}
        style={gameState.isDemolitionMode ? {} : (isPanning) ? {} : (placementMode || editState === 'moving') ? { cursor: 'crosshair' } : { cursor: 'grab' }}
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
          {/* PLACEHOLDER invisível para dar tamanho ao mapa navegável */}
          <div className="w-[1020px] h-[1020px] opacity-0 pointer-events-none" />

          {/* LIMITES DO TERRENO: Renderizado em perspectiva isométrica (Grade 5x5 Expanded Map) */}
          <svg
            width="100%" height="100%"
            className="absolute inset-0 pointer-events-none overflow-visible"
            style={{ zIndex: 2 }}
            viewBox="0 0 1020 1020"
          >
            {Array.from({ length: 25 }).map((_, i) => {
              const col = i % 5;
              const row = Math.floor(i / 5);
              const id = col === 2 && row === 2 ? 'center' : `sec_${col}_${row}`;
              
              const isOwned = id === 'center' || gameState.ownedSectors.includes(id);
              
              // Losangos calculados em escala real para "Aresta = 800px" (Ratio 2:1 isométrico ideal)
              // Tile Bounding Box: Width = 1440, Height = 720 => rx = 720, ry = 360.
              const cx = 510 + (col - row) * 720;
              const cy = 510 + (col + row - 4) * 360;
              
              const points = `${cx},${cy - 360} ${cx + 720},${cy} ${cx},${cy + 360} ${cx - 720},${cy}`;
              
              return (
                <polygon
                  key={id}
                  points={points}
                  fill={isOwned ? "rgba(134,239,172,0.03)" : "rgba(0,0,0,0.2)"}
                  stroke={isOwned ? "rgba(134,239,172,0.4)" : "rgba(255,255,255,0.15)"}
                  strokeWidth="2"
                  strokeDasharray={isOwned ? "10 5" : "5 8"}
                />
              );
            })}
          </svg>
          {/* ESTRADA E-W NATIVA DA REGIÃO */}
          <WorldRoad />

          {/* DECORAÇÕES DO MUNDO (Florestas Iniciais Nativa e Culling Dinâmico) */}
          <WorldDecor
            isDemolitionMode={gameState.isDemolitionMode}
            removedIds={gameState.removedNativeTreeIds}
            isInsideOwnedSector={isInsideOwnedSector}
            onDemolish={(id) => {
              setGameState(prev => ({
                ...prev,
                removedNativeTreeIds: [...prev.removedNativeTreeIds, id],
                toast: { message: '🌳 Árvore nativa removida!', type: 'info' }
              }));
              setTimeout(() => setGameState(p => ({ ...p, toast: null })), 2000);
            }}
          />

          {/* RUAS PROCEDIMENTAIS DO USUÁRIO */}
          {gameState.roads && gameState.roads.map((r, idx) => (
            <img
              key={`road_${idx}`}
              src="/assets/decor/street.svg"
              alt="street"
              className="absolute pointer-events-none drop-shadow-sm transition-opacity"
              style={{
                top: `${r.y}%`, left: `${r.x}%`,
                transform: 'translate(-50%, -50%)',
                width: '6.5%', 
                zIndex: r.zIndex || 9,
                opacity: gameState.isDemolitionMode ? 0.3 : 1
              }}
            />
          ))}

          {/* FANTASMA ISOMÉTRICO (PREVIEW PATHING) */}
          {roadDrawing && roadDrawing.pathTiles.map((r, idx) => (
            <img
              key={`rpreview_${idx}`}
              src="/assets/decor/street.svg"
              alt="street_preview"
              className="absolute pointer-events-none opacity-80 filter drop-shadow-[0_0_8px_rgba(253,224,71,0.8)]"
              style={{
                top: `${r.y}%`, left: `${r.x}%`,
                transform: 'translate(-50%, -50%)',
                width: '6.5%',
                zIndex: (r.zIndex || 9) + 9999
              }}
            />
          ))}

          {/* CONSTRUÇÕES CONFIRMADAS */}
          {gameState.buildings.map((b, idx) => {
            const isDecor = b.id.startsWith('tree');
            const isEditing = editingBuildingIndex === idx;
            const isMoving = isEditing && editState === 'moving';
            
            // Quando a construção está no modo "moving" (fantasma), ela segue o mouse
            const renderX = isMoving ? mousePos.x : b.x;
            const renderY = isMoving ? mousePos.y : b.y;
            
            return (
              <img
                key={idx}
                src={isDecor ? `/assets/decor/${b.id}.svg` : `/assets/STAGE 1/buildings/${b.id}.${b.ext || 'png'}`}
                alt={b.id}
                onMouseDown={(e) => handleBuildingMouseDown(e, idx)}
                onMouseUp={handleBuildingMouseUp}
                onMouseLeave={handleBuildingMouseUp}
                onClick={gameState.isDemolitionMode ? (e) => {
                  e.stopPropagation();
                  setGameState(prev => {
                    const newBuildings = [...prev.buildings];
                    newBuildings.splice(idx, 1);
                    return {
                      ...prev,
                      buildings: newBuildings,
                      toast: { message: `🏗 Estrutura "${b.id}" demolida!`, type: 'info' }
                    };
                  });
                  setTimeout(() => setGameState(p => ({ ...p, toast: null })), 2000);
                } : undefined}
                className={`absolute drop-shadow-xl transition-all
                  ${gameState.isDemolitionMode ? 'hover-demolish-building pointer-events-auto' : 'pointer-events-auto'}
                  ${isEditing && !isMoving ? 'selected-building' : ''}`}
                style={{ 
                  top: `${renderY}%`, 
                  left: `${renderX}%`, 
                  transform: `translate(-50%, -50%) scaleX(${b.flipX ? -1 : 1})`, 
                  width: `${b.scale || 8}%`, 
                  zIndex: isMoving ? 9999 : (b.zIndex || 10),
                  opacity: (editingBuildingIndex !== null && !isEditing) ? 0.6 : (isMoving ? 0.001 : 1),
                  // Não definir 'filter' inline no modo demolição — deixa o CSS animation agir
                  filter: gameState.isDemolitionMode ? undefined : (isEditing && !isMoving) ? 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.8))' : undefined
                }}
              />
            );
          })}

          {/* PREVIEW DO HOVER (Placement mode) */}
          {placementMode && !previewPlacement && (
            <img
              src={placementMode.id.startsWith('tree') ? `/assets/decor/${placementMode.id}.svg` : `/assets/STAGE 1/buildings/${placementMode.id}.${BUILDING_CONFIG[placementMode.id]?.ext || 'png'}`}
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

          {/* FANTASMA DO MODO MOVER (segue cursor igual ao placement) */}
          {editingBuildingIndex !== null && editState === 'moving' && (() => {
            const b = gameState.buildings[editingBuildingIndex];
            const isDecor = b.id.startsWith('tree');
            return (
              <img
                src={isDecor ? `/assets/decor/${b.id}.svg` : `/assets/STAGE 1/buildings/${b.id}.${b.ext || 'png'}`}
                alt="move_ghost"
                className="absolute pointer-events-none"
                style={{
                  top: `${mousePos.y}%`,
                  left: `${mousePos.x}%`,
                  transform: `translate(-50%, -50%) scaleX(${b.flipX ? -1 : 1})`,
                  width: `${b.scale || 8}%`,
                  opacity: 0.55,
                  zIndex: 9999,
                  filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.85))',
                }}
              />
            );
          })()}

          {/* MEDIDOR ISOMÉTRICO AVANÇADO */}
          {isMeasuringMode && (
            <svg width="100%" height="100%" className="absolute inset-0 z-[1000] overflow-visible pointer-events-none">
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
              className="absolute z-[10000]"
              style={{ top: `${previewPlacement.y}%`, left: `${previewPlacement.x}%`, transform: 'translate(-50%, -50%)' }}
            >
              <img
                src={placementMode.id.startsWith('tree') ? `/assets/decor/${placementMode.id}.svg` : `/assets/STAGE 1/buildings/${placementMode.id}.${BUILDING_CONFIG[placementMode.id]?.ext || 'png'}`}
                alt="preview_fixed"
                className="pointer-events-none opacity-95 drop-shadow-[0_0_18px_rgba(34,197,94,1)]"
                style={{ width: `calc(1020px * ${previewScale / 100})` }}
              />

              {/* TOOLTIP COM ÍCONES */}
              <div
                className="absolute top-full mt-4 left-1/2 bg-black/90 backdrop-blur-md p-3 rounded-2xl flex flex-col gap-3 pointer-events-auto border border-white/15 shadow-2xl min-w-[220px]"
                onMouseDown={e => e.stopPropagation()}
                style={{ transform: `translateX(-50%) scale(${1 / transform.scale})`, transformOrigin: 'top center' }}
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

          {/* MENU DE EDIÇÃO v2.9.0 */}
          {editingBuildingIndex !== null && editState === 'placed' && (
            <div
              className="absolute z-[10000]"
              style={{ 
                top: `${gameState.buildings[editingBuildingIndex].y}%`, 
                left: `${gameState.buildings[editingBuildingIndex].x}%`, 
                transform: 'translate(-50%, -50%)' 
              }}
            >
              {/* TOOLTIP DE EDIÇÃO */}
              <div 
                className="absolute top-full mt-6 left-1/2 bg-slate-900/95 backdrop-blur-xl p-4 rounded-3xl flex flex-col gap-4 pointer-events-auto border border-sky-400/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] min-w-[240px]"
                onMouseDown={e => e.stopPropagation()}
                style={{ transform: `translateX(-50%) scale(${1 / transform.scale})`, transformOrigin: 'top center' }}
              >
                <div className="text-center text-sky-400 font-black text-xs uppercase tracking-[0.2em] border-b border-white/10 pb-2">
                  Modo Edição
                </div>

                {/* Slider de Escala */}
                <div className="flex flex-col gap-1.5 px-1">
                  <div className="flex justify-between text-white/70 text-[10px] uppercase font-bold tracking-wider">
                    <span>Escala</span>
                    <span className="font-mono text-sky-300">{gameState.buildings[editingBuildingIndex].scale?.toFixed(0) || 8}%</span>
                  </div>
                  <input
                    type="range"
                    min="2" max="40" step="1"
                    value={gameState.buildings[editingBuildingIndex].scale || 8}
                    onChange={e => {
                      const newScale = Number(e.target.value);
                      setGameState(prev => {
                        const nb = [...prev.buildings];
                        nb[editingBuildingIndex] = { ...nb[editingBuildingIndex], scale: newScale };
                        return { ...prev, buildings: nb };
                      });
                    }}
                    className="w-full cursor-pointer accent-sky-500"
                  />
                </div>

                {/* Camada e Flip */}
                <div className="flex items-end justify-between px-1 gap-3">
                  {/* Camada - agora mais larga */}
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-white/70 text-[10px] uppercase font-bold tracking-wider">Camada</span>
                    <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl">
                      <button
                        onClick={e => { 
                          e.stopPropagation(); 
                          setGameState(prev => {
                            const nb = [...prev.buildings];
                            nb[editingBuildingIndex] = { ...nb[editingBuildingIndex], zIndex: Math.max(1, (nb[editingBuildingIndex].zIndex || 10) - 1) };
                            return { ...prev, buildings: nb };
                          });
                        }}
                        className="w-8 h-8 bg-slate-700 hover:bg-sky-600 text-white rounded-lg flex items-center justify-center transition-all"
                      >▼</button>
                      <span className="text-white font-mono text-sm flex-1 text-center">{gameState.buildings[editingBuildingIndex].zIndex || 10}</span>
                      <button
                        onClick={e => { 
                          e.stopPropagation(); 
                          setGameState(prev => {
                            const nb = [...prev.buildings];
                            nb[editingBuildingIndex] = { ...nb[editingBuildingIndex], zIndex: Math.min(100, (nb[editingBuildingIndex].zIndex || 10) + 1) };
                            return { ...prev, buildings: nb };
                          });
                        }}
                        className="w-8 h-8 bg-slate-700 hover:bg-sky-600 text-white rounded-lg flex items-center justify-center transition-all"
                      >▲</button>
                    </div>
                  </div>

                  {/* Espelho — mesmo tamanho dos outros botões de ação */}
                  <div className="flex flex-col gap-1 items-center">
                    <span className="text-white/70 text-[10px] uppercase font-bold tracking-wider">Espelho</span>
                    <button
                      onClick={e => { e.stopPropagation(); toggleFlipX(); }}
                      className={`h-10 w-12 rounded-xl flex items-center justify-center text-xl transition-all border ${gameState.buildings[editingBuildingIndex].flipX ? 'bg-sky-600 border-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.4)]' : 'bg-slate-800 border-white/10 hover:bg-slate-700'}`}
                      title="Espelhar Horizontalmente"
                    >↔️</button>
                  </div>
                </div>

                {/* Botões de Ação */}
                <div className="flex gap-2 w-full pt-2">
                  <button
                    onClick={e => { e.stopPropagation(); cancelEdit(); }}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold h-12 w-12 rounded-2xl flex items-center justify-center transition-all border border-white/10"
                    title="Cancelar"
                  >✕</button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      if (window.confirm(`Deseja realmente demolir esta estrutura (${gameState.buildings[editingBuildingIndex].id})?`)) {
                        setGameState(prev => {
                          const nb = [...prev.buildings];
                          nb.splice(editingBuildingIndex, 1);
                          return { ...prev, buildings: nb, toast: { message: '🏗 Estrutura demolida!', type: 'info' } };
                        });
                        setEditingBuildingIndex(null);
                        setEditBackup(null);
                      }
                    }}
                    className="bg-red-800/80 hover:bg-red-600 text-white font-bold h-12 w-12 rounded-2xl flex items-center justify-center transition-all border border-red-500/30"
                    title="Demolir"
                  >🗑️</button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setEditState('moving');
                      showToast('🖱️ Clique no mapa para confirmar o novo local.', 'info');
                    }}
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl transition-all border ${editState === 'moving' ? 'bg-sky-600 border-sky-300 text-white shadow-[0_0_12px_rgba(14,165,233,0.4)]' : 'bg-slate-800 border-white/10 hover:bg-slate-700 text-sky-300'}`}
                    title="Mover / Reposicionar"
                  >✥</button>
                  <button
                    onClick={e => { e.stopPropagation(); confirmEdit(); }}
                    className="bg-sky-600 hover:bg-sky-500 text-white font-black h-12 w-16 rounded-2xl text-2xl flex items-center justify-center transition-all shadow-[0_4px_0_0_#0369a1] active:translate-y-1 active:shadow-none border border-sky-300"
                    title="Salvar"
                  >✓</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FLANCO ESQUERDO — Edição do Mundo | Visível apenas em desktop */}
      <aside className="
        absolute z-40 pointer-events-auto
        left-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4
        hidden sm:flex
      ">
        {/* Construir */}
        <button
          onClick={() => setIsBuildingsModalOpen(true)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-[20px] flex items-center justify-center hover:scale-105 transition-transform shadow-[0_6px_0_0_#b45309,0_12px_18px_rgba(0,0,0,0.35)] active:translate-y-1.5 active:shadow-none border-2 border-yellow-200"
          title="Construir"
        >
          <img src="/assets/icons/hammer.svg" alt="hammer" className="w-7 h-7 sm:w-8 sm:h-8 opacity-90 drop-shadow" />
        </button>

        {/* Construção de Cidades/Rua */}
        <button
          onClick={() => {
            setIsRoadMode(prev => {
              if (prev) setRoadDrawing(null);
              return !prev;
            });
            setIsMeasuringMode(false);
          }}
          className={`w-12 h-12 sm:w-14 sm:h-14 backdrop-blur-md rounded-xl flex items-center justify-center transition-colors border shadow-lg group ${isRoadMode ? 'bg-orange-800 border-orange-400 shadow-[0_0_15px_rgba(251,146,60,0.5)]' : 'bg-slate-900/60 hover:bg-slate-800 border-white/15'}`}
          title="Ferramenta Viária">
          <span className="text-xl group-hover:scale-110 transition-transform pt-0.5" style={{ WebkitFilter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))'}}>🛣️</span>
        </button>

        {/* Medição (Movido para Esquerda) */}
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
            setIsRoadMode(false);
          }}
          className={`w-12 h-12 sm:w-14 sm:h-14 backdrop-blur-md rounded-xl flex items-center justify-center transition-colors border shadow-lg group ${isMeasuringMode ? 'bg-purple-800 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'bg-slate-900/60 hover:bg-slate-800 border-white/15'}`}
          title="Medidor Isométrico">
          <span className="text-xl group-hover:scale-110 transition-transform opacity-95 text-white bg-transparent pt-0.5" style={{ WebkitFilter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.4))'}}>📐</span>
        </button>

        {/* Demolição */}
        <button
          onClick={() => setGameState(prev => ({ ...prev, isDemolitionMode: !prev.isDemolitionMode }))}
          className={`w-12 h-12 sm:w-14 sm:h-14 backdrop-blur-md rounded-xl flex items-center justify-center transition-all border shadow-lg group ${gameState.isDemolitionMode ? 'bg-red-800 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.6)]' : 'bg-slate-900/60 hover:bg-slate-800 border-white/15'}`}
          title="Demolição"
        >
          <img src="/assets/icons/demolish.svg" alt="demolition" className="w-6 h-6 sm:w-8 sm:h-8 opacity-90 group-hover:scale-110 transition-transform filter drop-shadow-md object-contain" />
          {gameState.isDemolitionMode && <span className="absolute -top-1 -right-1 bg-red-500 text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse text-white border border-red-300">ON</span>}
        </button>

        {/* Expansão de Terreno */}
        <button
          onClick={() => setIsLandModalOpen(true)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-emerald-800/70 transition-colors border border-white/15 shadow-lg group"
          title="Comprar Terreno"
        >
          <span className="text-xl group-hover:scale-125 transition-transform">🗺</span>
        </button>
      </aside>

      {/* FLANCO DIREITO — Gestão e Sistema | Visível apenas em desktop */}
      <aside className="
        absolute z-40 pointer-events-auto
        right-4 top-1/2 -translate-y-1/2 flex-col items-center gap-4
        hidden sm:flex
      ">
        {/* Tarefas (Renomeado de Relatórios) */}
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg group" title="Tarefas">
          <img src="/assets/icons/lists.svg" alt="tasks" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
        </button>

        {/* Alertas */}
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg relative group" title="Alertas">
          <img src="/assets/icons/alert.svg" alt="alert" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border border-red-900 shadow-[0_0_6px_rgba(239,68,68,0.8)]"></span>
          </span>
        </button>

        {/* Loja */}
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg group" title="Loja">
          <img src="/assets/icons/store.svg" alt="store" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
        </button>

        {/* Configurações */}
        <button className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-900/60 backdrop-blur-md rounded-xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/15 shadow-lg group" title="Configurações">
          <img src="/assets/icons/settings.svg" alt="settings" className="w-6 h-6 opacity-75 group-hover:scale-110 transition-transform" />
        </button>
      </aside>

      {/* DOCK MOBILE — Visível apenas em telas pequenas (< sm) */}
      <aside className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex sm:hidden w-[96%] max-w-[360px] justify-center pb-safe">
        <div
          className="grid grid-cols-4 gap-3 px-4 py-3 w-full bg-slate-900/90 backdrop-blur-xl rounded-[24px] border border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] justify-items-center"
          style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
        >
          {/* Construir */}
          <button
            onClick={() => setIsBuildingsModalOpen(true)}
            className="w-12 h-12 bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-[0_4px_0_0_#b45309] active:translate-y-1 active:shadow-none border border-yellow-200"
            title="Construir"
          >
            <img src="/assets/icons/hammer.svg" alt="hammer" className="w-6 h-6 opacity-90" />
          </button>

          {/* Ruas (Novo) */}
          <button
            onClick={() => {
              setIsRoadMode(prev => {
                if (prev) setRoadDrawing(null);
                return !prev;
              });
              setIsMeasuringMode(false);
            }}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
              isRoadMode
                ? 'bg-orange-800 border-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.5)]'
                : 'bg-slate-800 border-white/10'
            }`}
            title="Ferramenta Viária"
          >
            <span className="text-lg pb-0.5">🛣️</span>
          </button>

          {/* Medição */}
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
              setIsRoadMode(false);
            }}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
              isMeasuringMode
                ? 'bg-purple-800 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                : 'bg-slate-800 border-white/10'
            }`}
            title="Medidor Isométrico"
          >
            <span className="text-lg">📐</span>
          </button>

          {/* Demolição */}
          <button
            onClick={() => setGameState(prev => ({ ...prev, isDemolitionMode: !prev.isDemolitionMode }))}
            className={`relative w-11 h-11 rounded-2xl flex items-center justify-center border transition-all ${
              gameState.isDemolitionMode
                ? 'bg-red-800 border-red-400 shadow-[0_0_12px_rgba(220,38,38,0.6)]'
                : 'bg-slate-800 border-white/10'
            }`}
            title="Demolição"
          >
            <img src="/assets/icons/demolish.svg" alt="demolition" className="w-5 h-5 opacity-90 object-contain" />
            {gameState.isDemolitionMode && <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] font-black px-1 py-0.5 rounded-full text-white">ON</span>}
          </button>

          {/* Comprar Terreno */}
          <button
            onClick={() => setIsLandModalOpen(true)}
            className="w-11 h-11 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-emerald-900/60 transition-colors"
            title="Comprar Terreno"
          >
            <span className="text-lg">🗺</span>
          </button>

          {/* Tarefas */}
          <button
            className="w-11 h-11 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10"
            title="Tarefas"
          >
            <img src="/assets/icons/lists.svg" alt="tasks" className="w-5 h-5 opacity-75" />
          </button>

          {/* Alertas */}
          <button
            className="relative w-11 h-11 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10"
            title="Alertas"
          >
            <img src="/assets/icons/alert.svg" alt="alert" className="w-5 h-5 opacity-75" />
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600 border border-red-900" />
            </span>
          </button>

          {/* Loja */}
          <button
            className="w-11 h-11 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10"
            title="Loja"
          >
            <img src="/assets/icons/store.svg" alt="store" className="w-5 h-5 opacity-75" />
          </button>

          {/* Configurações */}
          <button
            className="w-11 h-11 bg-slate-800 rounded-2xl flex items-center justify-center border border-white/10"
            title="Configurações"
          >
            <img src="/assets/icons/settings.svg" alt="settings" className="w-5 h-5 opacity-75" />
          </button>
        </div>
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
        <div className="absolute bottom-36 sm:bottom-8 left-1/2 -translate-x-1/2 z-[200] pointer-events-none"
          style={{ bottom: 'max(160px, calc(160px + env(safe-area-inset-bottom)))' }}
        >
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

      {/* CURSOR TRACKER (Mapeamento de pixels) */}
      {isMeasuringMode && (
        <div
          className="fixed z-[250] pointer-events-none bg-black/80 backdrop-blur-sm border border-purple-500/50 px-2 py-1 rounded-md shadow-lg"
          style={{
            left: `${mousePos.screenX + 15}px`,
            top: `${mousePos.screenY + 15}px`,
            display: (mousePos.screenX === undefined) ? 'none' : 'block'
          }}
        >
          <div className="text-[10px] font-mono text-purple-200 flex flex-col items-center">
            <span>X: {(mousePos.x * 10.2).toFixed(0)}px</span>
            <span>Y: {(mousePos.y * 10.2).toFixed(0)}px</span>
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
