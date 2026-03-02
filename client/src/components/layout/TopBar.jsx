/** @fileoverview Top navigation bar with study timer, XP bar, streak, and user menu */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useTimerStore from '../../store/useTimerStore';
import XPBadge from '../ui/XPBadge';
import StreakBadge from '../ui/StreakBadge';
import Timer from '../ui/Timer';
import { LogOut, User, ChevronDown } from 'lucide-react';

export default function TopBar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const { elapsed, isRunning, start, pause, tick } = useTimerStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Tick the timer every second while running
  useEffect(() => {
    if (!isRunning) return;
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [isRunning, tick]);

  // Auto-start timer on mount
  useEffect(() => {
    if (!isRunning) start();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-bg-card border-b border-border-dim flex items-center justify-between px-4 sticky top-0 z-40">
      {/* Study timer */}
      <Timer
        seconds={elapsed}
        isRunning={isRunning}
        onToggle={() => isRunning ? pause() : start()}
        label="Study"
      />

      {/* XP Bar - center */}
      <div className="flex-1 max-w-md mx-6">
        {user && <XPBadge xp={user.xp || 0} />}
      </div>

      {/* Right side: streak + user menu */}
      <div className="flex items-center gap-4">
        {user && <StreakBadge count={user.streak?.count || 0} type={user.streak?.type} compact />}

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-bg-elevated transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-neon-purple/20 flex items-center justify-center">
              <User size={14} className="text-neon-purple" />
            </div>
            {user && <span className="text-sm text-gray-300 hidden sm:inline">{user.name}</span>}
            <ChevronDown size={14} className="text-gray-500" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-bg-elevated border border-border-dim rounded-lg shadow-xl py-1 z-50">
              <button
                onClick={() => { navigate('/settings'); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-bg-card transition-colors"
              >
                <User size={14} /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-bg-card transition-colors"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
