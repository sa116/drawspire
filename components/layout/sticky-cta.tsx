'use client';

import { BuyNowWithCodModal } from 'components/product/cod-form';
import { Product } from 'lib/shopify/types';
import { useEffect, useState } from 'react';

export function StickyCTA({ product }: { product?: Product }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      data-sticky-cta
      className={`fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-sm transition-transform duration-300 md:hidden ${visible ? 'translate-y-0' : 'translate-y-full'}`}
    >
      {product ? (
        <BuyNowWithCodModal product={product} />
      ) : (
        <a
          href="/#shop"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-6 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-brand-800"
        >
          Buy Now — Free Shipping
        </a>
      )}
    </div>
  );
}
