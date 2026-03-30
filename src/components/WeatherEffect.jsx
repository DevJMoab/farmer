import React, { useMemo, useState, useEffect } from 'react';

// Partículas geradas uma única vez — não recalculam no render
const RAIN_DROPS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 0.35 + Math.random() * 0.45,
  opacity: 0.25 + Math.random() * 0.5,
  width: 1 + Math.random() * 1.5,
  height: 12 + Math.random() * 22,
}));

const SNOW_FLAKES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 10,
  duration: 5 + Math.random() * 7,
  size: 3 + Math.random() * 8,
  opacity: 0.4 + Math.random() * 0.5,
  sway: (Math.random() - 0.5) * 80,
}));

const PETALS = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,
  delay: Math.random() * 15,
  duration: 8 + Math.random() * 10,
  size: 5 + Math.random() * 9,
  color: ['#ffb7c5', '#ffdde3', '#fff0f3', '#ffd6b0'][Math.floor(Math.random() * 4)],
  rotation: Math.random() * 360,
  sway: (Math.random() - 0.5) * 100,
}));

// Cada evento climático: dura entre 2 e 6 minutos reais, ocorre aleatoriamente
const MIN_WEATHER_INTERVAL_MS = 60 * 1000;  // min 1 min entre eventos
const MAX_WEATHER_INTERVAL_MS = 5 * 60 * 1000; // max 5 min
const MIN_WEATHER_DURATION_MS = 30 * 1000; // dura min 30s
const MAX_WEATHER_DURATION_MS = 3 * 60 * 1000; // dura max 3 min

function useRandomWeather(season, enabled) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) { setActive(false); return; }

    let timeoutId;

    const scheduleNext = () => {
      const interval = MIN_WEATHER_INTERVAL_MS + Math.random() * (MAX_WEATHER_INTERVAL_MS - MIN_WEATHER_INTERVAL_MS);
      timeoutId = setTimeout(() => {
        setActive(true);
        const duration = MIN_WEATHER_DURATION_MS + Math.random() * (MAX_WEATHER_DURATION_MS - MIN_WEATHER_DURATION_MS);
        setTimeout(() => {
          setActive(false);
          scheduleNext();
        }, duration);
      }, interval);
    };

    // Primeira aparição é aleatória também
    scheduleNext();
    return () => clearTimeout(timeoutId);
  }, [season, enabled]);

  return active;
}

function RainEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <div className="absolute inset-0 bg-blue-950/10 transition-opacity duration-1000" />
      {RAIN_DROPS.map(drop => (
        <div
          key={drop.id}
          className="absolute top-0 rounded-full bg-blue-200"
          style={{
            left: `${drop.left}%`,
            width: `${drop.width}px`,
            height: `${drop.height}px`,
            opacity: drop.opacity,
            animation: `rainfall ${drop.duration}s ${drop.delay}s linear infinite`,
            willChange: 'transform',
          }}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-[15%] bg-gradient-to-t from-blue-900/20 to-transparent" />
    </div>
  );
}

function SnowEffect() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      <div className="absolute inset-0 bg-sky-950/12 transition-opacity duration-1000" />
      {SNOW_FLAKES.map(flake => (
        <div
          key={flake.id}
          className="absolute top-0 rounded-full bg-white"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            animation: `snowfall ${flake.duration}s ${flake.delay}s ease-in-out infinite`,
            '--sway': `${flake.sway}px`,
            willChange: 'transform',
          }}
        />
      ))}
      <div className="absolute bottom-0 left-0 right-0 h-[10%] bg-gradient-to-t from-white/10 to-transparent" />
    </div>
  );
}

function PetalEffect({ active }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden z-50 transition-opacity duration-2000"
      style={{ opacity: active ? 1 : 0 }}
    >
      {/* Levíssimo brilho primaveril */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,210,180,0.10) 0%, transparent 70%)',
      }} />
      {PETALS.map(petal => (
        <div
          key={petal.id}
          className="absolute top-0 rounded-full"
          style={{
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size * 0.55}px`,
            backgroundColor: petal.color,
            opacity: active ? 0.75 : 0,
            transform: `rotate(${petal.rotation}deg)`,
            animation: active ? `petalfall ${petal.duration}s ${petal.delay}s ease-in-out infinite` : 'none',
            '--sway': `${petal.sway}px`,
            transition: 'opacity 2s ease',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}

export function WeatherEffect({ season }) {
  // Chuva: ocorre aleatoriamente no Verão e Outono
  const rainActive = useRandomWeather(season, season === 'summer' || season === 'autumn');
  // Neve: ocorre aleatoriamente no Inverno
  const snowActive = useRandomWeather(season, season === 'winter');
  // Pétalas: ocorrem aleatoriamente na Primavera (mas com aparição mais suave)
  const petalsActive = useRandomWeather(season, season === 'spring');

  return (
    <>
      {/* Overlay sutil de cor por estação */}
      {season === 'autumn' && (
        <div className="absolute inset-0 pointer-events-none z-40"
          style={{ background: 'linear-gradient(to top, rgba(160,60,0,0.07) 0%, transparent 60%)' }} />
      )}
      {season === 'winter' && (
        <div className="absolute inset-0 pointer-events-none z-40"
          style={{ background: 'rgba(200, 230, 255, 0.05)' }} />
      )}

      {/* Efeitos Aleatórios */}
      {rainActive && (season === 'summer' || season === 'autumn') && <RainEffect />}
      {snowActive && season === 'winter' && <SnowEffect />}
      <PetalEffect active={petalsActive && season === 'spring'} />
    </>
  );
}
