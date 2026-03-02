/** @fileoverview Python learning hub — topic grid with progress tracking */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProgress } from '../api/progress';
import { PYTHON_TOPICS, TOPIC_COLOR_CLASSES } from '../utils/pythonCurriculum';
import NeonCard from '../components/ui/NeonCard';
import { BookOpen, CheckCircle, Lock, ChevronRight, Zap } from 'lucide-react';

function ProgressRing({ pct = 0, color = '#00F5D4', size = 48 }) {
    const r = (size - 6) / 2;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1E293B" strokeWidth={5} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={5}
                strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 0.6s ease' }} />
        </svg>
    );
}

export default function PythonLearn() {
    const navigate = useNavigate();
    const [completed, setCompleted] = useState({});

    useEffect(() => {
        getProgress().then(p => {
            const lp = p?.lessonProgress || {};
            setCompleted(lp);
        }).catch(() => { });
    }, []);

    const totalXP = PYTHON_TOPICS.reduce((s, t) => s + t.xp, 0);
    const earnedXP = PYTHON_TOPICS.filter(t => completed[`python-${t.id}`]).reduce((s, t) => s + t.xp, 0);
    const completedCount = PYTHON_TOPICS.filter(t => completed[`python-${t.id}`]).length;
    const overallPct = Math.round((completedCount / PYTHON_TOPICS.length) * 100);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-heading text-white flex items-center gap-2">
                        🐍 Python Learning Track
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        12 interactive topics — theory, runnable code, and coding challenges
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono font-bold text-neon-gold">{earnedXP} <span className="text-sm text-gray-500">/ {totalXP} XP</span></div>
                    <div className="text-xs text-gray-500">{completedCount}/{PYTHON_TOPICS.length} topics done</div>
                </div>
            </div>

            {/* Overall Progress Bar */}
            <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Overall Progress</span>
                    <span>{overallPct}%</span>
                </div>
                <div className="w-full h-2 bg-bg-elevated rounded-full overflow-hidden">
                    <div
                        className="h-2 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-700"
                        style={{ width: `${overallPct}%` }}
                    />
                </div>
            </div>

            {/* Topic Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PYTHON_TOPICS.map((topic, idx) => {
                    const done = !!completed[`python-${topic.id}`];
                    const locked = idx > 0 && !completed[`python-${PYTHON_TOPICS[idx - 1].id}`] && !done;
                    const colors = TOPIC_COLOR_CLASSES[topic.color] || TOPIC_COLOR_CLASSES.cyan;

                    return (
                        <button
                            key={topic.id}
                            onClick={() => !locked && navigate(`/python/${topic.id}`)}
                            disabled={locked}
                            className={`neon-card p-5 text-left transition-all duration-200 group ${locked ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-[1.02] ' + colors.card
                                } ${done ? 'border-neon-cyan/50' : ''}`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{topic.icon}</span>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-0.5">Topic {idx + 1}</div>
                                        <h3 className="font-semibold text-white text-sm leading-tight">{topic.title}</h3>
                                    </div>
                                </div>
                                <div className="shrink-0">
                                    {done ? (
                                        <CheckCircle size={22} className="text-neon-cyan" />
                                    ) : locked ? (
                                        <Lock size={18} className="text-gray-600" />
                                    ) : (
                                        <ProgressRing pct={0} color={colors.ring} size={36} />
                                    )}
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 mb-4 leading-relaxed">{topic.description}</p>

                            <div className="flex items-center justify-between">
                                <span className={`text-xs font-mono flex items-center gap-1 ${colors.badge}`}>
                                    <Zap size={10} /> {topic.xp} XP
                                </span>
                                <span className="text-xs text-gray-600 flex items-center gap-1">
                                    {topic.sections.length} sections
                                    {!locked && <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-6 text-xs text-gray-500 pt-2">
                <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-neon-cyan" /> Completed</span>
                <span className="flex items-center gap-1.5"><BookOpen size={12} /> Available</span>
                <span className="flex items-center gap-1.5"><Lock size={12} /> Complete previous to unlock</span>
            </div>
        </div>
    );
}
