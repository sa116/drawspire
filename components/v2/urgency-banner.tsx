'use client';

import { useEffect, useState } from 'react';

export function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 47, seconds: 33 });

  useEffect(() => {
    const tick = () => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) return { hours: 0, minutes: 0, seconds: 0 };
        return { hours, minutes, seconds };
      });
    };
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section className="bg-brand-800 px-4 py-4">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
            Limited Time Offer
          </span>
        </div>
        <div className="flex items-center gap-1 font-mono text-2xl font-black tracking-tight text-white">
          <span className="rounded bg-brand-900 px-2 py-1">{pad(timeLeft.hours)}</span>
          <span className="text-brand-400">:</span>
          <span className="rounded bg-brand-900 px-2 py-1">{pad(timeLeft.minutes)}</span>
          <span className="text-brand-400">:</span>
          <span className="rounded bg-brand-900 px-2 py-1">{pad(timeLeft.seconds)}</span>
        </div>
        <p className="text-[12px] text-brand-200">
          Only <span className="font-bold text-white">14 units</span> left at this price
        </p>
      </div>
    </section>
  );
}
