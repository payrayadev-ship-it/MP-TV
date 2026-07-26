import React, { useState } from 'react';
import { Calendar, Plus, Clock, Layers, ListMusic, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';
import { ScheduleItem } from '../types';

export const ScheduleView: React.FC = () => {
  const { schedules, playlists, scenes, refreshData } = useBroadcast();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [programTitle, setProgramTitle] = useState('');
  const [playlistId, setPlaylistId] = useState(playlists?.[0]?.id || 'pl-1');
  const [obsSceneId, setObsSceneId] = useState(scenes?.[0]?.id || 'sc-1');
  const [date, setDate] = useState('2026-07-25');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:30');
  const [recurring, setRecurring] = useState<'None' | 'Daily' | 'Weekly' | 'Monthly'>('Daily');

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programTitle) return;
    await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        programTitle,
        playlistId,
        obsSceneId,
        date,
        startTime,
        endTime,
        recurring,
      }),
    });
    setProgramTitle('');
    setShowAddModal(false);
    refreshData();
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-[#D50000]" />
            <span>JADWAL SIARAN OTOMATIS (BROADCAST SCHEDULER)</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Penjadwalan Acara TV, Pindah Scene OBS Otomatis & Playlist Berulang
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-[#D50000] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-lg shadow-red-950/60 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH JADWAL SIARAN</span>
        </button>
      </div>

      {/* Calendar Timeline Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center text-xs">
          <span className="font-bold text-white uppercase tracking-wider">
            Timetable Agenda Siaran Hari Ini (25 Juli 2026)
          </span>
          <span className="text-zinc-400 font-mono">4 Program Terjadwal</span>
        </div>

        <div className="divide-y divide-zinc-800">
          {(schedules || []).map((sch) => {
            const matchedPlaylist = (playlists || []).find((p) => p.id === sch.playlistId);
            const matchedScene = (scenes || []).find((s) => s.id === sch.obsSceneId || s.name === sch.obsSceneId);

            return (
              <div
                key={sch.id}
                className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-zinc-900/50 transition gap-4 text-xs"
              >
                <div className="flex items-start space-x-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg font-mono text-center shrink-0">
                    <span className="text-red-400 font-extrabold text-sm block">{sch.startTime}</span>
                    <span className="text-zinc-500 text-[10px]">s/d {sch.endTime}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white text-sm">{sch.programTitle}</h3>
                      <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800/40 text-[10px] font-bold rounded uppercase">
                        {sch.recurring}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-400 font-mono pt-0.5">
                      <span className="flex items-center space-x-1">
                        <ListMusic className="w-3.5 h-3.5 text-amber-400" />
                        <span>Playlist: {matchedPlaylist?.name || 'Playlist Standar'}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Scene: {matchedScene?.name || 'Studio Utama'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded-full">
                    ✔ SIAP OTOMATIS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-xl p-5 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Tambah Jadwal Program Siaran TV
            </h2>

            <form onSubmit={handleCreateSchedule} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Nama Program TV</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Dialogue Khusus DPRD Majalengka"
                  value={programTitle}
                  onChange={(e) => setProgramTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Pilih Playlist</label>
                  <select
                    value={playlistId}
                    onChange={(e) => setPlaylistId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                  >
                    {(playlists || []).map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Trigger Scene OBS</label>
                  <select
                    value={obsSceneId}
                    onChange={(e) => setObsSceneId(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                  >
                    {(scenes || []).map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Jam Mulai</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 font-bold block mb-1">Jam Selesai</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 p-2 rounded text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Siklus Berulang (Recurring)</label>
                <select
                  value={recurring}
                  onChange={(e) => setRecurring(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                >
                  <option value="None">Sekali Jalan (None)</option>
                  <option value="Daily">Setiap Hari (Daily)</option>
                  <option value="Weekly">Setiap Minggu (Weekly)</option>
                  <option value="Monthly">Setiap Bulan (Monthly)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D50000] hover:bg-red-700 text-white rounded font-bold"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
