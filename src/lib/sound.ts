/**
 * A tiny synthesised output for the shell's feedback sounds. Tones are
 * generated with oscillators rather than shipped as audio files, so the whole
 * thing costs nothing to download.
 *
 * Browsers refuse to start an AudioContext before the user has interacted with
 * the page, so the context is created lazily on the first sound and every call
 * is a no-op until then.
 */

let context: AudioContext | null = null;
let master: GainNode | null = null;
let level = 0;

function ensureContext(): AudioContext | null {
  if (context) return context;
  if (typeof window === 'undefined') return null;

  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;

  context = new Ctor();
  master = context.createGain();
  master.gain.value = level;
  master.connect(context.destination);
  return context;
}

/**
 * Mirrors the quick-settings slider onto the real output gain. The level is
 * remembered even before the context exists, so this can be called on mount
 * without provoking Chrome's "AudioContext was not allowed to start" warning.
 */
export function setOutputGain(volume: number, muted: boolean) {
  // Perceived loudness tracks roughly the square of the slider position.
  level = muted ? 0 : volume * volume * 0.6;
  if (context && master) master.gain.setTargetAtTime(level, context.currentTime, 0.01);
}

type Tone = { frequency: number; duration: number; type?: OscillatorType };

const TONES = {
  /** The short pop GNOME plays while you drag the volume slider. */
  volume: { frequency: 660, duration: 0.09 },
  powerOff: { frequency: 300, duration: 0.32, type: 'triangle' },
  powerOn: { frequency: 520, duration: 0.28, type: 'triangle' },
} satisfies Record<string, Tone>;

export type SoundName = keyof typeof TONES;

export function playSound(name: SoundName) {
  const ctx = ensureContext();
  if (!ctx || !master) return;

  // A context created before a gesture starts suspended; resume is a no-op otherwise.
  if (ctx.state === 'suspended') void ctx.resume();

  const { frequency, duration, type } = TONES[name] as Tone;
  const now = ctx.currentTime;

  const oscillator = ctx.createOscillator();
  oscillator.type = type ?? 'sine';
  oscillator.frequency.setValueAtTime(frequency, now);
  if (name === 'powerOff') oscillator.frequency.exponentialRampToValueAtTime(120, now + duration);
  if (name === 'powerOn') oscillator.frequency.exponentialRampToValueAtTime(880, now + duration);

  // Envelope, otherwise the abrupt start and stop click audibly.
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0, now);
  envelope.gain.linearRampToValueAtTime(1, now + 0.012);
  envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(envelope).connect(master);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
}
