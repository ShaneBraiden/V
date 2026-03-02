/** @fileoverview Interactive lesson drill view — wraps TypingEngine for a specific lesson */
import { useCallback, useState } from 'react';
import TypingEngine from './TypingEngine';
import NeonCard from '../ui/NeonCard';
import { ArrowLeft, ChevronRight, Target, Trophy, Zap } from 'lucide-react';
import { saveSession } from '../../api/typing';
import { addXP } from '../../api/progress';
import { getTodayString } from '../../utils/dateUtils';

const LESSON_DURATION = 300; // 5 min ceiling; lesson ends when text is completed

export default function LessonDrill({ level, lesson, lessonIndex, onBack, onNext, hasNext }) {
    const [xpAwarded, setXpAwarded] = useState(false);
    const [done, setDone] = useState(false);
    const [result, setResult] = useState(null);

    const levelColor = {
        1: 'text-neon-cyan  border-neon-cyan/40',
        2: 'text-neon-cyan  border-neon-cyan/40',
        3: 'text-neon-blue  border-neon-blue/40',
        4: 'text-neon-blue  border-neon-blue/40',
        5: 'text-neon-gold  border-neon-gold/40',
        6: 'text-neon-gold  border-neon-gold/40',
        7: 'text-neon-purple border-neon-purple/40',
        8: 'text-neon-purple border-neon-purple/40',
    }[level.id?.replace('L', '')] || 'text-neon-cyan border-neon-cyan/40';

    const handleComplete = useCallback(async (data) => {
        setResult(data);
        setDone(true);
        if (!xpAwarded) {
            setXpAwarded(true);
            try {
                await saveSession({
                    date: getTodayString(),
                    mode: 'lesson',
                    durationSecs: data.durationSecs,
                    wpm: data.wpm,
                    accuracy: data.accuracy,
                    isGate: false,
                    wasSkipped: false,
                    keypresses: data.keypresses,
                    backspaces: data.backspaces,
                });
                await addXP('lesson_complete', 75);
            } catch (e) {
                console.error('Lesson save error:', e);
            }
        }
    }, [xpAwarded]);

    const isPass = result && result.wpm >= level.wpmTarget;

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="p-1.5 rounded-lg border border-border-dim text-gray-400 hover:text-neon-cyan hover:border-neon-cyan/40 transition-colors"
                >
                    <ArrowLeft size={16} />
                </button>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{level.name}</span>
                    <ChevronRight size={14} className="text-gray-600" />
                    <span className="text-white font-semibold">{lesson.title}</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded border font-mono ${levelColor}`}>
                        <Target size={10} className="inline mr-1" />
                        {level.wpmTarget} WPM target
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded border border-neon-gold/40 text-neon-gold font-mono">
                        <Zap size={10} className="inline mr-1" />+75 XP
                    </span>
                </div>
            </div>

            {/* Lesson info bar */}
            <NeonCard className="flex items-center justify-between py-2 px-4">
                <div>
                    <p className="text-xs text-gray-500 mb-0.5">Focus keys</p>
                    <p className="font-mono text-sm text-neon-cyan tracking-widest">{level.keys}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-gray-500 mb-0.5">Lesson {lessonIndex + 1} of {level.lessons.length}</p>
                    <div className="flex gap-1">
                        {level.lessons.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 w-6 rounded-full transition-colors ${i < lessonIndex ? 'bg-neon-cyan' : i === lessonIndex ? 'bg-neon-cyan/60' : 'bg-bg-elevated'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </NeonCard>

            {/* Result overlay (shown only after done) */}
            {done && result ? (
                <NeonCard className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Trophy size={24} className={isPass ? 'text-neon-gold' : 'text-gray-500'} />
                        <div>
                            <h3 className="font-heading text-white font-bold">
                                {isPass ? 'Lesson Complete!' : 'Keep Practising!'}
                            </h3>
                            <p className="text-xs text-gray-500">
                                {isPass
                                    ? `You hit ${result.wpm} WPM — above the ${level.wpmTarget} WPM target.`
                                    : `You got ${result.wpm} WPM. Target is ${level.wpmTarget} WPM.`}
                            </p>
                        </div>
                        <span className="ml-auto text-neon-gold font-mono text-sm font-bold">+75 XP</span>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'WPM', value: result.wpm, color: 'text-neon-cyan' },
                            { label: 'Accuracy', value: `${result.accuracy}%`, color: 'text-neon-gold' },
                            { label: 'Errors', value: result.errors ?? 0, color: 'text-neon-magenta' },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="bg-bg-elevated rounded-lg p-3 text-center">
                                <p className={`text-xl font-mono font-bold ${color}`}>{value}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        {hasNext && (
                            <button
                                onClick={onNext}
                                className="flex-1 py-2.5 bg-neon-cyan text-bg-primary rounded-lg text-sm font-bold hover:bg-neon-cyan/90 transition-colors"
                            >
                                Next Lesson →
                            </button>
                        )}
                        <button
                            onClick={onBack}
                            className={`${hasNext ? '' : 'flex-1'} py-2.5 px-4 border border-border-dim text-gray-300 rounded-lg text-sm hover:border-neon-cyan hover:text-neon-cyan transition-colors`}
                        >
                            {hasNext ? 'Back to Lessons' : '← Back to Lessons'}
                        </button>
                    </div>
                </NeonCard>
            ) : (
                /* Typing engine */
                <TypingEngine
                    text={lesson.text}
                    duration={LESSON_DURATION}
                    mode="lesson"
                    onSessionComplete={handleComplete}
                />
            )}
        </div>
    );
}
