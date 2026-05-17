const benefits = [
  {
    emoji: '🚫',
    title: 'Zero Mess',
    description: 'No ink, no paint, no crayons — completely clean drawing every time.',
  },
  {
    emoji: '♻️',
    title: 'Reusable 10,000+ Times',
    description: 'One button press erases everything. Draw again, endlessly.',
  },
  {
    emoji: '🎒',
    title: 'Ultra Portable',
    description: 'Lightweight and compact — perfect for travel, school, or restaurants.',
  },
  {
    emoji: '🔒',
    title: 'Safe for Kids',
    description: 'Non-toxic, BPA-free materials. No sharp edges. Safe from age 3+.',
  },
  {
    emoji: '🧠',
    title: 'Boosts Creativity',
    description: 'Open-ended drawing develops fine motor skills and imagination.',
  },
  {
    emoji: '🌍',
    title: 'Eco-Friendly',
    description: 'Replaces thousands of paper sheets — great for the planet.',
  },
];

export function Benefits() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
            Why Drawspire
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Built for curious little minds.
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Everything a child needs to create — nothing for parents to clean up.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group rounded-2xl border border-neutral-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-100/50"
            >
              <span className="mb-4 block text-3xl transition-transform duration-300 group-hover:scale-110">{benefit.emoji}</span>
              <h3 className="mb-1.5 text-base font-bold text-neutral-900">{benefit.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-500">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
