import Price from 'components/price';
import { BuyNowWithCodModal } from 'components/product/cod-form';
import { VariantSelector } from 'components/product/variant-selector';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import { HeroSlider } from './hero-slider';

function Stars() {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="h-4 w-4 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm font-bold text-neutral-800">4.8</span>
      <span className="text-sm text-neutral-500">(500+ happy parents)</span>
    </div>
  );
}

function StockBadge() {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-orange-100 bg-orange-50 px-3 py-2">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
      </span>
      <span className="text-xs font-semibold text-orange-700">
        Only <strong>47 left</strong> in stock — 127 sold today
      </span>
    </div>
  );
}

export function Hero({ product }: { product?: Product }) {
  const images = product?.images.map((img) => ({ url: img.url, altText: img.altText })) ?? [];

  return (
    <section id="shop" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 sm:pb-12 sm:pt-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
          {/* Slider */}
          <div className="w-full lg:w-[52%]">
            <HeroSlider images={images} />
          </div>

          {/* Content */}
          <div className="w-full lg:w-[48%]">
            {/* Trust badges */}
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                Safe for Ages 3+
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                🎨 No-Mess Guaranteed
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                ♻️ Reusable 10,000+ Times
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-neutral-900 sm:text-4xl lg:text-[2.6rem]">
              Your Child Will Draw for{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">
                  Hours.
                </span>
              </span>{' '}
              You&apos;ll Clean{' '}
              <span className="italic underline decoration-accent-400 decoration-wavy underline-offset-4">
                Nothing.
              </span>
            </h1>

            <p className="mb-4 text-base leading-relaxed text-neutral-500 sm:text-[1.05rem]">
              The mess-free drawing board loved by 5,000+ Indian families. Draw, erase with one press, draw again — unlimited creativity with zero cleanup. Save ₹2,400/year on paper and art supplies.
            </p>

            <Stars />

            {product ? (
              <div className="mt-5 space-y-4">
                {/* Price */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-4xl font-extrabold text-neutral-900">
                    <Price
                      amount={product.priceRange.maxVariantPrice.amount}
                      currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                    />
                  </span>
                  {product.compareAtPriceRange?.maxVariantPrice?.amount && (
                    <span className="text-xl font-medium text-neutral-400 line-through">
                      <Price
                        amount={product.compareAtPriceRange.maxVariantPrice.amount}
                        currencyCode={product.compareAtPriceRange.maxVariantPrice.currencyCode}
                      />
                    </span>
                  )}
                  <span className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white">
                    50% OFF
                  </span>
                </div>

                {/* Stock urgency */}
                <StockBadge />

                {/* Variant + CTA */}
                <Suspense fallback={null}>
                  <VariantSelector options={product.options} variants={product.variants} />
                  <div id="hero-buy-btn">
                    <BuyNowWithCodModal product={product} />
                  </div>
                </Suspense>

                {/* Trust bar */}
                <div className="grid grid-cols-3 divide-x divide-neutral-100 rounded-xl border border-neutral-100 bg-neutral-50">
                  {[
                    { icon: '🚚', label: 'Free Shipping' },
                    { icon: '🔁', label: '30-Day Returns' },
                    { icon: '💳', label: 'Pay on Delivery' },
                  ].map((b) => (
                    <div key={b.label} className="flex flex-col items-center gap-1 px-2 py-3 text-center">
                      <span className="text-lg">{b.icon}</span>
                      <span className="text-[11px] font-semibold leading-tight text-neutral-600">{b.label}</span>
                    </div>
                  ))}
                </div>
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
          </div>
        </div>
      </div>
    </section>
  );
}
