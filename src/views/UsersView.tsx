import React, { useState } from 'react';
import { Users, Plus, Shield, CheckCircle2, UserCheck, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const UsersView: React.FC = () => {
  const { users, currentUser } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Operator');

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, role }),
    });

    setName('');
    setEmail('');
    setShowAddModal(false);
    window.location.reload();
  };

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'Super Admin':
        return 'bg-red-950 text-red-400 border-red-700';
      case 'Admin TV':
        return 'bg-amber-950 text-amber-400 border-amber-700';
      case 'Editor':
        return 'bg-blue-950 text-blue-400 border-blue-700';
      case 'Reporter':
        return 'bg-purple-950 text-purple-400 border-purple-700';
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    }
  };

  return (
    <div className="p-4 max-w-[1700px] mx-auto space-y-5 text-white">
      {/* Header */}
      <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-800">
        <div>
          <h1 className="text-xl font-extrabold uppercase tracking-wider flex items-center space-x-2">
            <Users className="w-5 h-5 text-[#D50000]" />
            <span>ROLE-BASED ACCESS CONTROL (RBAC) USERS MANAGER</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Pengelolaan Pengguna Sistem Siaran: Super Admin, Admin TV, Editor, Reporter, Operator
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-[#D50000] hover:bg-red-700 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-lg shadow-red-950/60 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>TAMBAH KRU TV BARU</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900 border-b border-zinc-800 text-zinc-400 uppercase font-bold text-[10px]">
            <tr>
              <th className="p-3">Nama Kru TV</th>
              <th className="p-3">Email Pengguna</th>
              <th className="p-3">Role Akses</th>
              <th className="p-3">Aktivitas Terakhir</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {(users || []).map((u) => (
              <tr key={u.id} className="hover:bg-zinc-900/40 transition">
                <td className="p-3 font-bold text-white flex items-center space-x-3">
                  <img
                    src={u.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={u.name}
                    className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                  />
                  <span>{u.name}</span>
                </td>
                <td className="p-3 font-mono text-zinc-400">{u.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border ${getRoleBadge(
                      u.role
                    )}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3 font-mono text-zinc-400">{u.lastActive || 'Baru saja'}</td>
                <td className="p-3">
                  <span className="flex items-center space-x-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aktif</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-xl p-5 space-y-4 shadow-2xl">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Tambah Pengguna Kru TV Baru
            </h2>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 font-bold block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="misal: Rudi Hartono"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Email Resmi</label>
                <input
                  type="email"
                  required
                  placeholder="rudi@majalengkapost.tv"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 font-bold block mb-1">Role & Hak Akses</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-zinc-900 border border-zinc-800 p-2.5 rounded text-white focus:outline-none"
                >
                  <option value="Super Admin">Super Admin (Akses Penuh)</option>
                  <option value="Admin TV">Admin TV (OBS & Playlist Control)</option>
                  <option value="Editor">Editor (Video & News Content)</option>
                  <option value="Reporter">Reporter (Breaking News & Live Report)</option>
                  <option value="Operator">Operator (OBS Switcher Only)</option>
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
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
