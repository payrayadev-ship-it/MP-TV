import React, { useState } from 'react';
import { Youtube, ThumbsUp, Users, MessageSquare, Send, Shield, Radio, Play, Square } from 'lucide-react';
import { useBroadcast } from '../context/BroadcastContext';

export const YouTubeLiveView: React.FC = () => {
  const { youtubeStatus, obsSettings, toggleStream } = useBroadcast();
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput || !youtubeStatus) return;

    youtubeStatus.chatMessages.push({
      id: `c-${Date.now()}`,
      author: 'Studio_Control_Room',
      message: chatInput,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isModerator: true,
    });

    setChatInput('');
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2 text-red-500">
            <Youtube className="w-5 h-5 fill-current" />
            <span>YOUTUBE DATA API V3 CONTROL ROOM</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Monitoring Penonton Live, Chat Interaktif, Likes & Status Stream YouTube
          </p>
        </div>

        {obsSettings?.isStreaming ? (
          <button
            onClick={() => toggleStream(false)}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs"
          >
            <Square className="w-4 h-4 fill-current" />
            <span>STOP YOUTUBE LIVE</span>
          </button>
        ) : (
          <button
            onClick={() => toggleStream(true)}
            className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>MULAI YOUTUBE LIVE</span>
          </button>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-zinc-400 text-xs font-bold uppercase">Live Viewers</span>
            <p className="text-2xl font-extrabold text-red-500 mt-1 font-mono">
              {youtubeStatus?.viewers.toLocaleString()}
            </p>
          </div>
          <Users className="w-8 h-8 text-red-500/80" />
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-zinc-400 text-xs font-bold uppercase">Total Likes</span>
            <p className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
              {youtubeStatus?.likes.toLocaleString()}
            </p>
          </div>
          <ThumbsUp className="w-8 h-8 text-amber-400/80" />
        </div>

        <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-zinc-400 text-xs font-bold uppercase">Status Siaran</span>
            <p className="text-lg font-bold text-emerald-400 mt-1">
              {youtubeStatus?.isLive ? '🔴 LIVE BROADCASTING' : 'OFFLINE'}
            </p>
          </div>
          <Radio className="w-8 h-8 text-emerald-400/80 animate-pulse" />
        </div>
      </div>

      {/* Grid: Live Preview & Chat Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Stream Title & Player */}
        <div className="lg:col-span-2 space-y-3">
          <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl space-y-3">
            <h2 className="font-extrabold text-sm text-white line-clamp-1">{youtubeStatus?.title}</h2>
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative border border-zinc-800">
              <video
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                loop
                muted
                autoPlay
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-red-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded tracking-widest uppercase">
                YOUTUBE LIVE PLAYER
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat Stream */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between h-[480px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
              <h3 className="text-xs font-bold uppercase text-zinc-300 flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-red-500" />
                <span>Live Chat Youtube ({youtubeStatus?.chatMessages.length})</span>
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">Mod Mode Active</span>
            </div>

            {/* Messages Scroll Area */}
            <div className="space-y-2.5 overflow-y-auto max-h-[350px] pr-1 custom-scrollbar">
              {youtubeStatus?.chatMessages.map((msg) => (
                <div key={msg.id} className="text-xs space-y-0.5 bg-zinc-900/60 p-2 rounded border border-zinc-800/80">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-bold flex items-center space-x-1 ${
                        msg.isModerator ? 'text-amber-400' : 'text-zinc-300'
                      }`}
                    >
                      {msg.isModerator && <Shield className="w-3 h-3 text-amber-400 shrink-0" />}
                      <span>{msg.author}</span>
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">{msg.timestamp}</span>
                  </div>
                  <p className="text-zinc-200">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Send Chat as Moderator */}
          <form onSubmit={handleSendChat} className="flex items-center space-x-2 pt-3 border-t border-zinc-800">
            <input
              type="text"
              placeholder="Balas chat sebagai Moderator Studio..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded text-xs text-white focus:outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="p-1.5 bg-[#D50000] hover:bg-red-700 text-white rounded transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
