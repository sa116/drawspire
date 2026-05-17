'use client';

import { useCallback, useRef, useState } from 'react';

interface CarouselImage {
  url: string;
  altText: string;
}

export function HeroCarousel({ images }: { images: CarouselImage[] }) {
  const [current, setCurrent] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDragging = useRef(false);

  const placeholders = [
    { bg: '#f0f0f0', label: 'Front View' },
    { bg: '#e8e8e8', label: 'Side View' },
    { bg: '#e0e0e0', label: 'Back View' },
    { bg: '#d8d8d8', label: 'On Body' },
  ];

  const slides = images.length > 0 ? images : placeholders.map((p) => ({ url: '', altText: p.label }));
  const total = slides.length;

  const goTo = useCallback((idx: number) => {
    setCurrent(Math.max(0, Math.min(idx, total - 1)));
  }, [total]);


  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]!.clientX;
    isDragging.current = true;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const diff = startX.current - e.changedTouches[0]!.clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(current + 1);
      else goTo(current - 1);
    }
    isDragging.current = false;
  };

  return (
    <div className="relative w-full overflow-hidden bg-neutral-100">
      <div
        ref={trackRef}
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, i) => (
          <div key={i} className="aspect-square w-full shrink-0">
            {slide.url ? (
              <img
                src={slide.url}
                alt={slide.altText || `Product view ${i + 1}`}
                className="h-full w-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ) : (
              <div
                className="flex h-full w-full items-center justify-center"
                style={{ backgroundColor: placeholders[i]?.bg ?? '#f0f0f0' }}
              >
                <span className="text-sm font-medium tracking-wide text-neutral-400 uppercase">
                  {placeholders[i]?.label ?? 'Product'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`View image ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-neutral-900' : 'w-1.5 bg-neutral-400'
            }`}
          />
        ))}
      </div>

      {/* Image counter */}
      <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
        {current + 1}/{total}
      </div>
    </div>
  );
}
