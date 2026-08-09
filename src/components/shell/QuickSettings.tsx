import type { ReactNode } from 'react';
import { useBattery } from '@/hooks/useBattery';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { playSound } from '@/lib/sound';
import { ACCENTS, useSystem } from '@/store/system';
import { useWindows } from '@/store/windows';

type IconProps = { className?: string };

function BrightnessIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="8" cy="8" r="3.1" />
      <path d="M7.3 0h1.4v2.6H7.3zm0 13.4h1.4V16H7.3zM0 7.3h2.6v1.4H0zm13.4 0H16v1.4h-2.6zM2.3 3.3l1-1 1.9 1.8-1 1zm8.5 8.5l1-1 1.9 1.8-1 1zm1.9-9.5l1 1-1.8 1.9-1-1zM3.2 10.8l1 1-1.8 1.9-1-1z" />
    </svg>
  );
}

export function VolumeGlyph({ muted, className }: IconProps & { muted: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8.5 2.5v11L5 10.8H2.6V5.2H5z" />
      {muted ? (
        <path d="M10.4 6.3l.9-.9 3.4 3.4-.9.9zm4.3 0l.9.9-3.4 3.4-.9-.9z" />
      ) : (
        <path d="M11 5.6a3.4 3.4 0 010 4.8l-1-1a2 2 0 000-2.8zM12.7 3.6a5.9 5.9 0 010 8.8l-1-1.1a4.4 4.4 0 000-6.6z" />
      )}
    </svg>
  );
}

function SettingsGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.4A2.6 2.6 0 108 10.6 2.6 2.6 0 008 5.4zm0 4A1.4 1.4 0 118 6.6a1.4 1.4 0 010 2.8z" />
      <path d="M13.3 8c0-.3 0-.6-.1-.9l1.4-1-1.5-2.6-1.6.6a5.4 5.4 0 00-1.5-.9L9.7 1.5H6.3L6 3.2c-.5.2-1 .5-1.5.9l-1.6-.6-1.5 2.6 1.4 1a5.6 5.6 0 000 1.8l-1.4 1 1.5 2.6 1.6-.6c.5.4 1 .7 1.5.9l.3 1.7h3.4l.3-1.7c.5-.2 1-.5 1.5-.9l1.6.6 1.5-2.6-1.4-1c.1-.3.1-.6.1-.9z" />
    </svg>
  );
}

function LockGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4.4 6.6V5a3.6 3.6 0 017.2 0v1.6H13V14H3V6.6zM8 2.6A2.4 2.4 0 005.6 5v1.6h4.8V5A2.4 2.4 0 008 2.6z" />
    </svg>
  );
}

function LogOutGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M9 2v1.6H4.6v8.8H9V14H3V2z" />
      <path d="M11.2 4.6L10 5.8l1.6 1.6h-5v1.2h5L10 10.2l1.2 1.2L15 8z" />
    </svg>
  );
}

function RestartGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 2.6c1.6 0 3 .7 3.9 1.9l-1.6 1.6H15V1.4l-1.7 1.7A6.6 6.6 0 001.5 7h1.6A5 5 0 018 2.6zm0 10.8a5 5 0 01-3.9-1.9l1.6-1.6H1v4.7l1.7-1.7A6.6 6.6 0 0014.5 9h-1.6A5 5 0 018 13.4z" />
    </svg>
  );
}

export function PowerGlyph({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden="true">
      <path d="M7.2 1.8h1.6v6.4H7.2zM11.3 3.3l-1 1.3a4.6 4.6 0 11-4.6 0l-1-1.3a6.2 6.2 0 106.6 0z" />
    </svg>
  );
}

function Slider({
  control,
  label,
  value,
  min,
  max,
  onChange,
}: {
  control: ReactNode;
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const filled = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-2 px-1 py-1.5">
      <span className="shrink-0">{control}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={0.01}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(Number(event.target.value))}
        className="shell-slider w-full"
        style={
          {
            '--filled': `${filled}%`,
          } as React.CSSProperties
        }
      />
    </div>
  );
}

function ActionRow({
  icon,
  label,
  hint,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  hint?: string;
  onClick: () => void;
}) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-[13px] transition-colors hover:bg-white/10"
    >
      <span className="text-white/70">{icon}</span>
      <span className="flex-1">{label}</span>
      {hint && <span className="text-[11.5px] text-white/40">{hint}</span>}
    </button>
  );
}

