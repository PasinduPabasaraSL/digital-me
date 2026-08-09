import { socialIcons } from '@/components/icons/SocialIcons';
import { profile, socials } from '@/data/profile';
import { projects } from '@/data/projects';

const liveProjects = projects.filter((project) =>
  project.links.some((link) => link.kind === 'live'),
);

/*
 * LinkedIn, Medium and GitHub all send X-Frame-Options: DENY, so embedding
 * them would render an empty box. This is a Firefox start page instead, and
 * every tile opens in a real browser tab.
 */
export default function Firefox() {
  return (
    <div className="flex h-full flex-col bg-[#1c1b22] text-white">
      <div className="flex h-9 shrink-0 items-end gap-1 bg-[#15141a] px-2 pt-1.5">
        <span className="flex items-center gap-2 rounded-t-md bg-[#42414d] px-3 py-1.5 text-[12.5px]">
          <span className="h-3 w-3 rounded-full bg-ubuntu-orange" />
          New Tab
        </span>
      </div>

      <div className="flex h-11 shrink-0 items-center gap-2 bg-[#42414d] px-3">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-[#1c1b22] px-3.5 py-1.5">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-white/40" fill="currentColor" aria-hidden="true">
            <path d="M11.5 6.5a5 5 0 10-1.8 3.85l3.2 3.2 1.4-1.4-3.2-3.2A5 5 0 0011.5 6.5zm-8.4 0a3.4 3.4 0 116.8 0 3.4 3.4 0 01-6.8 0z" />
          </svg>
          <span className="text-[13px] text-white/55">Search or enter address</span>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-8 py-10">
        <div className="mx-auto max-w-190">
          <h2 className="mb-1 text-center text-[22px] font-bold">{profile.name}</h2>
          <p className="mb-8 text-center text-[13.5px] text-white/50">Shortcuts</p>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-4">
            {socials.map((social) => {
              const icon = socialIcons[social.label];
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel={social.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                  className="group flex flex-col items-center gap-2.5 rounded-lg p-4 transition-colors hover:bg-white/8"
                >
                  <span
                    style={icon ? { color: icon.color } : undefined}
                    className="grid h-16 w-16 place-items-center rounded-xl bg-white/10 transition-colors group-hover:bg-white/15"
                  >
                    {icon ? (
                      <icon.Icon className="h-8 w-8" />
                    ) : (
                      <span className="text-[22px] font-bold">{social.label[0]}</span>
                    )}
                  </span>
                  <span className="text-[13px] font-medium">{social.label}</span>
                  <span className="line-clamp-1 text-[11.5px] text-white/40">{social.handle}</span>
                </a>
              );
            })}
          </div>

          <h3 className="mb-4 mt-12 text-[15px] font-bold text-white/85">Live projects</h3>
          <div className="space-y-2">
            {liveProjects.map((project) => {
              const live = project.links.find((link) => link.kind === 'live')!;
              return (
                <a
                  key={project.id}
                  href={live.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-lg bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-ubuntu-orange/20 text-[13px] font-bold text-ubuntu-orange">
                    {project.name[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13.5px] font-medium">{project.name}</span>
                    <span className="block truncate text-[12px] text-white/45">{live.href}</span>
                  </span>
                  <span className="shrink-0 text-white/35">↗</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
