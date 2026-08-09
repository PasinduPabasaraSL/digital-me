import { useEffect, useMemo, useState } from 'react';
import { apps } from '@/apps/registry';
import { useSystem } from '@/store/system';
import { useWindows } from '@/store/windows';

export default function Activities() {
  const showActivities = useSystem((state) => state.showActivities);
  const toggleActivities = useSystem((state) => state.toggleActivities);
  const open = useWindows((state) => state.open);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!showActivities) {
      setQuery('');
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') toggleActivities(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showActivities, toggleActivities]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return apps;
    return apps.filter((app) =>
      `${app.title} ${app.description} ${app.keywords?.join(' ') ?? ''}`
        .toLowerCase()
        .includes(needle),
    );
  }, [query]);

  if (!showActivities) return null;

  return (
    <div
      className="fixed inset-0 z-8500 flex flex-col items-center bg-black/55 backdrop-blur-xl"
      onClick={(event) => {
        if (event.target === event.currentTarget) toggleActivities(false);
      }}
    >
      <input
        autoFocus
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' && results[0]) {
            open(results[0].id, results[0].defaultSize);
            toggleActivities(false);
          }
        }}
        placeholder="Type to search…"
        aria-label="Search applications"
        className="mt-16 w-[min(460px,80vw)] rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-center text-[15px] text-white outline-none placeholder:text-white/45 focus:border-white/40"
      />

      <div className="mt-12 grid w-[min(880px,86vw)] grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5">
        {results.map((app) => (
          <button
            key={app.id}
            onClick={() => {
              open(app.id, app.defaultSize);
              toggleActivities(false);
            }}
            aria-label={`${app.title} — ${app.description}`}
            className="flex flex-col items-center gap-2 rounded-xl p-3 transition-colors hover:bg-white/10"
          >
            <app.Icon className="h-16 w-16" />
            <span className="text-center text-[13px] text-white">{app.title}</span>
            <span className="text-center text-[11.5px] leading-tight text-white/50">
              {app.description}
            </span>
          </button>
        ))}
      </div>

      {results.length === 0 && (
        <p className="mt-16 text-white/60">No applications match “{query}”.</p>
      )}
    </div>
  );
}
