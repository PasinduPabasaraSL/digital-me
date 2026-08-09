import { useEffect, useMemo, useRef, useState } from 'react';
import { experience } from '@/data/experience';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';

const POINTS = 48;
const CATEGORIES = [
  { id: 'ops', label: 'DevOps & Infrastructure', color: '#e95420' },
  { id: 'cloud', label: 'Cloud', color: '#f4a259' },
  { id: 'backend', label: 'Backend', color: '#8ae234' },
  { id: 'frontend', label: 'Frontend', color: '#729fcf' },
  { id: 'data', label: 'Data', color: '#b34cb3' },
] as const;

function useRollingSeries(baselines: number[]) {
  const [series, setSeries] = useState<number[][]>(() =>
    baselines.map((base) => Array.from({ length: POINTS }, () => base)),
  );
  const baseRef = useRef(baselines);
  baseRef.current = baselines;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSeries((prev) =>
        prev.map((line, index) => {
          const base = baseRef.current[index] ?? 50;
          const jitter = (Math.random() - 0.5) * 14;
          const next = Math.min(100, Math.max(4, base + jitter));
          return [...line.slice(1), next];
        }),
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return series;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const width = 100;
  const height = 100;
  const points = data
    .map((value, index) => `${(index / (POINTS - 1)) * width},${height - value}`)
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      {[25, 50, 75].map((line) => (
        <line key={line} x1="0" y1={line} x2={width} y2={line} stroke="#ffffff" strokeWidth="0.3" opacity="0.12" />
      ))}
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={color} opacity="0.18" />
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function Monitor() {
  const [tab, setTab] = useState<'resources' | 'processes'>('resources');

  const baselines = useMemo(
    () =>
      CATEGORIES.map((category) => {
        const inCategory = skills.filter((skill) => skill.category === category.id);
        if (!inCategory.length) return 40;
        return inCategory.reduce((sum, skill) => sum + skill.load, 0) / inCategory.length;
      }),
    [],
  );

  const series = useRollingSeries(baselines);
  const sorted = useMemo(() => [...skills].sort((a, b) => b.load - a.load), []);

  return (
    <div className="flex h-full flex-col bg-yaru-window text-white">
      <div className="flex h-11 shrink-0 items-center gap-1 border-b border-black/40 bg-yaru-headerbar px-3">
        {(['resources', 'processes'] as const).map((id) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`rounded-md px-3.5 py-1.5 text-[13px] capitalize transition-colors ${
              tab === id ? 'bg-white/15 font-medium' : 'text-white/60 hover:bg-white/8'
            }`}
          >
            {id}
          </button>
        ))}
        <span className="ml-auto text-[12px] text-white/40">
          {projects.length} processes · {experience.length} services
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-5">
        {tab === 'resources' ? (
          <div className="space-y-5">
            {CATEGORIES.map((category, index) => (
              <div key={category.id}>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="flex items-center gap-2 text-[13.5px] font-medium">
                    <span className="h-2.5 w-2.5 rounded-sm" style={{ background: category.color }} />
                    {category.label}
                  </span>
                  <span className="font-mono text-[13px] text-white/60">
                    {Math.round(series[index]?.at(-1) ?? 0)}%
                  </span>
                </div>
                <div className="h-20 rounded-md bg-black/35 ring-1 ring-white/8">
                  <Sparkline data={series[index] ?? []} color={category.color} />
                </div>
              </div>
            ))}
            <p className="pt-1 text-[12px] text-white/35">
              Load reflects self-assessed proficiency per area, sampled every second.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-[13px]">
            <thead className="sticky top-0 bg-yaru-window">
              <tr className="border-b border-white/10 text-[12px] uppercase tracking-wide text-white/45">
                <th className="pb-2 font-medium">Process</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 text-right font-medium">% CPU</th>
                <th className="w-40 pb-2 pl-4 font-medium">Load</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((skill) => (
                <tr key={skill.name} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-1.5">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ background: skill.color }} />
                      {skill.name}
                    </span>
                  </td>
                  <td className="py-1.5 capitalize text-white/50">{skill.category}</td>
                  <td className="py-1.5 text-right font-mono text-white/75">{skill.load}</td>
                  <td className="py-1.5 pl-4">
                    <span className="block h-1.5 rounded-full bg-white/10">
                      <span
                        className="block h-full rounded-full"
                        style={{ width: `${skill.load}%`, background: skill.color }}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
