import { useSystem, type WallpaperId } from '@/store/system';

/*
 * Wallpapers are pure CSS gradients rather than bitmaps: Ubuntu's shipped
 * wallpapers are ~2 MB each and are not ours to redistribute, and a gradient
 * paints on the first frame with zero network cost.
 */
const BACKDROPS: Record<WallpaperId, string> = {
  noble: `
    radial-gradient(120% 90% at 78% 18%, rgba(233, 84, 32, 0.55) 0%, transparent 55%),
    radial-gradient(90% 80% at 18% 82%, rgba(119, 33, 111, 0.75) 0%, transparent 60%),
    radial-gradient(70% 60% at 50% 50%, rgba(180, 60, 120, 0.30) 0%, transparent 70%),
    linear-gradient(160deg, #2c001e 0%, #3d0b2c 45%, #1c0413 100%)
  `,
  aubergine: `
    radial-gradient(100% 80% at 30% 20%, rgba(119, 41, 83, 0.85) 0%, transparent 60%),
    linear-gradient(180deg, #2c001e 0%, #4a1436 60%, #17000f 100%)
  `,
  jammy: `
    radial-gradient(110% 85% at 70% 25%, rgba(233, 84, 32, 0.7) 0%, transparent 58%),
    radial-gradient(80% 70% at 20% 80%, rgba(244, 123, 86, 0.35) 0%, transparent 62%),
    linear-gradient(165deg, #3a1108 0%, #5e2750 55%, #23060f 100%)
  `,
  graphite: `
    radial-gradient(100% 80% at 50% 15%, rgba(90, 90, 90, 0.55) 0%, transparent 60%),
    linear-gradient(180deg, #2b2b2b 0%, #1b1b1b 60%, #101010 100%)
  `,
};

export default function Wallpaper() {
  const wallpaper = useSystem((state) => state.settings.wallpaper);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10"
      style={{ background: BACKDROPS[wallpaper], backgroundBlendMode: 'screen' }}
    >
      {/* Faint concentric arcs echoing the Circle of Friends watermark. */}
      <svg
        className="absolute right-[8%] top-1/2 h-[70vmin] w-[70vmin] -translate-y-1/2 opacity-[0.07]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="45" stroke="#fff" strokeWidth="1.5" />
        <circle cx="100" cy="100" r="70" stroke="#fff" strokeWidth="1" />
        <circle cx="100" cy="100" r="95" stroke="#fff" strokeWidth="0.6" />
        <circle cx="100" cy="30" r="10" fill="#fff" />
        <circle cx="39" cy="135" r="10" fill="#fff" />
        <circle cx="161" cy="135" r="10" fill="#fff" />
      </svg>
    </div>
  );
}
