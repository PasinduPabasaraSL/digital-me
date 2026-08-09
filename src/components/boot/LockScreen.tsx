import { useEffect, useState } from 'react';
import { profile } from '@/data/profile';
import { useSystem } from '@/store/system';

export default function LockScreen() {
  const setPhase = useSystem((state) => state.setPhase);
  const [now, setNow] = useState(() => new Date());
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const unlock = () => {
    setLifted(true);
    window.setTimeout(() => setPhase('desktop'), 320);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') unlock();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={unlock}
      className="fixed inset-0 z-[9500] flex cursor-pointer flex-col items-center justify-center bg-aubergine-dark/85 backdrop-blur-2xl transition-all duration-300 no-select"
      style={{
        transform: lifted ? 'translateY(-100%)' : 'translateY(0)',
        opacity: lifted ? 0 : 1,
      }}
    >
      <p className="text-[86px] font-light leading-none text-white tabular-nums">
        {now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
      </p>
      <p className="mt-2 text-[19px] text-white/75">
        {now.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <div className="mt-16 flex flex-col items-center">
        <img
          src="/assets/about_photo-thumb.webp"
          alt=""
          width={88}
          height={88}
          className="h-22 w-22 rounded-full border-2 border-white/25 object-cover"
          style={{ width: 88, height: 88 }}
        />
        <p className="mt-3 text-[19px] font-medium text-white">{profile.name}</p>

        <div className="mt-5 w-64 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-center text-[14px] text-white/60">
          Click anywhere or press Enter
        </div>
      </div>
    </div>
  );
}
