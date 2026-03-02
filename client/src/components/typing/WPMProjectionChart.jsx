/** @fileoverview WPM trend chart with polynomial projection line */
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function WPMProjectionChart({ sessions = [], projection = null }) {
  const data = sessions.map((s, i) => ({
    session: i + 1,
    wpm: s.wpm,
  }));

  // Add projection points if available
  if (projection) {
    const last = data.length;
    if (projection.predicted_30) data.push({ session: last + 10, projected: projection.predicted_30 });
    if (projection.predicted_60) data.push({ session: last + 30, projected: projection.predicted_60 });
    if (projection.predicted_90) data.push({ session: last + 60, projected: projection.predicted_90 });
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
          <XAxis dataKey="session" stroke="#64748B" fontSize={12} />
          <YAxis stroke="#64748B" fontSize={12} />
          <Tooltip
            contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E293B', borderRadius: 8 }}
            labelStyle={{ color: '#9CA3AF' }}
          />
          <ReferenceLine y={60} stroke="#FFD60A" strokeDasharray="5 5" label={{ value: '60 WPM Goal', fill: '#FFD60A', fontSize: 10 }} />
          <Line type="monotone" dataKey="wpm" stroke="#00F5D4" strokeWidth={2} dot={{ fill: '#00F5D4', r: 3 }} name="WPM" />
          <Line type="monotone" dataKey="projected" stroke="#7B2FF7" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#7B2FF7', r: 3 }} name="Projected" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
