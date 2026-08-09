import { profile, socials } from '@/data/profile';
import { ctfPlatforms, skills } from '@/data/skills';

export default function About() {
  return (
    <div className="flex h-full flex-col bg-yaru-window text-white">
      <div className="flex h-9 shrink-0 items-center gap-1 border-b border-black/40 bg-yaru-sidebar px-2">
        <span className="rounded-t-md bg-yaru-window px-3 py-1.5 text-[12.5px] font-medium">
          about.md
        </span>
        <span className="ml-auto pr-2 text-[11.5px] text-white/40">Markdown · UTF-8 · LF</span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[72ch] px-8 py-8">
          <div className="mb-7 flex items-center gap-5">
            <picture>
              <source srcSet="/assets/about_photo-thumb.webp" type="image/webp" />
              <img
                src={profile.avatar}
                alt={profile.name}
                width={96}
                height={96}
                loading="lazy"
                decoding="async"
                className="h-24 w-24 rounded-xl border border-white/15 object-cover"
              />
            </picture>
            <div>
              <h1 className="text-[26px] font-bold leading-tight"># {profile.name}</h1>
              <p className="text-[14px] text-ubuntu-orange">{profile.title}</p>
              <p className="mt-1 text-[13px] text-white/50">
                {profile.role} · {profile.location}
              </p>
            </div>
          </div>

          <p className="whitespace-pre-wrap text-[14.5px] leading-[1.75] text-white/80">
            {profile.bio}
          </p>

          <blockquote className="my-7 rounded-r-lg border-l-4 border-ubuntu-orange bg-ubuntu-orange/10 px-5 py-3.5 text-[15px] italic text-white/85">
            {profile.quote}
          </blockquote>

          <h2 className="mb-3 mt-8 text-[18px] font-bold">## Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.name}
                className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[12.5px] text-white/85"
                style={{ borderLeftColor: skill.color, borderLeftWidth: 3 }}
              >
                {skill.name}
              </span>
            ))}
          </div>

          <h2 className="mb-3 mt-8 text-[18px] font-bold">## Security Practice</h2>
          <p className="text-[14px] leading-relaxed text-white/75">
            Building DevSecOps depth through CTF challenges on{' '}
            {ctfPlatforms.map((platform, index) => (
              <span key={platform}>
                <span className="text-ubuntu-orange">{platform}</span>
                {index < ctfPlatforms.length - 2 ? ', ' : index === ctfPlatforms.length - 2 ? ' and ' : ''}
              </span>
            ))}
            . Focused on ethical hacking, system hardening, and vulnerability assessment.
          </p>

          <h2 className="mb-3 mt-8 text-[18px] font-bold">## Elsewhere</h2>
          <ul className="space-y-1.5">
            {socials.map((social) => (
              <li key={social.label} className="text-[14px]">
                <span className="inline-block w-24 text-white/45">{social.label}</span>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#729fcf] underline-offset-2 hover:text-ubuntu-orange hover:underline"
                >
                  {social.handle}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
