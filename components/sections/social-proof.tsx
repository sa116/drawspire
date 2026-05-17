const testimonials = [
  {
    name: 'Kavya R.',
    location: 'Bangalore',
    rating: 5,
    text: 'My 4-year-old absolutely loves this! She draws for hours and we never have to worry about crayons all over the house. Best purchase this year.',
    highlight: 'Hours of fun',
  },
  {
    name: 'Suresh M.',
    location: 'Chennai',
    rating: 5,
    text: 'Gifted this to my nephew. The one-press erase is genius — kids press it themselves and start fresh. So simple and so satisfying for them.',
    highlight: 'Kids use it independently',
  },
  {
    name: 'Pooja T.',
    location: 'Mumbai',
    rating: 5,
    text: 'Travelling with kids is so much easier now. This kept my 5-year-old busy on a 4-hour train journey without a single complaint. Totally worth it.',
    highlight: 'Perfect for travel',
  },
  {
    name: 'Deepak A.',
    location: 'Delhi',
    rating: 4,
    text: 'Great quality for the price. No mess at all — my wife was especially happy! The screen is very clear and the stylus is easy for little hands to hold.',
    highlight: 'No mess at all',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${i < count ? 'text-accent-500' : 'text-neutral-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function SocialProof() {
  return (
    <section className="bg-neutral-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-xl rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm">
          <div className="mb-2 flex items-center justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="h-7 w-7 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-3xl font-extrabold text-neutral-900">4.8 out of 5</p>
          <p className="mt-1 text-sm text-neutral-500">Based on 500+ verified reviews</p>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Real parents. Happy kids.
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-200 hover:shadow-md"
            >
              <Stars count={t.rating} />
              <p className="mt-1 mb-3 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                {t.highlight}
              </p>
              <p className="text-sm leading-relaxed text-neutral-600">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-400">{t.location} · Verified Buyer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
