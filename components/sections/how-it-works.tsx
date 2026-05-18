const steps = [
  {
    number: '01',
    title: 'Pick a Side & Draw',
    description: 'Chalk on the dark side, markers on the white side — let your child pick and draw freely. Supplies stored right in the tray below.',
    emoji: '✏️',
  },
  {
    number: '02',
    title: 'Wipe & Start Fresh',
    description: 'Wipe the chalkboard with the eraser, or clean the whiteboard with a dry cloth — the board is ready again in seconds.',
    emoji: '🧹',
  },
  {
    number: '03',
    title: 'Flip & Draw Again!',
    description: 'Two surfaces, endless possibilities. Switch sides for double the fun — unlimited creativity with zero paper waste.',
    emoji: '🎨',
  },
];

export function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 py-10 sm:py-16">
      <div className="absolute inset-0 bg-grain opacity-30" />
      <div className="absolute -right-48 top-0 h-96 w-96 rounded-full bg-brand-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-300">
            How it works
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Drawing made magically simple
          </h2>
          <p className="mt-4 text-lg text-brand-200/70">
            No setup. No charging. No instructions needed. Kids just pick up the chalk or marker and start creating.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute -right-3 top-1/2 hidden h-px w-6 bg-brand-500/30 lg:block" />
              )}

              <div className="rounded-2xl border border-brand-600/30 bg-brand-800/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-brand-500/50 hover:bg-brand-700/50">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-4xl">{step.emoji}</span>
                  <span className="text-5xl font-black text-brand-500/20">{step.number}</span>
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-brand-200/70">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
