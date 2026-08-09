import { Suspense, useEffect, useState } from 'react';
import { apps, getApp } from '@/apps/registry';
import Wallpaper from '@/components/shell/Wallpaper';
import { profile } from '@/data/profile';

function StatusBar() {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
  );

  useEffect(() => {
    const timer = window.setInterval(
      () =>
        setTime(new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })),
      30_000,
    );
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="flex h-8 shrink-0 items-center justify-between bg-black px-4 text-[12.5px] text-white">
      <span>{time}</span>
      <span className="flex items-center gap-1.5 text-white/80">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
          <path d="M8 13.5l-1.6-1.9a2.4 2.4 0 013.2 0zM8 9.6c-1.2 0-2.3.5-3.1 1.3l-1.2-1.4A6.3 6.3 0 018 7.7c1.7 0 3.2.6 4.3 1.7l-1.2 1.4A4.4 4.4 0 008 9.6z" />
        </svg>
        <svg viewBox="0 0 24 12" className="h-3 w-6" fill="none" aria-hidden="true">
          <rect x="0.6" y="0.6" width="20" height="10.8" rx="2.4" stroke="currentColor" strokeWidth="1.2" />
          <rect x="2.4" y="2.4" width="14" height="7.2" rx="1.2" fill="currentColor" />
          <rect x="22" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" />
        </svg>
      </span>
    </div>
  );
}

/**
 * Phones get an Ubuntu Touch style launcher rather than shrunken desktop
 * windows: dragging and resizing floating panes on a touch screen is unusable.
 * The app components themselves are shared with the desktop shell.
 */
export default function MobileShell() {
  const [openAppId, setOpenAppId] = useState<string | null>(null);
  const app = openAppId ? getApp(openAppId) : null;

  useEffect(() => {
    if (!openAppId) return;
    const onPopState = () => setOpenAppId(null);
    window.history.pushState({ app: openAppId }, '');
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [openAppId]);

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-aubergine-dark">
      <StatusBar />

      {app ? (
        <>
          <div className="flex h-12 shrink-0 items-center gap-3 bg-yaru-headerbar px-3">
            <button
              onClick={() => window.history.back()}
              aria-label="Back to home screen"
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10 active:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <app.Icon className="h-6 w-6" />
            <span className="text-[15px] font-medium text-white">{app.title}</span>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden">
            <Suspense
              fallback={
                <div className="grid h-full place-items-center bg-yaru-window">
                  <div className="h-7 w-7 animate-spin rounded-full border-2 border-white/15 border-t-ubuntu-orange" />
                </div>
              }
            >
              <app.Component />
            </Suspense>
          </div>
        </>
      ) : (
        <div className="relative min-h-0 flex-1 overflow-y-auto">
          <Wallpaper />

          <div className="px-6 pb-10 pt-8">
            <div className="mb-8 flex items-center gap-3.5">
              <picture>
                <source srcSet="/assets/about_photo-thumb.webp" type="image/webp" />
                <img
                  src={profile.avatar}
                  alt=""
                  width={52}
                  height={52}
                  className="h-13 w-13 rounded-full border border-white/20 object-cover"
                  style={{ width: 52, height: 52 }}
                />
              </picture>
              <div>
                <p className="text-[17px] font-bold text-white">{profile.name}</p>
                <p className="text-[13px] text-white/60">{profile.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-x-3 gap-y-6">
              {apps.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setOpenAppId(item.id)}
                  aria-label={`${item.title} — ${item.description}`}
                  className="flex flex-col items-center gap-1.5 active:opacity-70"
                >
                  <item.Icon className="h-14 w-14" />
                  <span
                    className="line-clamp-2 text-center text-[11.5px] leading-tight text-white"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                  >
                    {item.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex h-6 shrink-0 items-center justify-center bg-black">
        <span className="h-1 w-28 rounded-full bg-white/35" />
      </div>
    </div>
  );
}
