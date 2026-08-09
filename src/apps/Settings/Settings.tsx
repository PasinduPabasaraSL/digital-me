import { useState } from 'react';
import { ACCENTS, useSystem, WALLPAPERS } from '@/store/system';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { skills } from '@/data/skills';

const PANELS = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'about', label: 'About' },
] as const;

type PanelId = (typeof PANELS)[number]['id'];

export default function Settings() {
  const [panel, setPanel] = useState<PanelId>('appearance');
  const { settings, updateSettings } = useSystem();

  return (
    <div className="flex h-full bg-yaru-window text-white">
      <nav className="w-[190px] shrink-0 bg-yaru-sidebar p-2">
        {PANELS.map((item) => (
          <button
            key={item.id}
            onClick={() => setPanel(item.id)}
            className={`mb-0.5 w-full rounded-md px-3 py-2 text-left text-[13.5px] transition-colors ${
              panel === item.id ? 'bg-white/15 font-medium' : 'hover:bg-white/8'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="min-w-0 flex-1 overflow-y-auto p-6">
        {panel === 'appearance' && (
          <div className="mx-auto max-w-[520px] space-y-7">
            <section>
              <h3 className="mb-3 text-[15px] font-bold">Accent colour</h3>
              <div className="flex flex-wrap gap-3 rounded-xl bg-white/5 p-4">
                {ACCENTS.map((accent) => (
                  <button
                    key={accent.id}
                    onClick={() => updateSettings({ accent: accent.id })}
                    title={accent.name}
                    aria-label={accent.name}
                    aria-pressed={settings.accent === accent.id}
                    className={`h-9 w-9 rounded-full transition-transform hover:scale-110 ${
                      settings.accent === accent.id
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-yaru-window'
                        : ''
                    }`}
                    style={{ background: accent.value }}
                  />
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-3 text-[15px] font-bold">Background</h3>
              <div className="grid grid-cols-2 gap-3">
                {WALLPAPERS.map((wallpaper) => (
                  <button
                    key={wallpaper.id}
                    onClick={() => updateSettings({ wallpaper: wallpaper.id })}
                    className={`overflow-hidden rounded-lg text-left ring-1 transition-all ${
                      settings.wallpaper === wallpaper.id
                        ? 'ring-2 ring-ubuntu-orange'
                        : 'ring-white/10 hover:ring-white/30'
                    }`}
                  >
                    <span
                      className="block h-20 w-full"
                      style={{
                        background:
                          wallpaper.id === 'noble'
                            ? 'linear-gradient(160deg,#2c001e,#3d0b2c 45%,#1c0413)'
                            : wallpaper.id === 'aubergine'
                              ? 'linear-gradient(180deg,#2c001e,#4a1436 60%,#17000f)'
                              : wallpaper.id === 'jammy'
                                ? 'linear-gradient(165deg,#3a1108,#5e2750 55%,#23060f)'
                                : 'linear-gradient(180deg,#2b2b2b,#1b1b1b 60%,#101010)',
                      }}
                    />
                    <span className="block px-3 py-2 text-[12.5px]">{wallpaper.name}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {panel === 'about' && (
          <div className="mx-auto max-w-[460px] text-center">
            <picture>
              <source srcSet="/assets/about_photo-thumb.webp" type="image/webp" />
              <img
                src={profile.avatar}
                alt={profile.name}
                width={104}
                height={104}
                loading="lazy"
                className="mx-auto h-26 w-26 rounded-full border border-white/15 object-cover"
                style={{ width: 104, height: 104 }}
              />
            </picture>
            <h3 className="mt-4 text-[20px] font-bold">{profile.name}</h3>
            <p className="text-[13.5px] text-white/55">{profile.title}</p>

            <dl className="mt-6 divide-y divide-white/8 rounded-xl bg-white/5 text-left text-[13.5px]">
              {[
                ['OS Name', 'Ubuntu 24.04.2 LTS'],
                ['GNOME Version', '46'],
                ['Windowing System', 'Wayland'],
                ['Role', profile.role],
                ['Location', profile.location],
                ['Projects', String(projects.length)],
                ['Technologies', String(skills.length)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between px-4 py-2.5">
                  <dt className="text-white/50">{label}</dt>
                  <dd className="text-white/85">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
