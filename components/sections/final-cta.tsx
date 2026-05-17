import { BuyNowWithCodModal } from 'components/product/cod-form';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';

export function FinalCTA({ product }: { product?: Product }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-neutral-900 py-16 sm:py-24">
      <div className="absolute inset-0 bg-grain opacity-30" />
      <div className="absolute -left-32 bottom-0 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl" />
      <div className="absolute -right-32 top-0 h-64 w-64 rounded-full bg-accent-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-brand-300">
          Gift the joy of drawing
        </p>
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          Your child&apos;s next favourite toy.{' '}
          <span className="bg-gradient-to-r from-brand-300 to-brand-400 bg-clip-text text-transparent">
            Order today.
          </span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-brand-200/70">
          Join thousands of happy parents. Free shipping, 30-day guarantee, zero risk.
        </p>

        <div className="mt-10">
          {product ? (
            <Suspense fallback={null}>
              <BuyNowWithCodModal product={product} variant="light" />
            </Suspense>
          ) : (
            <a
              href="/#shop"
              className="animate-pulse-glow inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 text-lg font-bold text-brand-800 shadow-2xl"
            >
              Buy Now — Free Shipping
            </a>
          )}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-brand-300/80">
          <span className="flex items-center gap-2">🚚 Free Shipping</span>
          <span className="flex items-center gap-2">🛡️ 30-Day Guarantee</span>
          <span className="flex items-center gap-2">🔒 Secure Checkout</span>
        </div>
      </div>
    </section>
  );
}
