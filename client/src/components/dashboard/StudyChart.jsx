import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/** Study hours chart for dashboard - 14-day area chart */
export default function StudyChart({ data = [] }) {
  const chartData = data.length > 0 ? data : Array.from({ length: 14 }, (_, i) => ({
    day: `D${i + 1}`,
    typing: 0,
    learning: 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="typingGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00F5D4" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#00F5D4" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="learningGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7B2FF7" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#7B2FF7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" stroke="#64748B" fontSize={10} tickLine={false} />
        <YAxis stroke="#64748B" fontSize={10} tickLine={false} unit="m" />
        <Tooltip
          contentStyle={{ background: '#111827', border: '1px solid #1E293B', borderRadius: 8, color: '#E2E8F0' }}
          formatter={(v, name) => [`${v}m`, name === 'typing' ? 'Typing' : 'Lessons']}
        />
        <Area type="monotone" dataKey="typing" stroke="#00F5D4" fill="url(#typingGrad)" strokeWidth={2} name="Typing" />
        <Area type="monotone" dataKey="learning" stroke="#7B2FF7" fill="url(#learningGrad)" strokeWidth={2} name="Lessons" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

