import { BuyNowWithCodModal } from 'components/product/cod-form';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';

export function FinalCTA({ product }: { product?: Product }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-neutral-950 py-12 sm:py-20">
      <div className="absolute inset-0 bg-grain opacity-20" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 top-0 h-96 w-96 rounded-full bg-accent-500/15 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-400/10 blur-2xl" />

      <div className="relative mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-8">
        {/* Urgency badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-4 py-2 text-sm font-semibold text-orange-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-400" />
          </span>
          Only 47 left at this price — 50% OFF ends soon
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Give your child<br />
          <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
            the gift of drawing.
          </span>
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-lg text-brand-200/80">
          5,000+ Indian families already said yes. Free shipping, pay on delivery, 30-day money-back guarantee. Zero risk on your part.
        </p>

        {/* Risk reversal */}
        <div className="mx-auto mt-6 max-w-sm rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-brand-200/70 backdrop-blur-sm">
          <p className="font-semibold text-white">Our promise to you:</p>
          <p className="mt-1">
            If your child doesn&apos;t love it, return it within 30 days for a <span className="font-semibold text-white">full refund — no questions asked</span>, no return shipping needed.
          </p>
        </div>

        <div className="mt-8 mx-auto max-w-xs">
          {product ? (
            <Suspense fallback={null}>
              <BuyNowWithCodModal product={product} variant="light" />
            </Suspense>
          ) : (
            <a
              href="/#shop"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-extrabold text-brand-800 shadow-2xl transition-all hover:bg-brand-50"
            >
              Order Now — Pay on Delivery
            </a>
          )}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-brand-300/70">
          <span>🚚 Free shipping</span>
          <span>💳 Pay on delivery</span>
          <span>🔁 30-day returns</span>
          <span>📦 Ships in 24 hrs</span>
        </div>
      </div>
    </section>
  );
}
