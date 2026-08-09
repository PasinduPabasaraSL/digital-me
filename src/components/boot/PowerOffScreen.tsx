import { useEffect, useState } from 'react';
import { playSound } from '@/lib/sound';
import { useSystem } from '@/store/system';

/**
 * A genuinely dead screen: nothing else is mounted while the machine is off,
 * so the desktop, its windows and the shell are all torn down until the power
 * button is pressed again.
 */
export default function PowerOffScreen() {
  const powerOn = useSystem((state) => state.powerOn);
  const [pressed, setPressed] = useState(false);

  const start = () => {
    if (pressed) return;
    setPressed(true);
    playSound('powerOn');
    window.setTimeout(powerOn, 260);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') start();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pressed]);

  return (
    <div className="fixed inset-0 z-10000 flex flex-col items-center justify-center bg-black no-select">
      <button
        onClick={start}
        aria-label="Power on"
        className={`grid h-16 w-16 place-items-center rounded-full border-2 text-white/50 transition-all duration-200 hover:border-ubuntu-orange hover:text-ubuntu-orange ${
          pressed ? 'scale-90 border-ubuntu-orange text-ubuntu-orange' : 'border-white/25'
        }`}
      >
        <svg viewBox="0 0 16 16" className="h-7 w-7" fill="currentColor" aria-hidden="true">
          <path d="M7.2 1.8h1.6v6.4H7.2zM11.3 3.3l-1 1.3a4.6 4.6 0 11-4.6 0l-1-1.3a6.2 6.2 0 106.6 0z" />
        </svg>
      </button>

      <p className="mt-6 text-[13px] text-white/40">
        System powered off — press the button to start again
      </p>
    </div>
  );
}
