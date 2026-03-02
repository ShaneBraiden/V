/** @fileoverview Settings page - profile, tech selector, gate duration, account management */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import useAppStore from '../store/useAppStore';
import { updateProfile, changePassword, deleteAccount } from '../api/auth';
import NeonCard from '../components/ui/NeonCard';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { User, Settings as SettingsIcon, Shield, Info, Bell, Trash2 } from 'lucide-react';

export default function Settings() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const logout = useAuthStore((s) => s.logout);
  const setActiveTech = useAppStore((s) => s.setActiveTech);
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [activeTechId, setActiveTechId] = useState(user?.activeTechId || 'python');
  const [gateDuration, setGateDuration] = useState(user?.gateDurationMinutes || 5);
  const [weeklyHours, setWeeklyHours] = useState(user?.weeklyHourTarget || 3);
  const [reminderEnabled, setReminderEnabled] = useState(user?.reminderEnabled || false);
  const [reminderTime, setReminderTime] = useState(user?.reminderTime || '09:00');
  const [saved, setSaved] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const handleSave = async () => {
    try {
      await updateProfile({ name, activeTechId, gateDurationMinutes: gateDuration, weeklyHourTarget: weeklyHours, reminderEnabled, reminderTime });
      updateUser({ name, activeTechId, gateDurationMinutes: gateDuration, weeklyHourTarget: weeklyHours, reminderEnabled, reminderTime });
      setActiveTech(activeTechId);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPass || !newPass) return;
    try {
      await changePassword(oldPass, newPass);
      setOldPass(''); setNewPass('');
      alert('Password changed');
    } catch (e) {
      alert(e.message || 'Failed');
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm !== 'DELETE') return;
    try {
      await deleteAccount();
      logout();
      navigate('/login');
    } catch (e) {
      alert(e.message || 'Failed');
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-heading text-white flex items-center gap-2">
        <SettingsIcon className="text-neon-cyan" size={22} /> Settings
      </h1>

      {/* Profile */}
      <NeonCard>
        <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2"><User size={16} /> Profile</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-bg-elevated border border-border-dim rounded-lg px-3 py-2 text-white text-sm mt-1 focus:border-neon-cyan focus:outline-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500">Active Technology</label>
            <select value={activeTechId} onChange={(e) => setActiveTechId(e.target.value)}
              className="w-full bg-bg-elevated border border-border-dim rounded-lg px-3 py-2 text-white text-sm mt-1 focus:border-neon-cyan focus:outline-none">
              {TECHNOLOGIES.map((t) => (
                <option key={t.id} value={t.id}>{t.emoji} {t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Gate Duration</label>
            <div className="flex gap-2 mt-1">
              {[1, 2, 3, 5, 10].map((m) => (
                <button key={m} onClick={() => setGateDuration(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs border ${gateDuration === m ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/10' : 'border-border-dim text-gray-500'}`}>
                  {m}m
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500">Weekly Study Target: {weeklyHours}h</label>
            <input type="range" min="1" max="20" value={weeklyHours} onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full accent-neon-cyan mt-1" />
          </div>
        </div>
        <button onClick={handleSave}
          className="mt-4 px-4 py-2 bg-neon-cyan text-bg-primary rounded-lg text-sm font-semibold hover:bg-neon-cyan/90 transition-colors">
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </NeonCard>

      {/* Reminders */}
      <NeonCard>
        <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2"><Bell size={16} /> Study Reminders</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={reminderEnabled} onChange={(e) => setReminderEnabled(e.target.checked)}
              className="accent-neon-cyan" />
            <span className="text-sm text-gray-300">Enable daily reminder</span>
          </label>
          <input type="time" value={reminderTime} onChange={(e) => setReminderTime(e.target.value)}
            className="bg-bg-elevated border border-border-dim rounded px-2 py-1 text-sm text-white" disabled={!reminderEnabled} />
        </div>
      </NeonCard>

      {/* Password */}
      <NeonCard>
        <h3 className="text-sm text-gray-400 mb-3 flex items-center gap-2"><Shield size={16} /> Change Password</h3>
        <div className="flex gap-3">
          <input type="password" placeholder="Old password" value={oldPass} onChange={(e) => setOldPass(e.target.value)}
            className="flex-1 bg-bg-elevated border border-border-dim rounded-lg px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none" />
          <input type="password" placeholder="New password" value={newPass} onChange={(e) => setNewPass(e.target.value)}
            className="flex-1 bg-bg-elevated border border-border-dim rounded-lg px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none" />
          <button onClick={handleChangePassword}
            className="px-4 py-2 border border-border-dim rounded-lg text-sm text-gray-300 hover:border-neon-cyan">Update</button>
        </div>
      </NeonCard>

      {/* Danger Zone */}
      <NeonCard color="pink">
        <h3 className="text-sm text-red-400 mb-3 flex items-center gap-2"><Trash2 size={16} /> Delete Account</h3>
        <p className="text-xs text-gray-500 mb-3">Type DELETE to confirm. This cannot be undone.</p>
        <div className="flex gap-3">
          <input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="Type DELETE"
            className="flex-1 bg-bg-elevated border border-red-500/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none" />
          <button onClick={handleDelete} disabled={deleteConfirm !== 'DELETE'}
            className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-sm disabled:opacity-30">Delete</button>
        </div>
      </NeonCard>

      {/* About */}
      <NeonCard>
        <h3 className="text-sm text-gray-400 mb-2 flex items-center gap-2"><Info size={16} /> About</h3>
        <p className="text-xs text-gray-500">V v1.0 — Velocity-Accelerated NPC Training Architecture</p>
        <p className="text-xs text-gray-600 mt-1">Vite + React 18 | Express.js | MongoDB | Gemini AI | scikit-learn</p>
      </NeonCard>
    </div>
  );
}
