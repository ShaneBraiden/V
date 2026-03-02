/** @fileoverview Interactive lesson page for any tech — /learn/:techId/:topicId */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import usePyodide from '../hooks/usePyodide';
import { addXP, getProgress, updateProgress } from '../api/progress';
import { TECH_BY_ID, TOPIC_COLOR_CLASSES } from '../utils/learnCurriculum';
import NeonCard from '../components/ui/NeonCard';
import {
    ArrowLeft, ArrowRight, BookOpen, Code2, Zap, CheckCircle,
    Play, RotateCcw, ChevronRight, Trophy, Lightbulb,
} from 'lucide-react';

/* ── Inline markdown renderer ── */
function InlineMd({ text }) {
    const parts = [];
    const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`)/g;
    let last = 0, m;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) parts.push(<span key={last}>{text.slice(last, m.index)}</span>);
        if (m[2]) parts.push(<strong key={m.index} className="text-white font-semibold">{m[2]}</strong>);
        else if (m[3]) parts.push(<em key={m.index} className="italic text-gray-200">{m[3]}</em>);
        else if (m[4]) parts.push(<code key={m.index} className="bg-bg-elevated text-neon-cyan text-xs px-1.5 py-0.5 rounded font-mono">{m[4]}</code>);
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(<span key={last}>{text.slice(last)}</span>);
    return <>{parts}</>;
}

function TheoryBlock({ content }) {
    const lines = content.split('\n');
    const nodes = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (line.startsWith('```')) {
            const codeLines = [];
            i++;
            while (i < lines.length && !lines[i].startsWith('```')) { codeLines.push(lines[i]); i++; }
            nodes.push(
                <pre key={i} className="bg-bg-elevated border border-border-dim rounded-lg p-4 my-3 overflow-x-auto text-sm font-mono text-gray-300 leading-relaxed">
                    <code>{codeLines.join('\n')}</code>
                </pre>
            );
            i++; continue;
        }
        if (/^#{1,3} /.test(line)) {
            const lvl = line.match(/^(#+)/)[1].length;
            const txt = line.replace(/^#+\s/, '');
            const cls = lvl === 1 ? 'text-lg font-bold text-white mt-5 mb-2'
                : lvl === 2 ? 'text-base font-semibold text-gray-100 mt-4 mb-1.5'
                    : 'text-sm font-semibold text-gray-200 mt-3 mb-1';
            nodes.push(<div key={i} className={cls}><InlineMd text={txt} /></div>);
            i++; continue;
        }
        if (/^\|/.test(line)) {
            const tableLines = [];
            while (i < lines.length && /^\|/.test(lines[i])) { tableLines.push(lines[i]); i++; }
            const headers = tableLines[0].split('|').filter(Boolean).map(h => h.trim());
            const rows = tableLines.slice(2).map(r => r.split('|').filter(Boolean).map(c => c.trim()));
            nodes.push(
                <table key={i} className="w-full text-sm my-3 border-collapse">
                    <thead><tr>{headers.map((h, j) => <th key={j} className="text-left px-3 py-1.5 border-b border-border-dim text-gray-400 font-medium text-xs">{h}</th>)}</tr></thead>
                    <tbody>{rows.map((row, ri) => (
                        <tr key={ri} className="border-b border-border-dim/30">
                            {row.map((cell, ci) => <td key={ci} className="px-3 py-1.5 text-gray-300 text-xs"><InlineMd text={cell} /></td>)}
                        </tr>
                    ))}</tbody>
                </table>
            );
            continue;
        }
        if (/^[\-\*] /.test(line)) {
            nodes.push(<div key={i} className="flex gap-2 my-0.5 text-sm"><span className="text-neon-cyan mt-1 shrink-0">•</span><span className="text-gray-300"><InlineMd text={line.slice(2)} /></span></div>);
            i++; continue;
        }
        if (line.trim() === '') { nodes.push(<div key={i} className="h-2" />); i++; continue; }
        nodes.push(<p key={i} className="text-sm text-gray-300 leading-relaxed"><InlineMd text={line} /></p>);
        i++;
    }
    return <div className="space-y-1">{nodes}</div>;
}

const SECTION_ICONS = { theory: BookOpen, code: Code2, challenge: Zap };
const SECTION_LABELS = { theory: 'Theory', code: 'Code', challenge: 'Challenge' };

/* Language detection for Monaco */
function detectLang(code = '') {
    if (code.includes('#include') || code.includes('std::')) return 'cpp';
    if (code.includes('import torch') || code.includes('import gym') || code.includes('def ') || code.includes('import ')) return 'python';
    if (code.startsWith('//') || code.includes('from fastapi')) return 'python';
    return 'python';
}

export default function LearnLesson() {
    const { techId, topicId } = useParams();
    const navigate = useNavigate();
    const { runPython, loading: pyLoading } = usePyodide();

    const tech = TECH_BY_ID[techId];
    const topicIdx = tech?.topics.findIndex(t => t.id === topicId) ?? -1;
    const topic = tech?.topics[topicIdx];

    const [activeSection, setActiveSection] = useState(0);
    const [codeValue, setCodeValue] = useState('');
    const [output, setOutput] = useState('');
    const [outputError, setOutputError] = useState('');
    const [running, setRunning] = useState(false);
    const [challengePassed, setChallengePassed] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [alreadyDone, setAlreadyDone] = useState(false);
    const [xpAwarded, setXpAwarded] = useState(false);
    const [cppOutput, setCppOutput] = useState('');

    const section = topic?.sections[activeSection];
    const colors = topic ? (TOPIC_COLOR_CLASSES[topic.color] || TOPIC_COLOR_CLASSES.cyan) : TOPIC_COLOR_CLASSES.cyan;

    useEffect(() => {
        if (!tech || !topic) return;
        getProgress().then(p => {
            if (p?.lessonProgress?.[`${techId}-${topic.id}`]) { setAlreadyDone(true); setChallengePassed(true); }
        }).catch(() => { });
    }, [tech, topic, techId]);

    useEffect(() => {
        if (!section) return;
        if (section.type === 'code') setCodeValue(section.code || '');
        else if (section.type === 'challenge') setCodeValue(section.starterCode || '');
        setOutput(''); setOutputError(''); setShowHint(false); setCppOutput('');
    }, [section]);

    const isCpp = section?.type !== 'theory' && detectLang(codeValue) === 'cpp';

    const runCpp = useCallback(async () => {
        setRunning(true); setCppOutput(''); setOutput(''); setOutputError('');
        try {
            const res = await fetch('https://emkc.org/api/v2/piston/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: 'c++', version: '*', files: [{ content: codeValue }] }),
            });
            const data = await res.json();
            const out = data.run?.stdout || '';
            const err = (data.compile?.stderr || '') + (data.run?.stderr || '');
            setOutput(out); if (err) setOutputError(err);
            if (section?.type === 'challenge' && section.check && !challengePassed) {
                if (section.check(out + err)) {
                    setChallengePassed(true);
                    if (!alreadyDone) { setXpAwarded(true); try { await Promise.all([addXP(`${techId}-${topic.id}`, topic.xp), updateProgress({ lessonProgress: { [`${techId}-${topic.id}`]: true } })]); setAlreadyDone(true); } catch { } }
                }
            }
        } catch (e) { setOutputError(e.message); }
        finally { setRunning(false); }
    }, [codeValue, section, challengePassed, alreadyDone, techId, topic]);

    const handleRun = useCallback(async () => {
        if (!codeValue.trim()) return;
        if (isCpp) return runCpp();
        setRunning(true); setOutput(''); setOutputError('');
        try {
            const result = await runPython(codeValue);
            const out = result.output || '';
            const err = result.error || '';
            setOutput(out); if (err) setOutputError(err);
            if (section?.type === 'challenge' && section.check && !challengePassed) {
                if (section.check(out + err)) {
                    setChallengePassed(true);
                    if (!alreadyDone) { setXpAwarded(true); try { await Promise.all([addXP(`${techId}-${topic.id}`, topic.xp), updateProgress({ lessonProgress: { [`${techId}-${topic.id}`]: true } })]); setAlreadyDone(true); } catch { } }
                }
            }
        } catch (e) { setOutputError(e.message); }
        finally { setRunning(false); }
    }, [codeValue, isCpp, runCpp, section, challengePassed, alreadyDone, techId, topic, runPython]);

    const handleReset = () => {
        if (section?.type === 'code') setCodeValue(section.code);
        else if (section?.type === 'challenge') setCodeValue(section.starterCode);
        setOutput(''); setOutputError('');
    };

    if (!tech || !topic) {
        return (<div className="text-center py-20"><p className="text-gray-500">Topic not found.</p>
            <button onClick={() => navigate('/learn')} className="btn-neon text-sm mt-4 px-4 py-2">← Learn</button></div>);
    }

    const prevTopic = tech.topics[topicIdx - 1];
    const nextTopic = tech.topics[topicIdx + 1];

    return (
        <div className="space-y-4">
            {/* Top nav */}
            <div className="flex items-center justify-between">
                <button onClick={() => navigate(`/learn/${techId}`)}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-neon-cyan transition-colors">
                    <ArrowLeft size={16} /> {tech.meta.name}
                </button>
                <div className="flex gap-2">
                    {prevTopic && <button onClick={() => navigate(`/learn/${techId}/${prevTopic.id}`)}
                        className="px-3 py-1.5 text-xs border border-border-dim rounded-lg text-gray-500 hover:text-white hover:border-gray-500 flex items-center gap-1">
                        <ArrowLeft size={12} /> {prevTopic.title}
                    </button>}
                    {nextTopic && <button onClick={() => navigate(`/learn/${techId}/${nextTopic.id}`)}
                        className="px-3 py-1.5 text-xs border border-border-dim rounded-lg text-gray-500 hover:text-white hover:border-gray-500 flex items-center gap-1">
                        {nextTopic.title} <ArrowRight size={12} />
                    </button>}
                </div>
            </div>

            {/* Header */}
            <div className="flex items-center gap-4">
                <span className="text-3xl">{topic.icon}</span>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{tech.meta.emoji} {tech.meta.name}</span>
                        <span className="text-gray-700">·</span>
                        <span className="text-xs text-gray-500">Topic {topicIdx + 1}</span>
                    </div>
                    <h1 className="text-xl font-heading text-white">{topic.title}</h1>
                    <p className="text-sm text-gray-500">{topic.description}</p>
                </div>
                <div className={`flex items-center gap-1.5 font-mono text-sm ${colors.badge}`}>
                    <Zap size={14} /> {topic.xp} XP
                    {(alreadyDone || challengePassed) && <CheckCircle size={14} className="text-neon-cyan ml-1" />}
                </div>
            </div>

            {/* Section Tabs */}
            <div className="flex gap-2 border-b border-border-dim">
                {topic.sections.map((sec, idx) => {
                    const Icon = SECTION_ICONS[sec.type];
                    const active = idx === activeSection;
                    return (
                        <button key={idx} onClick={() => setActiveSection(idx)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${active ? 'border-neon-cyan text-neon-cyan' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                            <Icon size={14} />
                            {SECTION_LABELS[sec.type]}
                            {sec.type === 'challenge' && challengePassed && <CheckCircle size={12} className="text-neon-cyan" />}
                        </button>
                    );
                })}
            </div>

            {/* Theory */}
            {section?.type === 'theory' && (
                <NeonCard>
                    <h2 className="text-base font-heading text-white mb-4">{section.title}</h2>
                    <TheoryBlock content={section.content} />
                    {topic.sections[1] && (
                        <div className="mt-6 flex justify-end">
                            <button onClick={() => setActiveSection(1)} className="btn-neon text-sm px-4 py-2 flex items-center gap-2">
                                Next: {SECTION_LABELS[topic.sections[1].type]} <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </NeonCard>
            )}

            {/* Code / Challenge */}
            {(section?.type === 'code' || section?.type === 'challenge') && (
                <div className="space-y-4">
                    {section.type === 'challenge' && (
                        <NeonCard color="purple">
                            <h2 className="text-sm font-heading text-neon-purple mb-2 flex items-center gap-2"><Zap size={14} /> {section.title}</h2>
                            <TheoryBlock content={section.instructions} />
                            {showHint && <div className="mt-3 p-3 bg-neon-gold/10 border border-neon-gold/30 rounded-lg text-xs text-neon-gold">💡 {section.hint}</div>}
                            {!showHint && <button onClick={() => setShowHint(true)} className="mt-3 text-xs text-gray-500 hover:text-neon-gold flex items-center gap-1"><Lightbulb size={12} /> Show hint</button>}
                        </NeonCard>
                    )}

                    <NeonCard className="p-0 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 bg-bg-elevated border-b border-border-dim">
                            <span className="text-xs font-mono text-neon-cyan">
                                {section.type === 'challenge' ? 'Your Code' : `main.${isCpp ? 'cpp' : 'py'}`}
                                {isCpp && <span className="ml-2 text-gray-500">· runs via Piston API</span>}
                            </span>
                            <div className="flex gap-2">
                                <button onClick={handleReset} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1"><RotateCcw size={11} /> Reset</button>
                                <button onClick={handleRun} disabled={running || (!isCpp && pyLoading)}
                                    className="btn-neon text-xs px-3 py-1 flex items-center gap-1.5 disabled:opacity-50">
                                    <Play size={11} />
                                    {running ? 'Running...' : (!isCpp && pyLoading) ? 'Loading Pyodide…' : 'Run'}
                                </button>
                            </div>
                        </div>
                        <Editor height="280px" language={isCpp ? 'cpp' : 'python'} value={codeValue} onChange={setCodeValue}
                            theme="vs-dark" options={{ fontSize: 13, fontFamily: "'JetBrains Mono', monospace", minimap: { enabled: false }, lineNumbers: 'on', scrollBeyondLastLine: false, automaticLayout: true, padding: { top: 10 } }} />
                    </NeonCard>

                    {(output || outputError || running || (!isCpp && pyLoading)) && (
                        <NeonCard className="p-0 overflow-hidden">
                            <div className="px-4 py-2 bg-bg-elevated border-b border-border-dim text-xs text-gray-500 flex items-center justify-between">
                                <span>Output</span>
                                {challengePassed && <span className="text-neon-cyan flex items-center gap-1"><CheckCircle size={12} /> Challenge Passed!</span>}
                            </div>
                            <div className="p-4 font-mono text-sm min-h-[60px] max-h-48 overflow-y-auto">
                                {(running || (!isCpp && pyLoading)) && <p className="text-gray-500 animate-pulse">Running…</p>}
                                {outputError && <pre className="text-red-400 whitespace-pre-wrap">{outputError}</pre>}
                                {output && <pre className="text-green-400 whitespace-pre-wrap">{output}</pre>}
                            </div>
                        </NeonCard>
                    )}

                    {xpAwarded && (
                        <div className="flex items-center gap-3 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl">
                            <Trophy size={20} className="text-neon-gold shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-neon-cyan">Challenge Complete! +{topic.xp} XP</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {nextTopic ? `Next up: ${nextTopic.title}` : `🎉 You've completed all ${tech.meta.name} topics!`}
                                </p>
                            </div>
                            {nextTopic && (
                                <button onClick={() => navigate(`/learn/${techId}/${nextTopic.id}`)} className="ml-auto btn-neon text-xs px-3 py-1.5 flex items-center gap-1">
                                    Next <ArrowRight size={12} />
                                </button>
                            )}
                        </div>
                    )}

                    {section.type === 'code' && topic.sections[activeSection + 1] && (
                        <div className="flex justify-between">
                            {activeSection > 0 && <button onClick={() => setActiveSection(activeSection - 1)}
                                className="text-sm text-gray-500 hover:text-gray-300 flex items-center gap-1"><ArrowLeft size={14} /> Back</button>}
                            <button onClick={() => setActiveSection(activeSection + 1)}
                                className="ml-auto btn-neon text-sm px-4 py-2 flex items-center gap-2">
                                Try the Challenge <ChevronRight size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
