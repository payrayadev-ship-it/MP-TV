import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Users, Cpu, Activity, ShieldCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AnalyticsView: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setData(res.data);
      });
  }, []);

  const COLORS = ['#D50000', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[#D50000]" />
            <span>BROADCAST TELEMETRY & VIEWER ANALYTICS</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Analisis Statistik Penonton Live 24 Jam, Distribusi Konten & Performa Sistem OBS
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Viewers History Trend */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
          <h2 className="text-xs font-bold uppercase text-zinc-300 flex items-center space-x-2">
            <Users className="w-4 h-4 text-red-500" />
            <span>Tren Penonton Live 24 Jam (Viewers Peak)</span>
          </h2>

          <div className="h-64 w-full">
            {data?.viewerHistory && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.viewerHistory}>
                  <defs>
                    <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D50000" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#D50000" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="viewers"
                    stroke="#D50000"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorViewers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 2. Category Share Pie Chart */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
          <h2 className="text-xs font-bold uppercase text-zinc-300 flex items-center space-x-2">
            <PieChart className="w-4 h-4 text-amber-400" />
            <span>Persentase Kategori Program Siaran TV</span>
          </h2>

          <div className="h-64 w-full flex items-center justify-center">
            {data?.categoryShare && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categoryShare}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="percentage"
                    label={(entry: any) => `${entry.name} ${entry.percentage}%`}
                  >
                    {(data?.categoryShare || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. System Hardware Performance */}
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3 lg:col-span-2">
          <h2 className="text-xs font-bold uppercase text-zinc-300 flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Performa Hardware Enkoder & Bandwidth Jaringan (Mbps)</span>
          </h2>

          <div className="h-56 w-full">
            {data?.systemPerformance && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.systemPerformance}>
                  <XAxis dataKey="time" stroke="#71717a" fontSize={11} />
                  <YAxis stroke="#71717a" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                  />
                  <Bar dataKey="cpu" fill="#06b6d4" name="CPU Usage %" />
                  <Bar dataKey="bandwidth" fill="#10b981" name="Bandwidth Mbps" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
