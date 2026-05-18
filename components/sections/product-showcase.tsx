const features = [
  { label: 'Double-Sided Board', icon: '🔄' },
  { label: 'Chalkboard Side', icon: '🖤' },
  { label: 'Whiteboard Side', icon: '⬜' },
  { label: 'Built-In Storage Tray', icon: '🪣' },
  { label: 'Non-Toxic & Safe', icon: '🌿' },
  { label: 'Sturdy Wooden Frame', icon: '🪵' },
];

export function ProductShowcase() {
  return (
    <section className="bg-grain relative overflow-hidden py-10 sm:py-16">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-brand-50/30 to-white" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
            The solution
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            Meet the smarter drawing board
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Every feature designed with one goal: pure creative joy for kids, zero cleanup for parents.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-sm font-medium text-neutral-700">{feature.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-brand-100 bg-gradient-to-r from-brand-50 to-white p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl text-white">
                🎨
              </div>
              <div>
                <p className="font-bold text-neutral-900">Loved by child development experts</p>
                <p className="mt-1 text-sm text-neutral-500">
                  Real chalk and markers on a real board — open-ended drawing play is proven to develop fine motor skills, hand-eye coordination, and creative thinking in children aged 3 and above.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
