import { BuyNowWithCodModal } from 'components/product/cod-form';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';

export function FinalCtaV2({ product }: { product?: Product }) {
  return (
    <section className="bg-brand-900 px-4 py-12 pb-28 lg:pb-12">
      <div className="mx-auto max-w-md text-center">
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
          Your back won&apos;t fix itself.
        </h2>
        <p className="mt-2 text-[13px] text-brand-200">
          Join 5,000+ Indians who chose Bracelite for lasting relief.
        </p>
        <div className="mt-6">
          {product ? (
            <Suspense fallback={null}>
              <BuyNowWithCodModal product={product} />
            </Suspense>
          ) : (
            <a
              href="/#shop"
              className="block w-full rounded-lg bg-brand-600 py-4 text-[15px] font-bold uppercase tracking-wider text-white"
            >
              Get Yours Now — Free Shipping
            </a>
          )}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-[11px] font-medium text-brand-300">
          <span>Free Shipping</span>
          <span className="h-3 w-px bg-brand-700" />
          <span>7-Day Returns</span>
          <span className="h-3 w-px bg-brand-700" />
          <span>COD Available</span>
        </div>
      </div>
    </section>
  );
}
