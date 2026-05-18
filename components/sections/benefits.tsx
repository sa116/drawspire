const benefits = [
  {
    icon: '🚫',
    title: 'Zero Mess, Every Time',
    description: 'No crayons on walls, no paint on clothes, no paper scraps on the floor. Draw as much as you want — your home stays spotless.',
  },
  {
    icon: '♻️',
    title: 'Draw, Wipe, Repeat',
    description: 'Wipe the chalkboard, clean the whiteboard — both sides reset in seconds and last for years. No consumables, no replacements, no waste.',
  },
  {
    icon: '💰',
    title: 'Save ₹2,400+ Every Year',
    description: 'Stop buying crayons, markers, and drawing pads every month. One Drawspire board replaces them all — permanently.',
  },
  {
    icon: '🎒',
    title: 'Goes Everywhere',
    description: 'Weighs less than a water bottle. Perfect for train journeys, flights, restaurant waits, or backseat entertainment on long drives.',
  },
  {
    icon: '🔒',
    title: 'Completely Safe',
    description: 'Non-toxic, BPA-free, no sharp edges. Designed specifically for ages 3 and up. Meets international child safety standards.',
  },
  {
    icon: '🧠',
    title: 'Actually Good for Kids',
    description: 'Drawing develops fine motor control, hand-eye coordination, and imagination — skills that no screen time can replicate.',
  },
];

export function Benefits() {
  return (
    <section className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand-600">
            Why 5,000+ Parents Chose Drawspire
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Everything you want.{' '}
            <span className="bg-gradient-to-r from-brand-600 to-accent-500 bg-clip-text text-transparent">
              Nothing you don&apos;t.
            </span>
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Built for curious kids. Designed for sane parents.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => (
            <div
              key={b.title}
              className="group rounded-2xl border border-neutral-100 bg-neutral-50 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:bg-white hover:shadow-lg hover:shadow-brand-100/60"
            >
              <span className="mb-4 block text-3xl transition-transform duration-300 group-hover:scale-110">
                {b.icon}
              </span>
              <h3 className="mb-2 text-base font-bold text-neutral-900">{b.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-500">{b.description}</p>
            </div>
          ))}
        </div>

        {/* Savings callout */}
        <div className="mx-auto mt-12 max-w-3xl rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center">
          <p className="text-lg font-extrabold text-neutral-900">
            💡 The average Indian family spends <span className="text-accent-600">₹200–400/month</span> on art supplies.
          </p>
          <p className="mt-2 text-base text-neutral-600">
            Drawspire pays for itself in <strong>a few months</strong> — and keeps drawing free forever after.
          </p>
        </div>
      </div>
    </section>
  );
}
