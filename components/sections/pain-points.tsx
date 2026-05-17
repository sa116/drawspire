const painPoints = [
  {
    emoji: '🖍️',
    title: 'Crayon & Paint Mess',
    description: 'Ink on walls, clothes, and floors — cleaning up takes longer than the art itself.',
    stat: '₹500+',
    statLabel: 'wasted on supplies/month',
  },
  {
    emoji: '📺',
    title: 'Too Much Screen Time',
    description: 'Kids glued to phones and tablets instead of developing real creative skills.',
    stat: '4 hrs',
    statLabel: 'avg screen time/day',
  },
  {
    emoji: '📄',
    title: 'Endless Paper Waste',
    description: 'Drawing books finish in days. More paper, more cost, more clutter.',
    stat: '50+',
    statLabel: 'sheets wasted/week',
  },
  {
    emoji: '😩',
    title: 'Kids Get Bored Fast',
    description: 'Toys lose their shine quickly. Kids need a creative outlet that stays exciting.',
    stat: '73%',
    statLabel: 'of parents agree',
  },
];

export function PainPoints() {
  return (
    <section className="relative overflow-hidden bg-neutral-900 py-16 sm:py-24">
      <div className="absolute inset-0 bg-grain opacity-40" />
      <div className="absolute -left-48 top-0 h-96 w-96 rounded-full bg-red-900/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-red-400">
            The problem
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Art time shouldn&apos;t be a nightmare.
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Every parent knows the struggle — messy supplies, wasted paper, and screen-addicted kids.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 sm:grid-cols-2">
          {painPoints.map((point, i) => (
            <div
              key={point.title}
              className="group relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800/80"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 flex items-start justify-between">
                <span className="text-3xl">{point.emoji}</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">{point.stat}</p>
                  <p className="text-xs text-neutral-500">{point.statLabel}</p>
                </div>
              </div>
              <h3 className="mb-2 text-lg font-bold text-white">{point.title}</h3>
              <p className="text-sm leading-relaxed text-neutral-400">{point.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-700 bg-brand-900/50 px-6 py-3 text-lg font-semibold text-brand-300">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
            There&apos;s a smarter way
          </p>
        </div>
      </div>
    </section>
  );
}
