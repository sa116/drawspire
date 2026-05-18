"use client";

import { useEffect, useState } from "react";

export function AnnouncementBar() {
  const [soldToday, setSoldToday] = useState(127);

  useEffect(() => {
    const interval = setInterval(() => {
      setSoldToday((n) => n + Math.floor(Math.random() * 2));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const content = (
    <>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-semibold">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-400" />
        </span>
        {soldToday} orders today
      </span>
      <span className="text-brand-400">·</span>
      <span className="whitespace-nowrap">
        <span className="font-bold text-accent-300">50% OFF</span> — Limited Stock
      </span>
      <span className="text-brand-400">·</span>
      <span className="whitespace-nowrap">📦 Ships in 24 hrs</span>
      <span className="text-brand-400">·</span>
      <span className="whitespace-nowrap">🛡️ 30-Day Money Back</span>
    </>
  );

  return (
    <div data-announcement className="overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 py-2.5 text-sm font-medium text-brand-100">
      <div className="flex w-max animate-marquee sm:w-auto sm:animate-none sm:justify-center">
        <p className="flex shrink-0 items-center gap-5 px-6 sm:gap-4 sm:px-0">
          {content}
        </p>
        <p className="flex shrink-0 items-center gap-5 px-6 sm:hidden" aria-hidden="true">
          {content}
        </p>
      </div>
    </div>
  );
}
