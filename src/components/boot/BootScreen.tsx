import { useEffect } from 'react';
import { UbuntuLogo } from '@/components/icons/AppIcons';
import { useSystem } from '@/store/system';

const BOOT_MS = 1900;

export default function BootScreen() {
  const setPhase = useSystem((state) => state.setPhase);

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase('lock'), BOOT_MS);
    const skip = () => setPhase('lock');
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, [setPhase]);

  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black no-select">
      <UbuntuLogo className="h-20 w-20" />
      <p className="mt-5 text-[26px] font-light tracking-wide text-white">ubuntu</p>

      <div className="mt-10 flex gap-2" aria-label="Starting up">
        {[0, 1, 2, 3, 4].map((index) => (
          <span
            key={index}
            className="h-2 w-2 rounded-full bg-ubuntu-orange"
            style={{
              animation: 'boot-pulse 1.2s ease-in-out infinite',
              animationDelay: `${index * 0.14}s`,
            }}
          />
        ))}
      </div>

      <p className="absolute bottom-8 text-[12px] text-white/35">Press any key to skip</p>

      <style>{`
        @keyframes boot-pulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40%           { opacity: 1;    transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
