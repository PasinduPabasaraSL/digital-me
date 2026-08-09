import { useMemo, useState } from 'react';
import { projects, type Project } from '@/data/projects';

const PLACES = [
  { id: 'all', label: 'Home', hint: 'All projects' },
  { id: 'production', label: 'Production', hint: 'Shipped and live' },
  { id: 'labs', label: 'Labs', hint: 'Experiments' },
  { id: 'university', label: 'University', hint: 'Coursework' },
] as const;

type PlaceId = (typeof PLACES)[number]['id'];

function FolderGlyph({ accent }: { accent: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="h-14 w-14" aria-hidden="true">
      <path
        d="M6 13.5A2.5 2.5 0 018.5 11h9.7c.8 0 1.5.4 2 1l2 2.8h17.3a2.5 2.5 0 012.5 2.5v18.2a2.5 2.5 0 01-2.5 2.5h-31A2.5 2.5 0 016 35.5z"
        fill={accent ? 'var(--color-ubuntu-orange)' : '#5c5c5c'}
      />
      <path
        d="M6 20h36v15.5a2.5 2.5 0 01-2.5 2.5h-31A2.5 2.5 0 016 35.5z"
        fill={accent ? '#f6f6f6' : '#d9d9d9'}
        opacity="0.9"
      />
    </svg>
  );
}

function Detail({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <aside className="flex w-[320px] shrink-0 flex-col overflow-y-auto border-l border-black/40 bg-yaru-sidebar p-5">
      <div className="mb-4 flex items-start justify-between gap-2">
        <h3 className="text-[17px] font-bold leading-tight">{project.name}</h3>
        <button
          onClick={onClose}
          aria-label="Close details"
          className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/20"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
            <path d="M4.6 4.6l6.8 6.8M11.4 4.6l-6.8 6.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <p className="text-[13.5px] leading-relaxed text-white/75">{project.description}</p>

      <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-white/45">Stack</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {project.tech.map((tech) => (
          <span
            key={tech}
            className="rounded-full bg-white/10 px-2.5 py-1 text-[12px] text-white/85"
          >
            {tech}
          </span>
        ))}
      </div>

      <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-white/45">Links</p>
      <div className="mt-2 flex flex-col gap-1.5">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-white/5 px-3 py-2 text-[13px] text-white/85 transition-colors hover:bg-ubuntu-orange hover:text-white"
          >
            {link.label}
          </a>
        ))}
      </div>

      <dl className="mt-5 space-y-1 text-[12px] text-white/50">
        <div className="flex justify-between">
          <dt>Namespace</dt>
          <dd className="text-white/75">{project.namespace}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Port</dt>
          <dd className="text-white/75">{project.port}</dd>
        </div>
      </dl>
    </aside>
  );
}

export default function Files() {
  const [place, setPlace] = useState<PlaceId>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      const inPlace = place === 'all' || project.namespace === place;
      const matches =
        !needle ||
        project.name.toLowerCase().includes(needle) ||
        project.tech.some((tech) => tech.toLowerCase().includes(needle));
      return inPlace && matches;
    });
  }, [place, query]);

  const detail = projects.find((project) => project.id === selected) ?? null;

  return (
    <div className="flex h-full bg-yaru-window text-white">
      <nav className="flex w-[190px] shrink-0 flex-col gap-0.5 overflow-y-auto bg-yaru-sidebar p-2">
        {PLACES.map((item) => (
          <button
            key={item.id}
            onClick={() => setPlace(item.id)}
            title={item.hint}
            className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-left text-[13.5px] transition-colors ${
              place === item.id ? 'bg-white/15 font-medium' : 'hover:bg-white/8'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-white/60" fill="currentColor" aria-hidden="true">
              <path d="M3 7a2 2 0 012-2h4.6l1.7 2H19a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            {item.label}
          </button>
        ))}

        <div className="mt-3 border-t border-white/10 pt-3">
          <p className="px-3 text-[11px] uppercase tracking-wide text-white/35">
            {projects.length} projects
          </p>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex h-[46px] shrink-0 items-center gap-3 border-b border-black/40 bg-yaru-headerbar px-4">
          <span className="text-[13.5px] font-medium text-white/85">
            {PLACES.find((item) => item.id === place)?.label}
          </span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search projects"
            className="ml-auto w-48 rounded-full bg-black/30 px-3.5 py-1 text-[13px] outline-none ring-1 ring-white/10 placeholder:text-white/35 focus:ring-ubuntu-orange"
          />
        </div>

        <div className="flex min-h-0 flex-1">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2">
              {visible.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelected(project.id)}
                  onDoubleClick={() => window.open(project.links[0]?.href, '_blank', 'noopener')}
                  className={`flex flex-col items-center gap-1.5 rounded-lg p-3 transition-colors ${
                    selected === project.id ? 'bg-ubuntu-orange/25 ring-1 ring-ubuntu-orange/60' : 'hover:bg-white/8'
                  }`}
                >
                  <FolderGlyph accent={selected === project.id} />
                  <span className="line-clamp-2 text-center text-[12.5px] leading-tight text-white/90">
                    {project.name}
                  </span>
                </button>
              ))}
            </div>

            {visible.length === 0 && (
              <p className="mt-16 text-center text-white/50">No projects match “{query}”.</p>
            )}
          </div>

          {detail && <Detail project={detail} onClose={() => setSelected(null)} />}
        </div>

        <div className="flex h-7 shrink-0 items-center border-t border-black/40 bg-yaru-sidebar px-4 text-[12px] text-white/50">
          {visible.length} item{visible.length === 1 ? '' : 's'}
          {detail && ` · ${detail.name} selected`}
        </div>
      </div>
    </div>
  );
}
