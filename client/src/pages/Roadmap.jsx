/** @fileoverview Roadmap page - 3 technology layers with progress tracking */
import { useState, useEffect } from 'react';
import useAppStore from '../store/useAppStore';
import useAuthStore from '../store/useAuthStore';
import { getProgress, updateProgress } from '../api/progress';
import { updateProfile } from '../api/auth';
import LayerSection from '../components/roadmap/LayerSection';
import TechCard from '../components/roadmap/TechCard';
import NeonCard from '../components/ui/NeonCard';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { Map, Filter } from 'lucide-react';

const LAYERS = [
  { id: 1, name: 'Game Dev', color: 'cyan', techs: TECHNOLOGIES.filter(t => t.layer === 1) },
  { id: 2, name: 'AI Brain', color: 'purple', techs: TECHNOLOGIES.filter(t => t.layer === 2) },
  { id: 3, name: 'Federation', color: 'gold', techs: TECHNOLOGIES.filter(t => t.layer === 3) },
];

export default function Roadmap() {
  const [progress, setProgress] = useState({});
  const [filter, setFilter] = useState('all');
  const { activeTech, setActiveTech } = useAppStore();
  const updateUser = useAuthStore((s) => s.updateUser);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProgress();
        setProgress(data.techProgress || {});
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  const handleSetActive = async (techId) => {
    setActiveTech(techId);
    try {
      await updateProfile({ activeTechId: techId });
      updateUser({ activeTechId: techId });
    } catch (e) { console.error(e); }
  };

  const completedCount = Object.values(progress).filter(p => p?.status === 'complete').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-white flex items-center gap-2">
          <Map className="text-neon-cyan" size={22} /> Technology Roadmap
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-neon-gold font-mono">{completedCount}/10</span>
          <div className="flex gap-1 bg-bg-card rounded-lg p-1 border border-border-dim">
            {['all', 'in-progress', 'complete', 'not-started'].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-2 py-1 rounded text-xs capitalize ${filter === f ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {LAYERS.map((layer) => (
        <LayerSection key={layer.id} layer={layer.id} title={layer.name}>
          {layer.techs
            .filter((t) => {
              const p = progress[t.id];
              if (filter === 'all') return true;
              if (filter === 'not-started') return !p || p.status === 'not-started';
              return p?.status === filter;
            })
            .map((tech) => (
              <TechCard
                key={tech.id}
                tech={tech}
                progress={progress[tech.id]}
                isActive={activeTech === tech.id}
                onSetActive={() => handleSetActive(tech.id)}
              />
            ))}
        </LayerSection>
      ))}
    </div>
  );
}
