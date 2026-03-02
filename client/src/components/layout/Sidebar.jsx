/** @fileoverview Navigation sidebar with page links, rank display, and collapse toggle */
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useAuthStore from '../../store/useAuthStore';
import useAppStore from '../../store/useAppStore';
import { getRankFromXP, RANK_EMOJIS, getLevelFromXP } from '../../utils/xpCalc';
import {
  LayoutDashboard, Keyboard, Map, BookOpen, Code2, Brain,
  MessageSquare, Calendar, StickyNote, Hammer, Trophy, Settings,
  ChevronLeft, ChevronRight, Zap, GraduationCap,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/typing', label: 'Typing', icon: Keyboard },
  { path: '/roadmap', label: 'Roadmap', icon: Map },
  { path: '/resources', label: 'Resources', icon: BookOpen },
  { path: '/learn', label: 'Learn', icon: GraduationCap },
  { path: '/code', label: 'Code Playground', icon: Code2 },
  { path: '/flashcards', label: 'Flashcards', icon: Brain },
  { path: '/tutor', label: 'AI Tutor', icon: MessageSquare },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/notes', label: 'Notes', icon: StickyNote },
  { path: '/projects', label: 'Mini Projects', icon: Hammer },
  { path: '/achievements', label: 'Achievements', icon: Trophy },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const xp = user?.xp || 0;
  const level = getLevelFromXP(xp);
  const rank = getRankFromXP(xp);
  const emoji = RANK_EMOJIS[level - 1];

  return (
    <aside className={`${sidebarOpen ? 'w-56' : 'w-16'} bg-bg-card border-r border-border-dim flex flex-col transition-all duration-300 h-screen sticky top-0`}>
      {/* Logo */}
      <div className="p-4 flex items-center gap-2 border-b border-border-dim">
        <Zap className="text-neon-cyan w-6 h-6 flex-shrink-0" />
        {sidebarOpen && (
          <span className="font-accent text-neon-cyan font-bold text-lg tracking-wider">V</span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-all duration-200
              ${isActive
                ? 'bg-bg-elevated text-neon-cyan border border-neon-cyan/20 shadow-[0_0_8px_#00F5D420]'
                : 'text-gray-400 hover:text-gray-200 hover:bg-bg-elevated/50'
              }`
            }
            end={path === '/'}
          >
            <Icon size={18} className="flex-shrink-0" />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Rank display */}
      {sidebarOpen && user && (
        <div className="p-4 border-t border-border-dim">
          <div className="text-center">
            <span className="text-xl">{emoji}</span>
            <p className="text-xs text-gray-400 mt-1 font-accent">{rank}</p>
            <p className="text-xs text-neon-gold font-mono mt-0.5">Lvl {level}</p>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={toggleSidebar}
        className="p-3 border-t border-border-dim text-gray-500 hover:text-neon-cyan transition-colors"
      >
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </aside>
  );
}
