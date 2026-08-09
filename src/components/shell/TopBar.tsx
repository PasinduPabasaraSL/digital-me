import { useEffect, useRef, useState } from 'react';
import { GitHubIcon } from '@/components/icons/SocialIcons';
import QuickSettings, { PowerGlyph, VolumeGlyph } from '@/components/shell/QuickSettings';
import { socials } from '@/data/profile';
import { useBattery } from '@/hooks/useBattery';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useSystem } from '@/store/system';

const github = socials.find((social) => social.label === 'GitHub');

function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    // Tick on the minute boundary rather than every second.
    let timer: number;
    const schedule = () => {
      const delay = 60_000 - (Date.now() % 60_000);
      timer = window.setTimeout(() => {
        setNow(new Date());
        schedule();
      }, delay);
    };
    schedule();
    return () => window.clearTimeout(timer);
  }, []);

  return now;
}

function NetworkIcon({ online }: { online: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M8 13.5l-1.6-1.9a2.4 2.4 0 013.2 0zM8 9.6c-1.2 0-2.3.5-3.1 1.3l-1.2-1.4A6.3 6.3 0 018 7.7c1.7 0 3.2.6 4.3 1.7l-1.2 1.4A4.4 4.4 0 008 9.6zM8 5.4c-2.2 0-4.3.9-5.8 2.3L1 6.3A10.4 10.4 0 018 3.5c2.7 0 5.2 1 7 2.8l-1.2 1.4A8.4 8.4 0 008 5.4z" />
      {!online && <path d="M2.1 1.2l12.7 12.7-1 1L1.1 2.2z" />}
    </svg>
  );
}

function BatteryIcon({ level, charging }: { level: number; charging: boolean }) {
  return (
    <svg viewBox="0 0 24 16" className="h-4 w-5" aria-hidden="true">
      <rect
        x="0.75"
        y="3.75"
        width="19.5"
        height="8.5"
        rx="2.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M21.6 6.4h.6a1.6 1.6 0 010 3.2h-.6z" fill="currentColor" />
      <rect
        x="2.5"
        y="5.5"
        width={Math.max(1, 17 * Math.min(1, Math.max(0, level)))}
        height="5"
        rx="1"
        fill="currentColor"
      />
      {charging && <path d="M11.6 2.6l-3.4 6h2.4l-.6 4.8 3.4-6h-2.4z" fill="currentColor" />}
    </svg>
  );
}

export default function TopBar() {
  const clock = useClock();
  const toggleActivities = useSystem((state) => state.toggleActivities);
  const showActivities = useSystem((state) => state.showActivities);
  const muted = useSystem((state) => state.settings.muted);
  const volume = useSystem((state) => state.settings.volume);

  const network = useNetworkStatus();
  const battery = useBattery();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const date = clock.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const time = clock.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  const summary = [
    network.online ? 'Network connected' : 'Offline',
    muted ? 'Muted' : `Volume ${Math.round(volume * 100)}%`,
    battery ? `Battery ${Math.round(battery.level * 100)}%` : null,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <header className="fixed inset-x-0 top-0 z-9000 flex h-8 items-center justify-between bg-shell-panel px-3 text-[13px] text-white no-select">
      <button
        onClick={() => toggleActivities()}
        className={`rounded px-2 py-0.5 font-medium transition-colors hover:bg-white/15 ${
          showActivities ? 'bg-white/20' : ''
        }`}
        aria-pressed={showActivities}
      >
        Activities
      </button>

      <button
        className="rounded px-2 py-0.5 font-medium transition-colors hover:bg-white/15"
        aria-label={`${date} ${time}`}
      >
        {date}&nbsp;&nbsp;{time}
      </button>

      <div className="flex items-center gap-1">
        {github && (
          <a
            href={github.href}
            target="_blank"
            rel="noopener noreferrer"
            title={`GitHub — ${github.handle}`}
            aria-label={`GitHub profile: ${github.handle} (opens in a new tab)`}
            className="rounded px-2 py-1 text-white/85 transition-colors hover:bg-white/15 hover:text-white"
          >
            <GitHubIcon className="h-4 w-4" />
          </a>
        )}

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label={`System menu — ${summary}`}
            title={summary}
            className={`flex items-center gap-2 rounded px-2 py-0.5 transition-colors hover:bg-white/15 ${
              menuOpen ? 'bg-white/20' : ''
            }`}
          >
            <NetworkIcon online={network.online} />
            <VolumeGlyph muted={muted} className="h-4 w-4" />
            {battery && <BatteryIcon level={battery.level} charging={battery.charging} />}
            <PowerGlyph className="h-4 w-4" />
          </button>

          {menuOpen && <QuickSettings onClose={() => setMenuOpen(false)} />}
        </div>
      </div>
    </header>
  );
}
