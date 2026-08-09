import { lazy, Suspense, useEffect } from 'react';
import BootScreen from '@/components/boot/BootScreen';
import LockScreen from '@/components/boot/LockScreen';
import PowerOffScreen from '@/components/boot/PowerOffScreen';
import Activities from '@/components/shell/Activities';
import Dock from '@/components/shell/Dock';
import TopBar from '@/components/shell/TopBar';
import Wallpaper from '@/components/shell/Wallpaper';
import WindowLayer from '@/components/wm/WindowLayer';
import { useIsMobile } from '@/hooks/useIsMobile';
import { setOutputGain } from '@/lib/sound';
import { useSystem } from '@/store/system';

const MobileShell = lazy(() => import('@/components/mobile/MobileShell'));

/**
 * Dimming with an overlay rather than a `filter` on the shell, because a
 * filtered ancestor becomes the containing block for its fixed-position
 * descendants and would reparent every window, the dock and the top bar.
 */
function BrightnessOverlay({ brightness }: { brightness: number }) {
  if (brightness >= 1) return null;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10500 bg-black"
      style={{ opacity: 1 - brightness }}
    />
  );
}

export default function App() {
  const phase = useSystem((state) => state.phase);
  const accent = useSystem((state) => state.accentValue());
  const brightness = useSystem((state) => state.settings.brightness);
  const volume = useSystem((state) => state.settings.volume);
  const muted = useSystem((state) => state.settings.muted);
  const isMobile = useIsMobile();

  /*
   * Overriding the theme token itself means every `*-ubuntu-orange` utility
   * across the app follows the chosen accent without prop drilling.
   */
  useEffect(() => {
    document.documentElement.style.setProperty('--color-ubuntu-orange', accent);
  }, [accent]);

  useEffect(() => {
    setOutputGain(volume, muted);
  }, [volume, muted]);

  return (
    <>
      {phase === 'boot' && <BootScreen />}
      {phase === 'lock' && <LockScreen />}
      {phase === 'off' && <PowerOffScreen />}

      {phase === 'desktop' &&
        (isMobile ? (
          <Suspense fallback={<div className="fixed inset-0 bg-aubergine-dark" />}>
            <MobileShell />
          </Suspense>
        ) : (
          <main className="relative h-full w-full overflow-hidden">
            <Wallpaper />
            <TopBar />
            <Dock />
            <WindowLayer />
            <Activities />
          </main>
        ))}

      <BrightnessOverlay brightness={brightness} />
    </>
  );
}
