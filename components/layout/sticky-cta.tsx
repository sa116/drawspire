'use client';

import { BuyNowWithCodModal } from 'components/product/cod-form';
import { Product } from 'lib/shopify/types';
import { useEffect, useState } from 'react';

export function StickyCTA({ product }: { product?: Product }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroBtn = document.getElementById('hero-buy-btn');
    if (!heroBtn) {
      const onScroll = () => setVisible(window.scrollY > 500);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => window.removeEventListener('scroll', onScroll);
    }

    // Both conditions must be true: hero button off-screen AND user has scrolled past it
    let heroBtnOffScreen = false;
    let hasScrolled = false;
    const update = () => setVisible(heroBtnOffScreen && hasScrolled);

    const onScroll = () => {
      hasScrolled = window.scrollY > 80;
      update();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        heroBtnOffScreen = !entry!.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    observer.observe(heroBtn);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      data-sticky-cta
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white/95 px-4 pb-safe pt-3 shadow-[0_-4px_24px_rgba(0,0,0,0.10)] backdrop-blur-sm transition-transform duration-300 md:hidden ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-neutral-500">🛡️ 30-day returns · 📦 Ships in 24 hrs</span>
        <span className="shrink-0 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">50% OFF</span>
      </div>
      {product ? (
        <BuyNowWithCodModal product={product} />
      ) : (
        <a
          href="/#shop"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-600 to-accent-500 px-6 py-3.5 text-base font-extrabold text-white shadow-lg"
        >
          Order Now — Pay on Delivery
        </a>
      )}
      <div className="pb-2" />
    </div>
  );
}
