import React from 'react';
import { CloudSun, Sun, CloudRain, Wind, Droplets, RefreshCw, MapPin } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';

export const WeatherView: React.FC = () => {
  const { weatherList, refreshData } = useBroadcast();

  return (
    <div className="p-4 max-w-[1600px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2 text-amber-400">
            <CloudSun className="w-5 h-5 text-amber-400" />
            <span>BMKG WEATHER BULLETIN - KABUPATEN MAJALENGKA</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Data Prakiraan Cuaca 6 Wilayah Utama Majalengka • Diperbarui Otomatis Setiap 30 Menit
          </p>
        </div>

        <button
          onClick={refreshData}
          className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-3.5 py-2 rounded-lg text-xs border border-zinc-700 transition"
        >
          <RefreshCw className="w-4 h-4 text-emerald-400" />
          <span>UPDATE SEKARANG</span>
        </button>
      </div>

      {/* Regions Weather Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(weatherList || []).map((w) => (
          <div
            key={w.region}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3 hover:border-zinc-700 transition relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-[#D50000]" />
                <h3 className="font-extrabold text-base text-white">{w.region}</h3>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">Updated: {w.lastUpdated}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-y border-zinc-900">
              <div>
                <span className="text-3xl font-black text-amber-400 font-mono">{w.tempCelsius}°C</span>
                <p className="text-xs font-bold text-zinc-300 mt-0.5">{w.condition}</p>
              </div>

              {w.icon === 'Sun' && <Sun className="w-12 h-12 text-amber-400 animate-spin-slow" />}
              {w.icon === 'CloudSun' && <CloudSun className="w-12 h-12 text-amber-300" />}
              {w.icon === 'Wind' && <Wind className="w-12 h-12 text-cyan-400" />}
              {w.icon === 'CloudRain' && <CloudRain className="w-12 h-12 text-blue-400" />}
              {w.icon === 'Cloud' && <CloudSun className="w-12 h-12 text-zinc-400" />}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-zinc-400 pt-1">
              <div className="flex items-center space-x-1.5 bg-zinc-900 p-2 rounded border border-zinc-800">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>Kelembaban: <strong className="text-white">{w.humidityPct}%</strong></span>
              </div>
              <div className="flex items-center space-x-1.5 bg-zinc-900 p-2 rounded border border-zinc-800">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Angin: <strong className="text-white">{w.windSpeedKmh} km/h</strong></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
