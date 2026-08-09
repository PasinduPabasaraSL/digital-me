import { create } from 'zustand';

export type BootPhase = 'boot' | 'lock' | 'desktop' | 'off';

/** The ten accent colours shipped in Ubuntu 24.04's Appearance settings. */
export const ACCENTS = [
  { id: 'orange', name: 'Orange', value: '#e95420' },
  { id: 'bark', name: 'Bark', value: '#787859' },
  { id: 'sage', name: 'Sage', value: '#657b69' },
  { id: 'olive', name: 'Olive', value: '#4b8501' },
  { id: 'viridian', name: 'Viridian', value: '#03875b' },
  { id: 'prussian', name: 'Prussian Green', value: '#308280' },
  { id: 'blue', name: 'Blue', value: '#0073e5' },
  { id: 'purple', name: 'Purple', value: '#7764d8' },
  { id: 'magenta', name: 'Magenta', value: '#b34cb3' },
  { id: 'red', name: 'Red', value: '#da3450' },
] as const;

export type AccentId = (typeof ACCENTS)[number]['id'];

export const WALLPAPERS = [
  { id: 'noble', name: 'Noble Numbat' },
  { id: 'aubergine', name: 'Aubergine' },
  { id: 'jammy', name: 'Warm Dawn' },
  { id: 'graphite', name: 'Graphite' },
] as const;

export type WallpaperId = (typeof WALLPAPERS)[number]['id'];

type Settings = {
  accent: AccentId;
  wallpaper: WallpaperId;
  dockPinned: boolean;
  reduceEffects: boolean;
  /** 0.3–1. Dims the screen the way GNOME's brightness slider does. */
  brightness: number;
  /** 0–1, applied to the WebAudio output gain. */
  volume: number;
  muted: boolean;
};

const SETTINGS_KEY = 'digital-me:settings';
const SESSION_KEY = 'digital-me:visited';

const defaultSettings: Settings = {
  accent: 'orange',
  wallpaper: 'noble',
  dockPinned: true,
  reduceEffects: false,
  brightness: 1,
  volume: 0.5,
  muted: false,
};

function loadSettings(): Settings {
  if (typeof localStorage === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

/** Returning visitors skip straight past the boot animation. */
function hasVisited(): boolean {
  if (typeof sessionStorage === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) === '1';
}

/** Forget the "already booted" marker so the next start replays the animation. */
function clearSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // Private browsing — nothing to clear.
  }
}

type SystemStore = {
  phase: BootPhase;
  settings: Settings;
  showActivities: boolean;
  setPhase: (phase: BootPhase) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  toggleActivities: (open?: boolean) => void;
  accentValue: () => string;
  /** Ends the session and returns to the greeter. */
  logOut: () => void;
  /** Replays the boot sequence from the beginning. */
  restart: () => void;
  powerOff: () => void;
  powerOn: () => void;
};

export const useSystem = create<SystemStore>((set, get) => ({
  phase: hasVisited() ? 'desktop' : 'boot',
  settings: loadSettings(),
  showActivities: false,

  setPhase: (phase) => {
    if (phase === 'desktop' && typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, '1');
    }
    set({ phase });
  },

  /*
   * The three power actions differ in where they land and how much they tear
   * down: logging out returns to the greeter, restarting replays the boot
   * animation, and powering off parks on a dead screen until it is woken.
   */
  logOut: () => {
    clearSession();
    set({ phase: 'lock', showActivities: false });
  },

  restart: () => {
    clearSession();
    set({ phase: 'boot', showActivities: false });
  },

  powerOff: () => {
    clearSession();
    set({ phase: 'off', showActivities: false });
  },

  powerOn: () => set({ phase: 'boot' }),

  updateSettings: (patch) =>
    set((state) => {
      const settings = { ...state.settings, ...patch };
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      } catch {
        // Private browsing — settings simply won't persist.
      }
      return { settings };
    }),

  toggleActivities: (open) =>
    set((state) => ({ showActivities: open ?? !state.showActivities })),

  accentValue: () =>
    ACCENTS.find((accent) => accent.id === get().settings.accent)?.value ??
    '#e95420',
}));