export default function QuickSettings({ onClose }: { onClose: () => void }) {
  const settings = useSystem((state) => state.settings);
  const updateSettings = useSystem((state) => state.updateSettings);
  const setPhase = useSystem((state) => state.setPhase);
  const logOut = useSystem((state) => state.logOut);
  const restart = useSystem((state) => state.restart);
  const powerOff = useSystem((state) => state.powerOff);
  const openWindow = useWindows((state) => state.open);
  const closeAll = useWindows((state) => state.closeAll);
  const openCount = useWindows((state) => state.windows.length);

  const network = useNetworkStatus();
  const battery = useBattery();

  const run = (action: () => void) => {
    onClose();
    action();
  };

  return (
    <div
      role="menu"
      className="absolute right-0 top-9 w-72 rounded-[12px] border border-black/50 bg-yaru-popover p-3 shadow-2xl"
    >
      <div className="flex items-center justify-between px-1 text-[12.5px]">
        <span className="text-white/60">Network</span>
        <span className={network.online ? 'text-white/85' : 'text-terminal-red'}>
          {network.online
            ? `Connected${network.effectiveType ? ` · ${network.effectiveType.toUpperCase()}` : ''}`
            : 'Offline'}
        </span>
      </div>

      {battery && (
        <div className="mt-1 flex items-center justify-between px-1 text-[12.5px]">
          <span className="text-white/60">Battery</span>
          <span className="text-white/85">
            {Math.round(battery.level * 100)}%{battery.charging ? ' · Charging' : ''}
          </span>
        </div>
      )}

      <div className="my-2 h-px bg-white/10" />

      <Slider
        label="Screen brightness"
        control={<BrightnessIcon className="h-4 w-4 text-white/70" />}
        value={settings.brightness}
        min={0.3}
        max={1}
        onChange={(brightness) => updateSettings({ brightness })}
      />

      <Slider
        label="Volume"
        control={
          <button
            onClick={() => {
              const muted = !settings.muted;
              updateSettings({ muted });
              if (!muted) playSound('volume');
            }}
            aria-pressed={settings.muted}
            aria-label={settings.muted ? 'Unmute' : 'Mute'}
            title={settings.muted ? 'Unmute' : 'Mute'}
            className="rounded p-0.5 text-white/70 transition-colors hover:text-white"
          >
            <VolumeGlyph muted={settings.muted} className="h-4 w-4" />
          </button>
        }
        value={settings.muted ? 0 : settings.volume}
        min={0}
        max={1}
        onChange={(volume) => {
          updateSettings({ volume, muted: false });
          playSound('volume');
        }}
      />

      <div className="my-2 h-px bg-white/10" />

      <p className="mb-2 px-1 text-[11px] font-medium uppercase tracking-wide text-white/50">
        Accent colour
      </p>
      <div className="grid grid-cols-5 gap-2 px-1">
        {ACCENTS.map((accent) => (
          <button
            key={accent.id}
            onClick={() => updateSettings({ accent: accent.id })}
            aria-label={accent.name}
            aria-pressed={settings.accent === accent.id}
            title={accent.name}
            className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${
              settings.accent === accent.id
                ? 'ring-2 ring-white ring-offset-2 ring-offset-yaru-popover'
                : ''
            }`}
            style={{ background: accent.value }}
          />
        ))}
      </div>

      <div className="my-2 h-px bg-white/10" />

      <ActionRow
        icon={<SettingsGlyph className="h-4 w-4" />}
        label="Settings"
        onClick={() => run(() => openWindow('settings'))}
      />
      <ActionRow
        icon={<LockGlyph className="h-4 w-4" />}
        label="Lock Screen"
        onClick={() => run(() => setPhase('lock'))}
      />
      <ActionRow
        icon={<LogOutGlyph className="h-4 w-4" />}
        label="Log Out"
        hint={openCount ? `${openCount} open` : undefined}
        onClick={() =>
          run(() => {
            closeAll();
            logOut();
          })
        }
      />
      <ActionRow
        icon={<RestartGlyph className="h-4 w-4" />}
        label="Restart"
        onClick={() =>
          run(() => {
            closeAll();
            restart();
          })
        }
      />
      <ActionRow
        icon={<PowerGlyph className="h-4 w-4" />}
        label="Power Off"
        onClick={() =>
          run(() => {
            playSound('powerOff');
            closeAll();
            powerOff();
          })
        }
      />
    </div>
  );
}
