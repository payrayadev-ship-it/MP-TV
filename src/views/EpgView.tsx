import React, { useState, useEffect } from 'react';
import {
  Tv,
  Calendar,
  Clock,
  Search,
  Filter,
  Radio,
  FileCode,
  Download,
  Copy,
  Check,
  Play,
  Layers,
  ListMusic,
  Printer,
  Sparkles,
  ChevronRight,
  Info,
  Table,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  Film,
  ExternalLink,
} from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';
import { ScheduleItem, VideoCategory } from '../types';

export const EpgView: React.FC = () => {
  const { schedules, playlists, scenes, videos, changeScene } = useBroadcast();

  // View state
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [selectedDate, setSelectedDate] = useState('2026-07-25');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [copiedFeed, setCopiedFeed] = useState<string | null>(null);

  // Modals
  const [showXmlModal, setShowXmlModal] = useState(false);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [previewSchedule, setPreviewSchedule] = useState<ScheduleItem | null>(null);

  // Update current time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format helper functions
  const getCurrentTimeString = () => {
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const parseMinutes = (timeStr: string) => {
    if (!timeStr) return 0;
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const currentMinutesNow = currentTime.getHours() * 60 + currentTime.getMinutes();

  // Helper to determine status relative to current time
  const getScheduleStatus = (sch: ScheduleItem) => {
    const startMins = parseMinutes(sch.startTime);
    const endMins = parseMinutes(sch.endTime);

    if (currentMinutesNow >= startMins && currentMinutesNow < endMins) {
      return { label: 'ON AIR', color: 'bg-red-600 text-white animate-pulse', type: 'live' };
    } else if (currentMinutesNow < startMins) {
      if (startMins - currentMinutesNow <= 60) {
        return { label: 'SEGERA HADIR', color: 'bg-amber-500/20 text-amber-400 border border-amber-500/30', type: 'next' };
      }
      return { label: 'TERJADWAL', color: 'bg-zinc-800 text-zinc-300 border border-zinc-700', type: 'upcoming' };
    } else {
      return { label: 'SELESAI', color: 'bg-zinc-900 text-zinc-500 border border-zinc-800', type: 'passed' };
    }
  };

  // Categories list
  const categories: (string | VideoCategory)[] = [
    'All',
    'Berita',
    'Wisata',
    'Kuliner',
    'Pemerintah',
    'Polres',
    'Budaya',
    'Olahraga',
    'Hiburan',
  ];

  // Filtered schedules
  const filteredSchedules = (schedules || []).filter((sch) => {
    const matchesCategory = selectedCategory === 'All' || sch.category === selectedCategory;
    const matchesSearch =
      sch.programTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sch.category && sch.category.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDate = !selectedDate || sch.date === selectedDate || sch.recurring === 'Daily';
    return matchesCategory && matchesSearch && matchesDate;
  });

  // Currently airing & up next items
  const currentlyAiring = (schedules || []).find((sch) => {
    const start = parseMinutes(sch.startTime);
    const end = parseMinutes(sch.endTime);
    return currentMinutesNow >= start && currentMinutesNow < end;
  }) || schedules?.[0];

  const upNextItem = (schedules || []).find((sch) => {
    const start = parseMinutes(sch.startTime);
    return start > currentMinutesNow;
  });

  // Calculate airing progress percentage
  const getAiringProgress = (sch: ScheduleItem) => {
    const start = parseMinutes(sch.startTime);
    const end = parseMinutes(sch.endTime);
    const total = end - start;
    if (total <= 0) return 0;
    const elapsed = currentMinutesNow - start;
    const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
    return Math.round(pct);
  };

  // XMLTV Generator
  const generateXmlTv = () => {
    const channelId = 'majalengkaposttv.hd';
    const channelName = 'Majalengka Post TV 4K HD';
    const dateFormatted = selectedDate.replace(/-/g, '');

    const programmesXml = (schedules || [])
      .map((sch) => {
        const startClean = sch.startTime.replace(':', '');
        const endClean = sch.endTime.replace(':', '');
        const startAttr = `${dateFormatted}${startClean}00 +0700`;
        const endAttr = `${dateFormatted}${endClean}00 +0700`;

        return `  <programme start="${startAttr}" stop="${endAttr}" channel="${channelId}">
    <title lang="id">${sch.programTitle}</title>
    <desc lang="id">Siaran Terjadwal Kategori ${sch.category}. Menggunakan OBS Scene "${sch.obsSceneId || 'Default'}" dan Playlist ID "${sch.playlistId || 'N/A'}".</desc>
    <category lang="id">${sch.category}</category>
    <language>id</language>
  </programme>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE tv SYSTEM "xmltv.dtd">
<tv generator-info-name="MajalengkaPostTV EPG Engine v2.0" generator-info-url="https://majalengkapost.tv">
  <channel id="${channelId}">
    <display-name>${channelName}</display-name>
    <icon src="https://majalengkapost.tv/logo.png" />
  </channel>
${programmesXml}
</tv>`;
  };

  // JSON EPG Generator
  const generateJsonEpg = () => {
    return JSON.stringify(
      {
        channel: {
          id: 'mptv-1080p',
          name: 'Majalengka Post TV',
          frequency: 'Ch 42 UHF / Streaming IP',
          date: selectedDate,
          generatedAt: new Date().toISOString(),
        },
        guide: (schedules || []).map((s) => ({
          id: s.id,
          title: s.programTitle,
          category: s.category,
          startTime: s.startTime,
          endTime: s.endTime,
          recurring: s.recurring,
          playlistId: s.playlistId,
          obsSceneId: s.obsSceneId,
          active: s.active,
        })),
      },
      null,
      2
    );
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFeed(type);
    setTimeout(() => setCopiedFeed(null), 2500);
  };

  const handleDownloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5 text-white">
      {/* Top Header & Live Broadcast Telemetry */}
      <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-red-600/20 text-[#D50000] rounded-lg border border-red-600/30">
              <Tv className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider flex items-center gap-2 text-white">
                ELECTRONIC PROGRAM GUIDE (EPG)
              </h1>
              <p className="text-xs text-zinc-400 mt-0.5">
                Panduan Jadwal Siaran Otomatis TV Digital & Feed XMLTV / JSON Interaktif
              </p>
            </div>
          </div>
        </div>

        {/* Live Station Time & EPG Export Quick Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Studio Clock Widget */}
          <div className="bg-zinc-900 border border-zinc-800 px-3.5 py-1.5 rounded-lg flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-[#D50000] animate-spin-slow" />
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 block font-mono uppercase tracking-wider">
                JAM SIARAN STUDIO
              </span>
              <span className="text-sm font-extrabold font-mono text-white tracking-widest">
                {getCurrentTimeString()} WIB
              </span>
            </div>
          </div>

          {/* Export XMLTV */}
          <button
            onClick={() => setShowXmlModal(true)}
            className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold px-3 py-2 rounded-lg text-xs transition active:scale-95"
          >
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>EXPORT XMLTV</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={() => setShowJsonModal(true)}
            className="flex items-center space-x-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold px-3 py-2 rounded-lg text-xs transition active:scale-95"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>EXPORT JSON</span>
          </button>

          {/* Print Schedule */}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold px-3 py-2 rounded-lg text-xs transition active:scale-95"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>CETAK EPG</span>
          </button>
        </div>
      </div>

      {/* Broadcast Live Status Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Currently Airing Card */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-red-900/40 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center space-x-1.5 text-xs font-black uppercase text-red-500 tracking-wider">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>SEDANG SIARAN (ON AIR)</span>
            </span>
            <span className="bg-red-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
              LIVE
            </span>
          </div>

          {currentlyAiring ? (
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-white line-clamp-1">
                {currentlyAiring.programTitle}
              </h3>
              <div className="flex items-center text-xs text-zinc-400 space-x-2 font-mono">
                <Clock className="w-3.5 h-3.5 text-red-400" />
                <span>
                  {currentlyAiring.startTime} - {currentlyAiring.endTime} WIB
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-300 font-sans">
                  {currentlyAiring.category}
                </span>
              </div>

              {/* Progress bar */}
              <div className="pt-1">
                <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono">
                  <span>Progres Durasi Siaran</span>
                  <span>{getAiringProgress(currentlyAiring)}%</span>
                </div>
                <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className="bg-gradient-to-r from-red-600 to-amber-500 h-full transition-all duration-500"
                    style={{ width: `${getAiringProgress(currentlyAiring)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 font-mono">
                <span>OBS Scene: <strong className="text-white">{currentlyAiring.obsSceneId || 'Default'}</strong></span>
                <button
                  onClick={() => currentlyAiring.obsSceneId && changeScene(currentlyAiring.obsSceneId)}
                  className="text-red-400 hover:text-red-300 underline font-bold"
                >
                  Switch Scene
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic py-2">Tidak ada siaran aktif saat ini.</p>
          )}
        </div>

        {/* Up Next Program Card */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center space-x-1.5 text-xs font-black uppercase text-amber-400 tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>PROGRAM SEGERA HADIR (UP NEXT)</span>
            </span>
            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
              NEXT
            </span>
          </div>

          {upNextItem ? (
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-white line-clamp-1">
                {upNextItem.programTitle}
              </h3>
              <div className="flex items-center text-xs text-zinc-400 space-x-2 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {upNextItem.startTime} - {upNextItem.endTime} WIB
                </span>
                <span className="bg-zinc-800 px-2 py-0.5 rounded text-[10px] text-zinc-300 font-sans">
                  {upNextItem.category}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-1 font-mono pt-1">
                Playlist Terhubung: {(playlists || []).find((p) => p.id === upNextItem.playlistId)?.name || 'Default Playlist'}
              </p>
            </div>
          ) : (
            <p className="text-xs text-zinc-500 italic py-2">Tidak ada siaran berikutnya terjadwal.</p>
          )}
        </div>

        {/* EPG Summary Metrics */}
        <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">RINGKASAN EPG HARI INI</span>
            <span className="text-xs font-mono text-zinc-500">{selectedDate}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-center">
            <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-mono">TOTAL PROGRAM</span>
              <span className="text-lg font-black text-white font-mono">{filteredSchedules.length}</span>
            </div>
            <div className="bg-zinc-900 p-2 rounded border border-zinc-800">
              <span className="text-[10px] text-zinc-400 block font-mono">KATEGORI AKTIF</span>
              <span className="text-lg font-black text-cyan-400 font-mono">
                {new Set(filteredSchedules.map((s) => s.category)).size}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Category Filters, Date Switcher, View Mode */}
      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 shadow-lg space-y-3">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama program TV, acara, atau kategori..."
              className="w-full bg-zinc-900 border border-zinc-800 pl-9 pr-4 py-2 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 transition"
            />
          </div>

          {/* Date Selector Pills */}
          <div className="flex items-center space-x-2 text-xs font-mono">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-white focus:outline-none focus:border-red-600"
            />
            <button
              onClick={() => setSelectedDate('2026-07-25')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedDate === '2026-07-25' ? 'bg-[#D50000] text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              HARI INI
            </button>
            <button
              onClick={() => setSelectedDate('2026-07-26')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                selectedDate === '2026-07-26' ? 'bg-[#D50000] text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
              BESOK
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800 self-start lg:self-auto">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
                viewMode === 'table' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>TABEL FORMATTED</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
                viewMode === 'grid' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>TIMELINE GRID</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 custom-scrollbar">
          <Filter className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider shrink-0 mr-1">
            Kategori:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-white text-black font-bold shadow'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN EPG VIEW CONTENT */}
      {viewMode === 'table' ? (
        /* Formatted EPG Table */
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Table className="w-4 h-4 text-[#D50000]" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                TABEL JADWAL PANDUAN SIARAN DIGITALLY FORMATTED ({filteredSchedules.length} ACARA)
              </h2>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">Channel: Majalengka Post TV HD</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="p-3.5 w-36">JAM SIARAN</th>
                  <th className="p-3.5 w-32">STATUS SIARAN</th>
                  <th className="p-3.5">NAMA PROGRAM TV & KATEGORI</th>
                  <th className="p-3.5">PLAYLIST & SCENE OBS</th>
                  <th className="p-3.5 w-32">FREKUENSI</th>
                  <th className="p-3.5 text-right w-36">AKSI STUDIO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {filteredSchedules.length > 0 ? (
                  filteredSchedules.map((sch) => {
                    const statusInfo = getScheduleStatus(sch);
                    const matchedPlaylist = (playlists || []).find((p) => p.id === sch.playlistId);
                    const matchedScene = (scenes || []).find((s) => s.id === sch.obsSceneId || s.name === sch.obsSceneId);

                    return (
                      <tr
                        key={sch.id}
                        className={`hover:bg-zinc-900/60 transition ${
                          statusInfo.type === 'live' ? 'bg-red-950/20 border-l-4 border-l-red-600' : ''
                        }`}
                      >
                        {/* Time Slot */}
                        <td className="p-3.5 font-mono whitespace-nowrap">
                          <div className="flex items-center space-x-1.5 font-extrabold text-white text-xs">
                            <Clock className="w-3.5 h-3.5 text-[#D50000]" />
                            <span>
                              {sch.startTime} - {sch.endTime}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500 block mt-0.5 font-mono">WIB (24 Jam)</span>
                        </td>

                        {/* Status Badge */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] font-extrabold tracking-wide uppercase ${statusInfo.color}`}
                          >
                            {statusInfo.type === 'live' && <span className="w-2 h-2 rounded-full bg-white animate-ping mr-1" />}
                            <span>{statusInfo.label}</span>
                          </span>
                        </td>

                        {/* Program Title & Category */}
                        <td className="p-3.5">
                          <div className="flex items-start space-x-2.5">
                            <div className="bg-zinc-900 p-2 rounded-lg border border-zinc-800 shrink-0">
                              <Tv className="w-4 h-4 text-zinc-300" />
                            </div>
                            <div>
                              <p className="font-extrabold text-white text-sm hover:text-red-400 transition cursor-pointer">
                                {sch.programTitle}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded text-[10px] font-semibold border border-zinc-700">
                                  {sch.category}
                                </span>
                                {sch.active ? (
                                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Auto-Switch Active
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-zinc-500 font-mono">Nonaktif</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Playlist & Scene OBS */}
                        <td className="p-3.5">
                          <div className="space-y-1 font-mono text-[11px]">
                            <div className="flex items-center space-x-1.5 text-zinc-300">
                              <ListMusic className="w-3.5 h-3.5 text-red-500" />
                              <span className="truncate max-w-[200px]">
                                {matchedPlaylist ? matchedPlaylist.name : sch.playlistId || 'Default'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1.5 text-zinc-400">
                              <Layers className="w-3.5 h-3.5 text-amber-500" />
                              <span className="truncate max-w-[200px]">
                                Scene: {matchedScene ? matchedScene.name : sch.obsSceneId || 'Default Scene'}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Recurring */}
                        <td className="p-3.5 whitespace-nowrap font-mono text-xs">
                          <span className="bg-zinc-900 text-zinc-300 px-2 py-1 rounded border border-zinc-800">
                            {sch.recurring || 'Daily'}
                          </span>
                        </td>

                        {/* Studio Action Buttons */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setPreviewSchedule(sch)}
                              className="p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 rounded text-[10px] font-bold transition"
                              title="Lihat Detail Program"
                            >
                              <Info className="w-3.5 h-3.5 text-cyan-400" />
                            </button>
                            <button
                              onClick={() => sch.obsSceneId && changeScene(sch.obsSceneId)}
                              className="px-2.5 py-1.5 bg-[#D50000] hover:bg-red-700 text-white rounded text-[10px] font-extrabold transition active:scale-95 flex items-center space-x-1"
                              title="Pindah Scene OBS Sekarang"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>SWITCH</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-zinc-500 italic">
                      Tidak ada program siaran TV ditemukan sesuai filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Timeline Visual Grid View */
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
              <LayoutGrid className="w-4 h-4 text-[#D50000]" />
              <span>TIMELINE GRID 24 JAM HARI INI ({selectedDate})</span>
            </h2>
            <div className="flex items-center space-x-3 text-[10px] font-mono text-zinc-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block" /> On Air
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-zinc-800 border border-zinc-700 rounded-full inline-block" /> Terjadwal
              </span>
            </div>
          </div>

          {/* Time Hours Banner header */}
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px]">
              {/* Hours Bar */}
              <div className="grid grid-cols-24 border-b border-zinc-800 pb-2 text-[10px] font-mono text-zinc-400">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="text-center border-r border-zinc-900">
                    {String(i).padStart(2, '0')}:00
                  </div>
                ))}
              </div>

              {/* Schedules Rows */}
              <div className="space-y-3 pt-3">
                {filteredSchedules.map((sch) => {
                  const startMins = parseMinutes(sch.startTime);
                  const endMins = parseMinutes(sch.endTime);
                  const durationMins = Math.max(30, endMins - startMins);

                  const leftPct = (startMins / (24 * 60)) * 100;
                  const widthPct = (durationMins / (24 * 60)) * 100;
                  const status = getScheduleStatus(sch);

                  return (
                    <div key={sch.id} className="relative h-14 bg-zinc-900/50 rounded-lg border border-zinc-800/80">
                      {/* Program Block */}
                      <div
                        style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                        className={`absolute top-1 bottom-1 rounded-md px-3 py-1.5 flex flex-col justify-between overflow-hidden cursor-pointer transition hover:ring-2 hover:ring-white/50 ${
                          status.type === 'live'
                            ? 'bg-gradient-to-r from-red-600 to-red-800 text-white shadow-lg shadow-red-950/80'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
                        }`}
                        onClick={() => setPreviewSchedule(sch)}
                      >
                        <div className="flex justify-between items-center text-[10px] font-extrabold truncate">
                          <span className="truncate">{sch.programTitle}</span>
                          {status.type === 'live' && (
                            <span className="bg-white text-red-600 text-[9px] px-1 rounded uppercase animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center text-[9px] opacity-80 font-mono">
                          <span>
                            {sch.startTime} - {sch.endTime}
                          </span>
                          <span className="uppercase">{sch.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* XMLTV Export Modal */}
      {showXmlModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-3xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <FileCode className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm text-white uppercase">EXPORT FEED XMLTV EPG</h3>
              </div>
              <button
                onClick={() => setShowXmlModal(false)}
                className="text-zinc-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Format standar XMLTV sesuai spesifikasi sistem TV Digital, IPTV, Cable Box, dan Set-Top Box.
            </p>

            <div className="relative">
              <textarea
                readOnly
                value={generateXmlTv()}
                rows={12}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 font-mono text-[11px] text-emerald-400 focus:outline-none custom-scrollbar"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleCopy(generateXmlTv(), 'xml')}
                className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded text-xs font-bold transition"
              >
                {copiedFeed === 'xml' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFeed === 'xml' ? 'TERSALIN!' : 'SALIN KE CLIPBOARD'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadFile(generateXmlTv(), `epg-schedule-${selectedDate}.xml`, 'application/xml')}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>UNDUH FILE XML</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* JSON EPG Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-3xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-cyan-400" />
                <h3 className="font-extrabold text-sm text-white uppercase">EXPORT JSON EPG FEED</h3>
              </div>
              <button
                onClick={() => setShowJsonModal(false)}
                className="text-zinc-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-400">
              Payload JSON REST API untuk integrasi aplikasi mobile, web portal, dan smart TV apps.
            </p>

            <div className="relative">
              <textarea
                readOnly
                value={generateJsonEpg()}
                rows={12}
                className="w-full bg-zinc-900 border border-zinc-800 rounded p-3 font-mono text-[11px] text-cyan-300 focus:outline-none custom-scrollbar"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handleCopy(generateJsonEpg(), 'json')}
                className="flex items-center space-x-1.5 px-3 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-white rounded text-xs font-bold transition"
              >
                {copiedFeed === 'json' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedFeed === 'json' ? 'TERSALIN!' : 'SALIN KE CLIPBOARD'}</span>
              </button>

              <button
                onClick={() => handleDownloadFile(generateJsonEpg(), `epg-schedule-${selectedDate}.json`, 'application/json')}
                className="flex items-center space-x-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded text-xs font-bold transition active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>UNDUH FILE JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Program Detail Preview Modal */}
      {previewSchedule && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
              <div>
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {previewSchedule.category}
                </span>
                <h3 className="font-black text-lg text-white mt-1">{previewSchedule.programTitle}</h3>
              </div>
              <button
                onClick={() => setPreviewSchedule(null)}
                className="text-zinc-400 hover:text-white font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="bg-zinc-900 p-3 rounded border border-zinc-800 space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-400">WAKTU SIARAN:</span>
                  <span className="text-white font-bold">{previewSchedule.startTime} - {previewSchedule.endTime} WIB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">TANGGAL:</span>
                  <span className="text-white font-bold">{previewSchedule.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">FREKUENSI:</span>
                  <span className="text-white font-bold">{previewSchedule.recurring}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">OBS SCENE:</span>
                  <span className="text-amber-400 font-bold">{previewSchedule.obsSceneId || 'Default'}</span>
                </div>
              </div>

              {/* Playlist details */}
              <div className="space-y-1.5">
                <span className="font-bold text-white block">PLAYLIST TERHUBUNG:</span>
                {(() => {
                  const pl = (playlists || []).find((p) => p.id === previewSchedule.playlistId);
                  if (!pl) return <p className="text-zinc-500 italic">Playlist standar studio.</p>;
                  return (
                    <div className="bg-zinc-900 p-3 rounded border border-zinc-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-red-400">{pl.name}</span>
                        <span className="text-[10px] font-mono text-zinc-400">{pl.items?.length || 0} Video Items</span>
                      </div>
                      <div className="divide-y divide-zinc-800/60 max-h-40 overflow-y-auto custom-scrollbar pr-1">
                        {pl.items?.map((item, idx) => {
                          const v = (videos || []).find((vid) => vid.id === item.videoId);
                          return (
                            <div key={item.id} className="py-1.5 flex items-center justify-between text-[11px]">
                              <span className="truncate max-w-[250px] text-zinc-300">
                                {idx + 1}. {v ? v.title : item.videoId}
                              </span>
                              <span className="font-mono text-zinc-500 text-[10px]">
                                {v ? `${Math.floor(v.durationSeconds / 60)}m` : ''}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-zinc-800">
              <button
                onClick={() => setPreviewSchedule(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded text-xs font-bold transition"
              >
                TUTUP
              </button>
              <button
                onClick={() => {
                  if (previewSchedule.obsSceneId) changeScene(previewSchedule.obsSceneId);
                  setPreviewSchedule(null);
                }}
                className="px-4 py-2 bg-[#D50000] hover:bg-red-700 text-white rounded text-xs font-bold transition flex items-center space-x-1"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>SWITCH SCENE SEKARANG</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
