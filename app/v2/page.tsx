import Footer from 'components/layout/footer';
import Price from 'components/price';
import { BuyNowWithCodModal } from 'components/product/cod-form';
import { VariantSelector } from 'components/product/variant-selector';
import { FaqV2 } from 'components/v2/faq-v2';
import { FeatureChips } from 'components/v2/feature-chips';
import { ShoppableReels } from 'components/sections/shoppable-reels';
import { FinalCtaV2 } from 'components/v2/final-cta-v2';
import { HeroCarousel } from 'components/v2/hero-carousel';
import { RealUsers } from 'components/v2/real-users';
import { ReviewsV2 } from 'components/v2/reviews-v2';
import { Transformation } from 'components/v2/transformation';
import { TrustStrip } from 'components/v2/trust-strip';
import { UrgencyBanner } from 'components/v2/urgency-banner';
import { WhoItsFor } from 'components/v2/who-its-for';
import { getProducts } from 'lib/shopify';
import { Suspense } from 'react';

export const metadata = {
  description:
    'Bracelite Breathable Back Support — medical-grade lumbar support for herniated disc, sciatica, and scoliosis relief.',
  openGraph: {
    type: 'website',
  },
};

function RatingStars() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`h-5 w-5 ${i < 4 ? 'text-amber-400' : 'text-amber-200'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-[14px] font-bold text-neutral-900">4.5</span>
      <span className="text-[13px] text-neutral-500">(200+ ratings)</span>
    </div>
  );
}

export default async function HomePageV2() {
  let product;
  try {
    const products = await getProducts({});
    product = products[0];
  } catch {
    // Shopify not configured
  }

  const images = product?.images.map((img) => ({ url: img.url, altText: img.altText })) ?? [];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero: Full-width carousel */}
      <HeroCarousel images={images} />

      {/* Product info */}
      <section className="px-4 pt-4 pb-5">
        <div className="mx-auto max-w-3xl">
          {/* Badge */}
          <div className="mb-2 inline-block rounded bg-brand-700 px-2.5 py-0.5">
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white">
              Doctor Recommended
            </span>
          </div>

          <h1 className="text-[22px] font-black leading-tight tracking-tight text-neutral-900 sm:text-3xl">
            Bracelite Breathable Back Support Belt
          </h1>

          <p className="mt-1.5 text-[13px] leading-relaxed text-neutral-500">
            Medical-grade lumbar support for herniated disc, sciatica &amp; scoliosis. Invisible under clothes.
          </p>

          <div className="mt-3">
            <RatingStars />
          </div>

          {/* Price */}
          {product ? (
            <div className="mt-4">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl font-black text-neutral-900">
                  <Price
                    amount={product.priceRange.maxVariantPrice.amount}
                    currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                  />
                </span>
                <span className="rounded bg-brand-100 px-1.5 py-0.5 text-[11px] font-bold text-brand-800">
                  FREE SHIPPING
                </span>
              </div>
              <p className="mt-1 text-[11px] font-medium text-brand-600">Inclusive of all taxes</p>

              <div className="mt-4 space-y-4">
                <Suspense fallback={null}>
                  <VariantSelector options={product.options} variants={product.variants} />
                  <BuyNowWithCodModal product={product} />
                </Suspense>
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <div className="inline-block rounded-lg bg-brand-700 px-6 py-3 text-[14px] font-bold text-white">
                Coming Soon
              </div>
              <p className="mt-2 text-[12px] text-neutral-400">
                Connect Shopify store to enable purchasing.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Trust strip */}
      <TrustStrip />

      {/* Urgency */}
      <UrgencyBanner />

      {/* Feature chips */}
      <FeatureChips />

      {/* Shoppable video reels */}
      <ShoppableReels />

      {/* Before/After transformation */}
      <Transformation />

      {/* Who it's for */}
      <WhoItsFor />

      {/* Real users gallery */}
      <RealUsers />

      {/* Reviews */}
      <ReviewsV2 />

      {/* FAQ */}
      <FaqV2 />

      {/* Final CTA */}
      <FinalCtaV2 product={product} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
