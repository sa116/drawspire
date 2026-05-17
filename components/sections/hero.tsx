import Price from 'components/price';
import { BuyNowWithCodModal } from 'components/product/cod-form';
import { VariantSelector } from 'components/product/variant-selector';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import { HeroSlider } from './hero-slider';

function Stars() {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-4 w-4 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm font-medium text-neutral-600">4.8/5</span>
      <span className="text-sm text-neutral-400">(500+ happy kids)</span>
    </div>
  );
}

export function Hero({ product }: { product?: Product }) {
  const images = product?.images.map((img) => ({ url: img.url, altText: img.altText })) ?? [];

  return (
    <section id="shop" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Slider */}
          <div className="w-full lg:w-1/2">
            <HeroSlider images={images} />
          </div>

          {/* Content */}
          <div className="w-full lg:w-1/2 lg:py-4">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
                Safe for Ages 3+
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                No-Mess Guaranteed
              </span>
            </div>

            <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              The Drawing Board{' '}
              <span className="bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
                Every Kid Loves.
              </span>
            </h1>

            <p className="mb-4 text-base leading-relaxed text-neutral-500 sm:text-lg">
              No ink. No mess. No paper waste. Our LCD drawing board lets kids draw, erase,
              and draw again — unlimited creativity with one press of a button.
            </p>

            <Stars />

            {product ? (
              <div className="mt-5 space-y-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-bold text-neutral-900">
                    <Price
                      amount={product.priceRange.maxVariantPrice.amount}
                      currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                    />
                  </span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    Free Shipping
                  </span>
                </div>

                <Suspense fallback={null}>
                  <VariantSelector options={product.options} variants={product.variants} />
                  <BuyNowWithCodModal product={product} />
                </Suspense>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <div className="inline-block rounded-full bg-brand-600 px-8 py-3 text-lg font-bold text-white">
                  Coming Soon
                </div>
                <p className="text-sm text-neutral-500">
                  Connect your Shopify store to enable purchasing.
                </p>
              </div>
            )}

            <div className="mt-6 grid grid-cols-3 gap-2">
              {[
                { icon: '🚚', label: 'Free Shipping' },
                { icon: '🛡️', label: '30-Day Guarantee' },
                { icon: '✏️', label: '10,000+ Erases' },
              ].map((badge) => (
                <div key={badge.label} className="rounded-xl border border-neutral-100 bg-neutral-50 px-2 py-2.5 text-center">
                  <span className="mb-0.5 block text-base">{badge.icon}</span>
                  <span className="text-[11px] font-medium leading-tight text-neutral-600">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
