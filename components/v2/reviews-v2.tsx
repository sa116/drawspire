'use client';

const reviews = [
  {
    name: 'Rajesh K.',
    location: 'Mumbai',
    rating: 5,
    text: 'I work 10-hour shifts at my desk. This belt changed everything — I can actually focus on work now without constant pain.',
    date: '2 weeks ago',
    verified: true,
    image: '/reviews/review-1.jpg',
  },
  {
    name: 'Priya M.',
    location: 'Bangalore',
    rating: 5,
    text: 'After my herniated disc diagnosis, my doctor recommended lumbar support. Bracelite fits perfectly under clothes and gives me the support I need.',
    date: '1 month ago',
    verified: true,
    image: '/reviews/review-2.jpg',
  },
  {
    name: 'Amit S.',
    location: 'Delhi',
    rating: 5,
    text: 'Great quality and very breathable. I was worried about heat in Indian summers, but the mesh design keeps me comfortable.',
    date: '3 weeks ago',
    verified: true,
    image: '/reviews/review-3.jpg',
  },
  {
    name: 'Sunita D.',
    location: 'Pune',
    rating: 5,
    text: 'My sciatica pain has reduced significantly since I started wearing this. The dual strap system lets me adjust compression exactly how I need.',
    date: '1 month ago',
    verified: true,
    image: null,
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? 'text-amber-400' : 'text-neutral-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg">
      <img
        src={src}
        alt={alt}
        className="h-40 w-full object-cover"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

export function ReviewsV2() {
  return (
    <section className="bg-brand-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
            Customer Reviews
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <StarRow count={5} />
              <span className="text-[15px] font-bold text-neutral-900">4.5/5</span>
            </div>
            <span className="text-[12px] text-neutral-400">Based on 200+ verified reviews</span>
          </div>
        </div>

        {/* Review cards */}
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review.name} className="rounded-lg border border-brand-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-[11px] font-bold text-white">
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-neutral-900">{review.name}</p>
                    <p className="text-[11px] text-neutral-400">{review.location}</p>
                  </div>
                </div>
                {review.verified && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand-600">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <StarRow count={review.rating} />
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">{review.text}</p>
              {review.image && (
                <ReviewImage src={review.image} alt={`Photo by ${review.name}`} />
              )}
              <p className="mt-2 text-[11px] text-neutral-400">{review.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
