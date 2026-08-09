import { Suspense, useCallback, useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { getApp } from '@/apps/registry';
import {
  DOCK_W,
  TOP_BAR_H,
  useWindows,
  type Geometry,
  type WindowState,
} from '@/store/windows';

const MIN_W = 380;
const MIN_H = 260;
const SNAP_ZONE = 12;

type ResizeEdge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const RESIZE_HANDLES: { edge: ResizeEdge; className: string }[] = [
  { edge: 'n', className: 'top-0 left-3 right-3 h-1.5 cursor-ns-resize' },
  { edge: 's', className: 'bottom-0 left-3 right-3 h-1.5 cursor-ns-resize' },
  { edge: 'w', className: 'left-0 top-3 bottom-3 w-1.5 cursor-ew-resize' },
  { edge: 'e', className: 'right-0 top-3 bottom-3 w-1.5 cursor-ew-resize' },
  { edge: 'nw', className: 'top-0 left-0 w-3 h-3 cursor-nwse-resize' },
  { edge: 'ne', className: 'top-0 right-0 w-3 h-3 cursor-nesw-resize' },
  { edge: 'sw', className: 'bottom-0 left-0 w-3 h-3 cursor-nesw-resize' },
  { edge: 'se', className: 'bottom-0 right-0 w-3 h-3 cursor-nwse-resize' },
];

function WindowFallback() {
  return (
    <div className="flex h-full items-center justify-center bg-yaru-window">
      <div
        className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-ubuntu-orange"
        role="status"
        aria-label="Loading application"
      />
    </div>
  );
}

export default function Window({ win }: { win: WindowState }) {
  const app = getApp(win.appId);
  // Selected individually: subscribing to the whole store would re-render every
  // open window whenever any one of them moves.
  const focus = useWindows((state) => state.focus);
  const close = useWindows((state) => state.close);
  const minimize = useWindows((state) => state.minimize);
  const toggleMaximize = useWindows((state) => state.toggleMaximize);
  const setGeometry = useWindows((state) => state.setGeometry);
  const snap = useWindows((state) => state.snap);
  const focusedId = useWindows((state) => state.focusedId);
  const ref = useRef<HTMLDivElement>(null);
  const snapHintRef = useRef<HTMLDivElement>(null);

  const isFocused = focusedId === win.id;

  /*
   * Drag and resize write straight to the DOM node and only commit to the
   * store on release. Going through React on every pointermove would re-render
   * every open window at pointer frequency.
   */
  const beginDrag = useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      if (event.button !== 0) return;
      const node = ref.current;
      if (!node) return;

      focus(win.id);
      event.currentTarget.setPointerCapture(event.pointerId);

      const startX = event.clientX;
      const startY = event.clientY;
      const origin: Geometry = win.maximized && win.restore
        ? { ...win.restore, x: Math.max(DOCK_W, startX - win.restore.w / 2), y: TOP_BAR_H + 8 }
        : { x: win.x, y: win.y, w: win.w, h: win.h };

      let pending: Geometry = origin;
      let pendingSnap: 'left' | 'right' | 'top' | null = null;
      let unmaximized = false;

      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        // Dragging a maximized window restores it under the cursor first.
        if (win.maximized && !unmaximized && Math.hypot(dx, dy) > 8) {
          unmaximized = true;
          node.style.width = `${origin.w}px`;
          node.style.height = `${origin.h}px`;
        }

        pending = {
          ...pending,
          x: Math.max(DOCK_W - origin.w + 80, origin.x + dx),
          y: Math.max(TOP_BAR_H, origin.y + dy),
        };
        node.style.left = `${pending.x}px`;
        node.style.top = `${pending.y}px`;

        pendingSnap =
          ev.clientY <= TOP_BAR_H + SNAP_ZONE
            ? 'top'
            : ev.clientX <= DOCK_W + SNAP_ZONE
              ? 'left'
              : ev.clientX >= window.innerWidth - SNAP_ZONE
                ? 'right'
                : null;

        const hint = snapHintRef.current;
        if (hint) {
          hint.style.opacity = pendingSnap ? '1' : '0';
          if (pendingSnap === 'left') {
            hint.style.inset = `${TOP_BAR_H}px auto 0 ${DOCK_W}px`;
            hint.style.width = `${(window.innerWidth - DOCK_W) / 2}px`;
          } else if (pendingSnap === 'right') {
            hint.style.inset = `${TOP_BAR_H}px 0 0 auto`;
            hint.style.width = `${(window.innerWidth - DOCK_W) / 2}px`;
          } else if (pendingSnap === 'top') {
            hint.style.inset = `${TOP_BAR_H}px 0 0 ${DOCK_W}px`;
            hint.style.width = 'auto';
          }
        }
      };

      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        if (snapHintRef.current) snapHintRef.current.style.opacity = '0';

        if (pendingSnap) {
          setGeometry(win.id, pending);
          snap(win.id, pendingSnap);
        } else {
          setGeometry(win.id, {
            ...pending,
            ...(unmaximized ? { w: origin.w, h: origin.h } : {}),
          });
          if (unmaximized) {
            useWindows.setState((state) => ({
              windows: state.windows.map((item) =>
                item.id === win.id ? { ...item, maximized: false, restore: null } : item,
              ),
            }));
          }
        }
      };

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [focus, setGeometry, snap, win],
  );

  const beginResize = useCallback(
    (event: ReactPointerEvent<HTMLElement>, edge: ResizeEdge) => {
      if (event.button !== 0) return;
      const node = ref.current;
      if (!node) return;

      event.stopPropagation();
      focus(win.id);

      const startX = event.clientX;
      const startY = event.clientY;
      const origin: Geometry = { x: win.x, y: win.y, w: win.w, h: win.h };
      let pending = origin;

      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        let { x, y, w, h } = origin;

        if (edge.includes('e')) w = Math.max(MIN_W, origin.w + dx);
        if (edge.includes('s')) h = Math.max(MIN_H, origin.h + dy);
        if (edge.includes('w')) {
          w = Math.max(MIN_W, origin.w - dx);
          x = origin.x + (origin.w - w);
        }
        if (edge.includes('n')) {
          h = Math.max(MIN_H, origin.h - dy);
          y = Math.max(TOP_BAR_H, origin.y + (origin.h - h));
        }

        pending = { x, y, w, h };
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.width = `${w}px`;
        node.style.height = `${h}px`;
      };

      const up = () => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        setGeometry(win.id, pending);
      };

      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    },
    [focus, setGeometry, win],
  );

  if (!app) return null;

  const { Component, title, Icon } = app;

  return (
    <>
      <div
        ref={snapHintRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[9998] rounded-lg border-2 border-white/40 bg-white/15 opacity-0 transition-opacity duration-100"
      />

      <div
        ref={ref}
        role="dialog"
        aria-label={title}
        onPointerDown={() => focus(win.id)}
        style={{
          left: win.x,
          top: win.y,
          width: win.w,
          height: win.h,
          zIndex: win.z,
          display: win.minimized ? 'none' : undefined,
        }}
        className={`fixed flex flex-col overflow-hidden bg-yaru-window ${
          win.maximized ? 'rounded-none' : 'rounded-t-[12px] rounded-b-[12px]'
        } ${isFocused ? 'window-shadow' : 'window-shadow-inactive'}`}
      >
        <header
          onPointerDown={beginDrag}
          onDoubleClick={() => toggleMaximize(win.id)}
          className={`no-select flex h-[46px] shrink-0 items-center gap-2 px-3 ${
            isFocused ? 'bg-yaru-headerbar' : 'bg-yaru-window'
          } border-b border-black/40`}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span
            className={`flex-1 truncate text-center text-[13px] font-bold tracking-tight ${
              isFocused ? 'text-white' : 'text-white/45'
            }`}
          >
            {title}
          </span>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => minimize(win.id)}
              aria-label={`Minimize ${title}`}
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 active:bg-white/25"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M4 8h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => toggleMaximize(win.id)}
              aria-label={win.maximized ? `Restore ${title}` : `Maximize ${title}`}
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 active:bg-white/25"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <rect
                  x="4.2"
                  y="4.2"
                  width="7.6"
                  height="7.6"
                  rx="1.4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
            <button
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => close(win.id)}
              aria-label={`Close ${title}`}
              className="grid h-6 w-6 place-items-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-[#c01c28] hover:text-white active:bg-[#a4161f]"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <path
                  d="M4.6 4.6l6.8 6.8M11.4 4.6l-6.8 6.8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <Suspense fallback={<WindowFallback />}>
            <Component />
          </Suspense>
        </div>

        {!win.maximized &&
          RESIZE_HANDLES.map(({ edge, className }) => (
            <div
              key={edge}
              onPointerDown={(event) => beginResize(event, edge)}
              className={`absolute z-10 ${className}`}
            />
          ))}
      </div>
    </>
  );
}
