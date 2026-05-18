'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';

type SliderImage = { url: string; altText: string };

export function HeroSlider({ images }: { images: SliderImage[] }) {
  const [current, setCurrent] = useState(0);
  const total = images.length;
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const next = useCallback(() => setCurrent((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setCurrent((i) => (i - 1 + total) % total), [total]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0]!.clientX;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0]!.clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (touchStart.current === null || touchEnd.current === null) return;
    const distance = touchStart.current - touchEnd.current;
    if (Math.abs(distance) > 50) {
      if (distance > 0) next();
      else prev();
    }
    touchStart.current = null;
    touchEnd.current = null;
  }, [next, prev]);

  if (total === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100">
        <p className="font-medium text-brand-700">Product Image</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main image */}
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {images.map((img, i) => (
          <Image
            key={img.url}
            src={img.url}
            alt={img.altText}
            fill
            priority={i === 0}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`object-cover transition-opacity duration-500 ${i === current ? 'opacity-100' : 'opacity-0'}`}
            sizes="(min-width: 1024px) 50vw, 100vw"
          />
        ))}

        {/* Arrows */}
        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:bg-white"
            >
              <svg className="h-4 w-4 text-neutral-700" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur-sm hover:bg-white"
            >
              <svg className="h-4 w-4 text-neutral-700" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {total > 1 && (
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.url}
              onClick={() => setCurrent(i)}
              className={`relative aspect-square w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:w-14 ${i === current ? 'border-brand-600' : 'border-transparent opacity-50 hover:opacity-100'}`}
            >
              <Image
                src={img.url}
                alt={img.altText}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
