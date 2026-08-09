import { useState } from 'react';
import { experience } from '@/data/experience';

/**
 * Presents work history the way `systemctl list-units` presents services,
 * which keeps the desktop metaphor intact while staying readable to a
 * non-technical reader.
 */
export default function Experience() {
  const [activeId, setActiveId] = useState(experience[0]?.id ?? null);
  const active = experience.find((job) => job.id === activeId) ?? experience[0];

  return (
    <div className="flex h-full bg-yaru-window text-white">
      <nav className="w-[260px] shrink-0 overflow-y-auto bg-yaru-sidebar p-2">
        <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-white/40">
          Units
        </p>
        {experience.map((job) => (
          <button
            key={job.id}
            onClick={() => setActiveId(job.id)}
            className={`mb-0.5 flex w-full items-start gap-2.5 rounded-md px-3 py-2.5 text-left transition-colors ${
              active?.id === job.id ? 'bg-white/15' : 'hover:bg-white/8'
            }`}
          >
            <span
              aria-hidden="true"
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                job.current ? 'bg-[#8ae234]' : 'bg-white/30'
              }`}
            />
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-medium">{job.company}</span>
              <span className="block truncate text-[12px] text-white/50">{job.period}</span>
            </span>
          </button>
        ))}
      </nav>

      {active && (
        <div className="min-w-0 flex-1 overflow-y-auto p-7">
          <div className="mb-1 flex items-center gap-2.5">
            <span
              className={`h-2.5 w-2.5 rounded-full ${active.current ? 'bg-[#8ae234]' : 'bg-white/30'}`}
              aria-hidden="true"
            />
            <span className="font-mono text-[13px] text-white/60">
              {active.company.toLowerCase().replace(/\s+/g, '-')}.service
            </span>
          </div>

          <h2 className="text-[24px] font-bold leading-tight">{active.role}</h2>
          <a
            href={active.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[15px] text-ubuntu-orange underline-offset-2 hover:underline"
          >
            {active.company}
          </a>

          <dl className="mt-5 grid grid-cols-[110px_1fr] gap-y-2 font-mono text-[13px]">
            <dt className="text-white/45">Loaded:</dt>
            <dd className="text-white/80">loaded (/etc/career/{active.id}.service; enabled)</dd>
            <dt className="text-white/45">Active:</dt>
            <dd className={active.current ? 'text-[#8ae234]' : 'text-white/55'}>
              {active.current ? 'active (running)' : 'inactive (completed)'} — {active.period}
            </dd>
          </dl>

          <p className="mt-6 max-w-[70ch] text-[14.5px] leading-[1.75] text-white/80">
            {active.description}
          </p>

          <p className="mt-6 text-[11px] font-medium uppercase tracking-wide text-white/45">
            Skills applied
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {active.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-ubuntu-orange/15 px-3 py-1 text-[12.5px] text-white/90 ring-1 ring-ubuntu-orange/30"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
