const personas = [
  {
    title: 'Office Workers',
    desc: '8+ hours at a desk destroying your posture? Get instant lumbar relief while you work.',
  },
  {
    title: 'Post-Surgery Recovery',
    desc: 'Doctor-recommended stabilization for herniated disc and post-operative healing.',
  },
  {
    title: 'Active Lifestyles',
    desc: 'Gym, driving, housework — lightweight support that moves with you, not against you.',
  },
  {
    title: 'Chronic Pain Sufferers',
    desc: 'Sciatica, scoliosis, or recurring back pain. Targeted compression where it matters most.',
  },
];

export function WhoItsFor() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          Who It&apos;s For
        </h2>
        <p className="mb-6 text-[20px] font-black tracking-tight text-neutral-900">
          5,000+ Indians trust Bracelite daily
        </p>
        <div className="space-y-3">
          {personas.map((p) => (
            <div key={p.title} className="flex gap-3 border-l-2 border-brand-500 py-2 pl-4">
              <div>
                <p className="text-[14px] font-bold text-neutral-900">{p.title}</p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-neutral-500">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
