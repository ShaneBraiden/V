/** @fileoverview Flashcards page - spaced repetition flashcards with tech filter */
import { useState, useEffect, useCallback } from 'react';
import { getFlashcards, updateFlashcardProgress } from '../api/progress';
import { addXP } from '../api/progress';
import useAppStore from '../store/useAppStore';
import FlashCard from '../components/flashcards/FlashCard';
import CardControls from '../components/flashcards/CardControls';
import TechFilter from '../components/resources/TechFilter';
import NeonCard from '../components/ui/NeonCard';
import { Layers, Shuffle, RotateCcw } from 'lucide-react';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards() {
  const activeTech = useAppStore((s) => s.activeTech);
  const [techFilter, setTechFilter] = useState(activeTech || 'all');
  const [cards, setCards] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [stats, setStats] = useState({ reviewed: 0, gotIt: 0, learning: 0, hard: 0 });
  const [loading, setLoading] = useState(true);

  const loadCards = useCallback(async (tech) => {
    setLoading(true);
    try {
      const data = await getFlashcards(tech === 'all' ? undefined : tech);
      const fetched = data.flashcards || data || [];
      setCards(shuffleArray(fetched));
      setCurrentIdx(0);
      setStats({ reviewed: 0, gotIt: 0, learning: 0, hard: 0 });
    } catch (e) {
      console.error('Flashcard load error:', e);
      setCards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards(techFilter);
  }, [techFilter, loadCards]);

  const handleResponse = async (response) => {
    const card = cards[currentIdx];
    if (!card) return;

    setStats((prev) => ({
      reviewed: prev.reviewed + 1,
      gotIt: prev.gotIt + (response === 'got-it' ? 1 : 0),
      learning: prev.learning + (response === 'learning' ? 1 : 0),
      hard: prev.hard + (response === 'hard' ? 1 : 0),
    }));

    try {
      if (card._id) {
        await updateFlashcardProgress(card._id, { response });
      }
    } catch (e) { /* silent */ }

    if (currentIdx < cards.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handleShuffle = () => {
    setCards(shuffleArray(cards));
    setCurrentIdx(0);
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setStats({ reviewed: 0, gotIt: 0, learning: 0, hard: 0 });
  };

  const currentCard = cards[currentIdx];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading text-white flex items-center gap-2">
          <Layers className="text-neon-cyan" size={22} /> Flashcards
        </h1>
        <span className="text-sm text-gray-500">{cards.length} cards</span>
      </div>

      <TechFilter value={techFilter} onChange={setTechFilter} />

      {loading ? (
        <NeonCard className="text-center py-16">
          <p className="text-gray-500 animate-pulse">Loading flashcards...</p>
        </NeonCard>
      ) : cards.length === 0 ? (
        <NeonCard className="text-center py-16">
          <Layers size={32} className="mx-auto text-gray-600 mb-3" />
          <p className="text-gray-500 text-sm">No flashcards available for this technology.</p>
          <p className="text-gray-600 text-xs mt-1">Run the seed script to populate flashcards.</p>
        </NeonCard>
      ) : (
        <>
          <FlashCard card={currentCard} onResponse={handleResponse} />
          <CardControls
            current={currentIdx}
            total={cards.length}
            onPrev={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            onNext={() => setCurrentIdx((prev) => Math.min(cards.length - 1, prev + 1))}
            onShuffle={handleShuffle}
            onReset={handleReset}
            stats={stats}
          />
        </>
      )}

      {stats.reviewed > 0 && (
        <NeonCard className="text-center">
          <h3 className="text-sm text-gray-400 mb-2">Session Progress</h3>
          <div className="flex justify-center gap-6 text-sm">
            <div>
              <span className="text-neon-cyan font-mono text-lg">{stats.gotIt}</span>
              <p className="text-xs text-gray-500">Got It</p>
            </div>
            <div>
              <span className="text-gray-400 font-mono text-lg">{stats.learning}</span>
              <p className="text-xs text-gray-500">Learning</p>
            </div>
            <div>
              <span className="text-neon-magenta font-mono text-lg">{stats.hard}</span>
              <p className="text-xs text-gray-500">Hard</p>
            </div>
          </div>
        </NeonCard>
      )}
    </div>
  );
}
