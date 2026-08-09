import { create } from 'zustand';

export type Geometry = { x: number; y: number; w: number; h: number };

export type WindowState = Geometry & {
  id: string;
  appId: string;
  z: number;
  minimized: boolean;
  maximized: boolean;
  /** Geometry to return to when un-maximizing or un-snapping. */
  restore: Geometry | null;
};

export const TOP_BAR_H = 32;
export const DOCK_W = 72;

type WindowStore = {
  windows: WindowState[];
  focusedId: string | null;
  nextZ: number;
  open: (appId: string, size?: { w: number; h: number }) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMinimize: (appId: string) => void;
  toggleMaximize: (id: string) => void;
  setGeometry: (id: string, geo: Partial<Geometry>) => void;
  snap: (id: string, edge: 'left' | 'right' | 'top') => void;
  closeAll: () => void;
};

function viewport() {
  return {
    w: typeof window === 'undefined' ? 1280 : window.innerWidth,
    h: typeof window === 'undefined' ? 800 : window.innerHeight,
  };
}

/**
 * Cascades each new window down-right from the workspace origin so stacked
 * windows stay individually clickable, wrapping once it runs out of room.
 */
function placeWindow(index: number, w: number, h: number): Geometry {
  const vp = viewport();
  const available = { w: vp.w - DOCK_W, h: vp.h - TOP_BAR_H };
  const width = Math.min(w, available.w - 32);
  const height = Math.min(h, available.h - 32);

  const step = 28;
  const offset = (index % 6) * step;
  const centeredX = DOCK_W + (available.w - width) / 2;
  const centeredY = TOP_BAR_H + (available.h - height) / 2;

  return {
    x: Math.max(DOCK_W + 8, Math.round(centeredX - step * 1.5 + offset)),
    y: Math.max(TOP_BAR_H + 8, Math.round(centeredY - step * 1.5 + offset)),
    w: Math.round(width),
    h: Math.round(height),
  };
}

export const useWindows = create<WindowStore>((set, get) => ({
  windows: [],
  focusedId: null,
  nextZ: 10,

  open: (appId, size) => {
    const existing = get().windows.find((win) => win.appId === appId);
    if (existing) {
      // Apps are singletons: re-opening raises and un-minimizes instead of duplicating.
      set((state) => ({
        windows: state.windows.map((win) =>
          win.id === existing.id
            ? { ...win, minimized: false, z: state.nextZ }
            : win,
        ),
        focusedId: existing.id,
        nextZ: state.nextZ + 1,
      }));
      return;
    }

    const { w = 880, h = 560 } = size ?? {};
    const geo = placeWindow(get().windows.length, w, h);

    set((state) => ({
      windows: [
        ...state.windows,
        {
          id: appId,
          appId,
          ...geo,
          z: state.nextZ,
          minimized: false,
          maximized: false,
          restore: null,
        },
      ],
      focusedId: appId,
      nextZ: state.nextZ + 1,
    }));
  },

  close: (id) =>
    set((state) => {
      const windows = state.windows.filter((win) => win.id !== id);
      const topmost = windows.reduce<WindowState | null>(
        (top, win) => (!win.minimized && (!top || win.z > top.z) ? win : top),
        null,
      );
      return { windows, focusedId: topmost?.id ?? null };
    }),

  focus: (id) =>
    set((state) => {
      if (state.focusedId === id) {
        const target = state.windows.find((win) => win.id === id);
        if (target && !target.minimized) return state;
      }
      return {
        windows: state.windows.map((win) =>
          win.id === id ? { ...win, z: state.nextZ, minimized: false } : win,
        ),
        focusedId: id,
        nextZ: state.nextZ + 1,
      };
    }),

  minimize: (id) =>
    set((state) => {
      const windows = state.windows.map((win) =>
        win.id === id ? { ...win, minimized: true } : win,
      );
      const topmost = windows.reduce<WindowState | null>(
        (top, win) => (!win.minimized && (!top || win.z > top.z) ? win : top),
        null,
      );
      return { windows, focusedId: topmost?.id ?? null };
    }),

  toggleMinimize: (appId) => {
    const target = get().windows.find((win) => win.appId === appId);
    if (!target) {
      get().open(appId);
      return;
    }
    if (target.minimized || get().focusedId !== target.id) {
      get().focus(target.id);
    } else {
      get().minimize(target.id);
    }
  },

  toggleMaximize: (id) =>
    set((state) => {
      const vp = viewport();
      return {
        windows: state.windows.map((win) => {
          if (win.id !== id) return win;
          if (win.maximized && win.restore) {
            return { ...win, ...win.restore, maximized: false, restore: null };
          }
          return {
            ...win,
            restore: { x: win.x, y: win.y, w: win.w, h: win.h },
            x: DOCK_W,
            y: TOP_BAR_H,
            w: vp.w - DOCK_W,
            h: vp.h - TOP_BAR_H,
            maximized: true,
          };
        }),
        focusedId: id,
      };
    }),

  setGeometry: (id, geo) =>
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, ...geo } : win,
      ),
    })),

  snap: (id, edge) =>
    set((state) => {
      const vp = viewport();
      const available = { w: vp.w - DOCK_W, h: vp.h - TOP_BAR_H };
      return {
        windows: state.windows.map((win) => {
          if (win.id !== id) return win;
          const restore = win.restore ?? { x: win.x, y: win.y, w: win.w, h: win.h };
          if (edge === 'top') {
            return {
              ...win,
              restore,
              x: DOCK_W,
              y: TOP_BAR_H,
              w: available.w,
              h: available.h,
              maximized: true,
            };
          }
          return {
            ...win,
            restore,
            x: edge === 'left' ? DOCK_W : DOCK_W + available.w / 2,
            y: TOP_BAR_H,
            w: available.w / 2,
            h: available.h,
            maximized: false,
          };
        }),
      };
    }),

  closeAll: () => set({ windows: [], focusedId: null }),
}));
