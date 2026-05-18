'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    role: 'Mom of 2 (ages 4 & 7)',
    rating: 5,
    text: 'My 4-year-old drew for 6 straight hours on her first day. No crayons on the floor, no paper to throw away, no fights over "I ruined it." This is the best ₹2,499 I\'ve ever spent.',
    highlight: '6 hours of non-stop drawing',
  },
  {
    name: 'Rahul Mehta',
    location: 'Bangalore',
    role: 'Dad, gifted for birthday',
    rating: 5,
    text: 'Saved us ₹2,000/month on drawing books and crayons. My son takes it everywhere — school bus, restaurants, family trips. Wiping it clean is so easy, he does it himself. He thinks it\'s magic.',
    highlight: 'Saves ₹2,000/month',
  },
  {
    name: 'Ananya K.',
    location: 'Hyderabad',
    role: 'Teacher & Mom',
    rating: 5,
    text: 'I bought 3 for my classroom. Kids aged 5-8 all love it equally. The chalk side for art, the whiteboard side for letters — it works for everything. Zero mess compared to paint, zero fights over colours.',
    highlight: 'Bought 3 for her classroom',
  },
  {
    name: 'Vikram Nair',
    location: 'Pune',
    role: 'Dad of twins (age 5)',
    rating: 5,
    text: '12-hour train journey from Pune to Delhi. Both twins were completely occupied the entire time. No screen time, no complaints. My wife said it was the most peaceful journey we\'ve ever had.',
    highlight: '12-hour train journey — zero complaints',
  },
  {
    name: 'Deepa Iyer',
    location: 'Chennai',
    role: 'Mom of a 3-year-old',
    rating: 5,
    text: 'Was sceptical about ordering online but the 7-day replacement guarantee convinced me. Didn\'t need to use it — my daughter has used it every single day for 3 months. Worth every rupee.',
    highlight: 'Used every day for 3 months',
  },
  {
    name: 'Arun Bhat',
    location: 'Delhi',
    role: 'Dad, 4-star review',
    rating: 4,
    text: 'Great quality, fast delivery. My 6-year-old loves it. Would be 5 stars if it came with a second stylus — one is enough though. No mess, as promised. My wife is especially relieved!',
    highlight: 'Fast delivery, no mess',
  },
];

// Each photo linked to its reviewer via reviewIndex
const reviewPhotos = [
  // Priya Sharma — index 0
  { src: '/reviews/714Q9JLLYLL.jpg', alt: 'Kid drawing enthusiastically with colorful markers', reviewIndex: 0 },
  { src: '/reviews/71equ5LyNBL.jpg', alt: 'Magnetic letters scattered on whiteboard', reviewIndex: 0 },
  { src: '/reviews/617mxYO5dXL.jpg', alt: 'Beautiful chalk flower drawn by a child', reviewIndex: 0 },
  // Rahul Mehta — index 1
  { src: '/reviews/71Y0SO33UPL.jpg', alt: 'Detailed sun and car drawing on whiteboard under Christmas tree', reviewIndex: 1 },
  { src: '/reviews/71nMaUkexbL.jpg', alt: 'Close-up of sun, flowers and car artwork', reviewIndex: 1 },
  { src: '/reviews/71-R31VUJYL.jpg', alt: 'Child artwork from side angle', reviewIndex: 1 },
  // Ananya K. — index 2
  { src: '/reviews/71Jgd4M-EXL.jpg', alt: 'Product with full magnetic letter and number set', reviewIndex: 2 },
  { src: '/reviews/71zORWT5f9L.jpg', alt: 'All alphabet and number tiles arranged on board', reviewIndex: 2 },
  { src: '/reviews/41JCNT0xGNL.jpg', alt: 'All accessories included in the box', reviewIndex: 2 },
  { src: '/reviews/31yiDKC0sgL.jpg', alt: 'Magnetic alphabet and number tile sheet', reviewIndex: 2 },
  // Vikram Nair — index 3
  { src: '/reviews/81Bchl3JprL.jpg', alt: 'Baby girl in pink drawing on the whiteboard', reviewIndex: 3 },
  { src: '/reviews/81adotNhwsL.jpg', alt: 'Toddler in green sweater creating art', reviewIndex: 3 },
  { src: '/reviews/619I7Db5b2L.jpg', alt: 'Colorful marker artwork by young child', reviewIndex: 3 },
  // Deepa Iyer — index 4
  { src: '/reviews/71iDsX5dEBL.jpg', alt: 'Chalk circle drawings on chalkboard side', reviewIndex: 4 },
  { src: '/reviews/71LoZGdpaJL.jpg', alt: 'Vibrant colorful chalk art on dark chalkboard', reviewIndex: 4 },
  { src: '/reviews/71btqzOT-UL.jpg', alt: 'Young child drawing on whiteboard close up', reviewIndex: 4 },
  // Arun Bhat — index 5
  { src: '/reviews/31wRHHkVb+L.jpg', alt: 'Have a great day written in chalk', reviewIndex: 5 },
  { src: '/reviews/61ou5RNWnsL.jpg', alt: 'Letter A drawn neatly in chalk', reviewIndex: 5 },
  { src: '/reviews/71X2Oh4zfjL.jpg', alt: 'ABCDE and smiley face on chalkboard', reviewIndex: 5 },
  { src: '/reviews/61EeVoLZaDL.jpg', alt: 'Jasper name and drawing on whiteboard', reviewIndex: 5 },
  { src: '/reviews/61L-+BJmDtL.jpg', alt: 'Jasper name written on chalkboard', reviewIndex: 5 },
];

