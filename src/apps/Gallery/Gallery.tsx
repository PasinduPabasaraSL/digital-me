import { useCallback, useEffect, useState } from 'react';
import { gallery } from '@/data/gallery';

export default function Gallery() {
  const [index, setIndex] = useState<number | null>(null);
  const active = index === null ? null : gallery[index];

  const step = useCallback((delta: number) => {
    setIndex((current) =>
      current === null ? null : (current + delta + gallery.length) % gallery.length,
    );
  }, []);

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIndex(null);
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, step]);

  return (
    <div className="relative h-full bg-yaru-window text-white">
      <div className="h-full overflow-y-auto p-4">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-3">
          {gallery.map((item, itemIndex) => (
            <button
              key={item.id}
              onClick={() => setIndex(itemIndex)}
              className="group relative overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/10 transition-transform hover:scale-[1.02] hover:ring-ubuntu-orange/60"
            >
              <picture>
                <source srcSet={`${item.base}-thumb.webp`} type="image/webp" />
                <img
                  src={item.fallback}
                  alt={item.caption}
                  loading="lazy"
                  decoding="async"
                  width={320}
                  height={240}
                  className="aspect-[4/3] w-full object-cover"
                />
              </picture>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2.5 text-left text-[12.5px] font-medium leading-snug opacity-0 transition-opacity group-hover:opacity-100">
                {item.caption}
              </span>
            </button>
          ))}
        </div>

        <p className="mt-4 text-center text-[12px] text-white/35">
          {gallery.length} events · click any photo to enlarge
        </p>
      </div>

      {active && (
        <div
          className="absolute inset-0 z-20 flex flex-col bg-black/92 backdrop-blur-sm"
          onClick={() => setIndex(null)}
        >
          <div className="flex items-center justify-between gap-3 p-3">
            <span className="text-[13px] text-white/60">
              {(index ?? 0) + 1} / {gallery.length}
            </span>
            <button
              onClick={() => setIndex(null)}
              aria-label="Close preview"
              className="grid h-7 w-7 place-items-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M4.6 4.6l6.8 6.8M11.4 4.6l-6.8 6.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div
            className="relative flex min-h-0 flex-1 items-center justify-center px-12"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className="absolute left-2 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl hover:bg-white/20"
            >
              ‹
            </button>

            <picture>
              <source srcSet={`${active.base}-full.webp`} type="image/webp" />
              <img
                src={active.fallback}
                alt={active.caption}
                decoding="async"
                className="max-h-full max-w-full rounded-lg object-contain"
              />
            </picture>

            <button
              onClick={() => step(1)}
              aria-label="Next photo"
              className="absolute right-2 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-xl hover:bg-white/20"
            >
              ›
            </button>
          </div>

          <div className="p-4 text-center" onClick={(event) => event.stopPropagation()}>
            <p className="text-[15px] font-medium">{active.caption}</p>
            <a
              href={active.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-[13px] text-ubuntu-orange underline-offset-2 hover:underline"
            >
              View the LinkedIn post →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
