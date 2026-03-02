/** @fileoverview Resources page - curated + user resources, filterable with search */
import { useState, useMemo } from 'react';
import NeonCard from '../components/ui/NeonCard';
import TechFilter from '../components/resources/TechFilter';
import ResourceCard from '../components/resources/ResourceCard';
import { TECHNOLOGIES } from '../utils/typingGeminiPrompt';
import { BookOpen, Plus, Search } from 'lucide-react';

/** Flatten all curated resources from TECHNOLOGIES into ResourceCard-compatible objects */
const CURATED = TECHNOLOGIES.flatMap((tech) =>
  (tech.resources || []).map((r, i) => ({
    id: `curated-${tech.id}-${i}`,
    title: r.title,
    type: r.type,
    techId: tech.id,
    url: r.url,
    description: '',
    completed: false,
    curated: true,
  }))
);

const TYPES = ['all', 'docs', 'video', 'course', 'book', 'article'];

export default function Resources() {
  const [userResources, setUserResources] = useState([]);
  const [completed, setCompleted] = useState({});
  const [techFilter, setTechFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newRes, setNewRes] = useState({ title: '', type: 'video', techId: 'python', url: '', description: '' });

  const handleAdd = () => {
    if (!newRes.title || !newRes.url) return;
    setUserResources([{ ...newRes, id: Date.now(), curated: false }, ...userResources]);
    setNewRes({ title: '', type: 'video', techId: 'python', url: '', description: '' });
    setShowAdd(false);
  };

  const toggleComplete = (id) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allResources = useMemo(() => [
    ...userResources,
    ...CURATED,
  ], [userResources]);

  const filtered = allResources.filter((r) => {
    if (techFilter !== 'all' && r.techId !== techFilter) return false;
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tech = TECHNOLOGIES.find((t) => t.id === techFilter);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-heading text-white flex items-center gap-2">
            <BookOpen className="text-neon-cyan" size={22} /> Resources
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">{CURATED.length} curated resources across {TECHNOLOGIES.length} technologies</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-3 py-1.5 bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 rounded-lg text-sm flex items-center gap-1"
        >
          <Plus size={14} /> Add Resource
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <TechFilter value={techFilter === 'all' ? '' : techFilter} onChange={(v) => setTechFilter(v || 'all')} />
        <div className="flex gap-1 bg-bg-card rounded-lg p-1 border border-border-dim flex-wrap">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-2 py-1 rounded text-xs capitalize ${typeFilter === t ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500'}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..."
            className="w-full bg-bg-card border border-border-dim rounded-lg pl-8 pr-3 py-1.5 text-sm text-white focus:border-neon-cyan focus:outline-none" />
        </div>
      </div>

      {/* Active tech banner */}
      {tech && (
        <div className="flex items-center gap-2 px-3 py-2 bg-bg-card rounded-lg border border-border-dim text-sm text-gray-300">
          <span className="text-lg">{tech.emoji}</span>
          <span>Showing resources for <span className="text-neon-cyan font-semibold">{tech.name}</span></span>
          <span className="ml-auto text-gray-500 text-xs">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <NeonCard className="space-y-3">
          <p className="text-sm text-gray-300 font-semibold">Add a Resource</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <input value={newRes.title} onChange={(e) => setNewRes({ ...newRes, title: e.target.value })} placeholder="Title"
              className="w-full bg-bg-elevated border border-border-dim rounded-lg px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none" />
            <input value={newRes.url} onChange={(e) => setNewRes({ ...newRes, url: e.target.value })} placeholder="URL"
              className="w-full bg-bg-elevated border border-border-dim rounded-lg px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none" />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <select value={newRes.type} onChange={(e) => setNewRes({ ...newRes, type: e.target.value })}
              className="bg-bg-elevated border border-border-dim rounded-lg px-3 py-2 text-sm text-gray-200 focus:border-neon-cyan focus:outline-none">
              {['video', 'docs', 'course', 'book', 'article'].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <TechFilter value={newRes.techId} onChange={(v) => setNewRes({ ...newRes, techId: v })} includeAll={false} />
          </div>
          <textarea value={newRes.description} onChange={(e) => setNewRes({ ...newRes, description: e.target.value })} placeholder="Description (optional)" rows={2}
            className="w-full bg-bg-elevated border border-border-dim rounded-lg px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none resize-none" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-neon-cyan text-bg-primary rounded-lg text-sm font-semibold">Add</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-400 text-sm">Cancel</button>
          </div>
        </NeonCard>
      )}

      {/* Resource grid */}
      {filtered.length === 0 ? (
        <NeonCard className="text-center py-12">
          <BookOpen size={32} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">No resources match your filters.</p>
        </NeonCard>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {filtered.map((r) => (
            <ResourceCard
              key={r.id}
              resource={{ ...r, completed: !!completed[r.id] }}
              onToggleComplete={() => toggleComplete(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