const ratingBreakdown = [
  { stars: 5, count: 431, pct: 86 },
  { stars: 4, count: 52, pct: 10 },
  { stars: 3, count: 12, pct: 3 },
  { stars: 2, count: 3, pct: 1 },
  { stars: 1, count: 2, pct: 0 },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`h-4 w-4 ${filled ? 'text-accent-500' : 'text-neutral-200'}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => <StarIcon key={i} filled={i < count} />)}
    </div>
  );
}

function Lightbox({
  startIndex,
  onClose,
}: {
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const photo = reviewPhotos[idx]!;
  const review = testimonials[photo.reviewIndex]!;
  const total = reviewPhotos.length;

  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIdx((i) => Math.min(total - 1, i + 1)), [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, prev, next]);

  return createPortal(
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-contain"
            sizes="512px"
          />

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Prev */}
          {idx > 0 && (
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-2xl text-white transition hover:bg-black/80"
            >
              ‹
            </button>
          )}

          {/* Next */}
          {idx < total - 1 && (
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-2xl text-white transition hover:bg-black/80"
            >
              ›
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/55 px-3 py-0.5 text-xs font-medium text-white">
            {idx + 1} / {total}
          </div>
        </div>

        {/* Review */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
              {review.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <p className="text-sm font-semibold text-neutral-900">{review.name}</p>
                <span className="rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                  ✓ Verified
                </span>
              </div>
              <p className="mb-1 text-xs text-neutral-400">{review.role} · {review.location}</p>
              <Stars count={review.rating} />
            </div>
          </div>
          <span className="mt-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            ✓ {review.highlight}
          </span>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            &ldquo;{review.text}&rdquo;
          </p>
        </div>

        {/* Dot navigation strip */}
        <div className="no-scrollbar flex gap-1.5 overflow-x-auto border-t border-neutral-100 px-4 py-3">
          {reviewPhotos.map((p, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`shrink-0 overflow-hidden rounded transition-all duration-150 ${
                i === idx
                  ? 'h-9 w-9 ring-2 ring-brand-500 ring-offset-1'
                  : 'h-7 w-7 opacity-50 hover:opacity-80'
              }`}
            >
              <Image src={p.src} alt="" fill className="object-cover" sizes="36px" />
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export function SocialProof() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <section id="reviews" className="overflow-x-clip bg-neutral-50 py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Stats banner */}
        <div className="mb-8 grid grid-cols-3 gap-2 sm:gap-5">
          {[
            { value: '5,000+', label: 'Happy Families', icon: '👨‍👩‍👧' },
            { value: '4.8/5', label: 'Avg Rating', icon: '⭐' },
            { value: '127', label: 'Orders Today', icon: '📦' },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-neutral-200 bg-white p-3 text-center shadow-sm sm:rounded-2xl sm:p-5">
              <p className="mb-0.5 text-xl sm:text-3xl">{s.icon}</p>
              <p className="text-base font-extrabold leading-tight text-neutral-900 sm:text-2xl">{s.value}</p>
              <p className="mt-0.5 text-[10px] font-medium leading-tight text-neutral-500 sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-6 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-600">Verified Reviews</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Real parents. Honest reviews.
          </h2>
          <p className="mt-3 text-base text-neutral-500">Every review is from a verified buyer — unedited and unfiltered.</p>
        </div>

        {/* Rating summary */}
        <div className="mx-auto mb-8 max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-5xl font-black text-neutral-900">4.8</p>
              <div className="mt-1 flex justify-center gap-0.5">
                {[...Array(5)].map((_, i) => <StarIcon key={i} filled={true} />)}
              </div>
              <p className="mt-1 text-xs text-neutral-500">500 reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingBreakdown.map((r) => (
                <div key={r.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-4 text-right font-medium text-neutral-600">{r.stars}</span>
                  <svg className="h-3 w-3 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-100">
                    <div className="h-full rounded-full bg-accent-400" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="w-6 text-neutral-500">{r.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer photo gallery */}
        <div className="mb-10">
          <p className="mb-1 text-center text-sm font-bold uppercase tracking-widest text-brand-600">
            📸 Real customers · Real kids
          </p>
          <p className="mb-5 text-center text-xs text-neutral-400">Tap any photo to see the full review</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7">
            {reviewPhotos.map((photo, i) => {
              const rev = testimonials[photo.reviewIndex]!;
              return (
                <button
                  key={i}
                  onClick={() => setLightboxIndex(i)}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 shadow-sm transition-all duration-200 hover:scale-[1.04] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(min-width: 1024px) 14vw, (min-width: 640px) 25vw, 33vw"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <p className="text-[9px] font-bold leading-tight text-white sm:text-[10px]">{rev.name}</p>
                    <div className="mt-0.5 flex gap-px">
                      {[...Array(rev.rating)].map((_, j) => (
                        <svg key={j} className="h-2 w-2 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  {/* Magnify icon */}
                  <div className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0zm-3-1v2m-1-1h2" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, ti) => {
            const photos = reviewPhotos.filter((p) => p.reviewIndex === ti);
            const firstPhotoIdx = reviewPhotos.findIndex((p) => p.reviewIndex === ti);
            return (
              <div
                key={t.name}
                className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
              >
                <Stars count={t.rating} />
                <span className="mt-2 mb-3 inline-block self-start rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                  ✓ {t.highlight}
                </span>
                <p className="flex-1 text-sm leading-relaxed text-neutral-600">
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Reviewer photo thumbnails */}
                {photos.length > 0 && (
                  <div className="mt-4 flex gap-1.5">
                    {photos.slice(0, 4).map((p, pi) => {
                      const globalIdx = reviewPhotos.indexOf(p);
                      return (
                        <button
                          key={pi}
                          onClick={() => setLightboxIndex(globalIdx)}
                          className="group relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-neutral-200 transition hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                          aria-label={`View photo from ${t.name}`}
                        >
                          <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="48px" />
                          <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                        </button>
                      );
                    })}
                    {photos.length > 4 && (
                      <button
                        onClick={() => setLightboxIndex(firstPhotoIdx + 4)}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-xs font-bold text-neutral-500 transition hover:bg-neutral-100"
                      >
                        +{photos.length - 4}
                      </button>
                    )}
                  </div>
                )}

                <div className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                    {t.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-neutral-900">{t.name}</p>
                    <p className="truncate text-xs text-neutral-400">{t.role} · {t.location}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                    ✓ Verified
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </section>
  );
}
