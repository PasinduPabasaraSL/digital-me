import { useState } from 'react';
import { apps, type AppDefinition } from '@/apps/registry';
import { UbuntuLogoMark } from '@/components/icons/AppIcons';
import { useSystem } from '@/store/system';
import { DOCK_W, TOP_BAR_H, useWindows } from '@/store/windows';

type HoverTarget = { id: string; title: string; description?: string; top: number };

function DockItem({
  app,
  hoveredId,
  onHover,
}: {
  app: AppDefinition;
  hoveredId: string | null;
  onHover: (target: HoverTarget | null) => void;
}) {
  const win = useWindows((state) => state.windows.find((item) => item.appId === app.id));
  const focusedId = useWindows((state) => state.focusedId);
  const toggleMinimize = useWindows((state) => state.toggleMinimize);
  const accent = useSystem((state) => state.accentValue());

  const isRunning = Boolean(win);
  const isActive = Boolean(win && focusedId === win.id && !win.minimized);

  const enter = (event: { currentTarget: HTMLElement }) => {
    const rect = event.currentTarget.getBoundingClientRect();
    onHover({
      id: app.id,
      title: app.title,
      description: app.description,
      top: rect.top + rect.height / 2 - TOP_BAR_H,
    });
  };

  return (
    <li className="relative flex justify-center">
      {isRunning && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 w-0.75 -translate-y-1/2 rounded-r-full transition-all duration-200"
          style={{ background: accent, height: isActive ? 20 : 8 }}
        />
      )}

      <button
        onClick={() => toggleMinimize(app.id)}
        onMouseEnter={enter}
        onMouseLeave={() => onHover(null)}
        onFocus={enter}
        onBlur={() => onHover(null)}
        aria-describedby={hoveredId === app.id ? 'dock-tooltip' : undefined}
        aria-label={`${isRunning ? app.title : `Open ${app.title}`} — ${app.description}${
          isRunning ? ' (running)' : ''
        }`}
        className={`grid h-12 w-12 place-items-center rounded-xl transition-all duration-150 hover:scale-105 active:scale-95 ${
          isActive ? 'bg-white/15' : 'hover:bg-white/10'
        }`}
      >
        <app.Icon className="h-11 w-11" />
      </button>
    </li>
  );
}

export default function Dock() {
  const [hovered, setHovered] = useState<HoverTarget | null>(null);
  const toggleActivities = useSystem((state) => state.toggleActivities);

  const main = apps.filter((app) => app.group === 'main');
  const system = apps.filter((app) => app.group === 'system');

  const hoverApps = (event: { currentTarget: HTMLElement }) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setHovered({
      id: '__apps',
      title: 'Show Applications',
      description: 'Every app, with search',
      top: rect.top + rect.height / 2 - TOP_BAR_H,
    });
  };

  return (
    <nav
      aria-label="Dock"
      // Width and offset come from the same constants the window manager uses
      // to lay out maximised windows, so the two can never drift apart.
      style={{ width: DOCK_W, top: TOP_BAR_H }}
      className="no-select fixed bottom-0 left-0 z-8000 flex flex-col bg-shell-dock backdrop-blur-md"
    >
      {/* Scrolls rather than overflowing when the viewport is short. */}
      <ul className="flex min-h-0 flex-1 flex-col items-center gap-1.5 overflow-y-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {main.map((app) => (
          <DockItem key={app.id} app={app} hoveredId={hovered?.id ?? null} onHover={setHovered} />
        ))}
      </ul>

      <div className="shrink-0 pb-2">
        <span aria-hidden="true" className="mx-auto mb-2 block h-px w-8 bg-white/20" />

        <ul className="flex flex-col items-center gap-1.5">
          {system.map((app) => (
            <DockItem key={app.id} app={app} hoveredId={hovered?.id ?? null} onHover={setHovered} />
          ))}
        </ul>

        <div className="mt-1.5 flex justify-center">
          <button
            onClick={() => toggleActivities()}
            onMouseEnter={hoverApps}
            onMouseLeave={() => setHovered(null)}
            onFocus={hoverApps}
            onBlur={() => setHovered(null)}
            aria-describedby={hovered?.id === '__apps' ? 'dock-tooltip' : undefined}
            aria-label="Show Applications"
            className="grid h-12 w-12 place-items-center rounded-xl text-white transition-all duration-150 hover:scale-105 hover:bg-white/10 active:scale-95"
          >
            <UbuntuLogoMark className="h-9 w-9" />
          </button>
        </div>
      </div>

      {/*
       * Rendered here rather than beside each icon because the icon list is a
       * scroll container, and `overflow-y-auto` clips on both axes — a tooltip
       * nested inside it is cut off at the edge of the dock.
       */}
      {hovered && (
        <span
          id="dock-tooltip"
          role="tooltip"
          style={{ top: hovered.top, left: DOCK_W - 10 }}
          className="pointer-events-none absolute z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-black/50 bg-yaru-popover px-2.5 py-1.5 shadow-xl"
        >
          <span className="block text-[12.5px] font-medium leading-tight text-white">
            {hovered.title}
          </span>
          {hovered.description && (
            <span className="mt-0.5 block text-[11.5px] leading-tight text-white/55">
              {hovered.description}
            </span>
          )}
        </span>
      )}
    </nav>
  );
}
