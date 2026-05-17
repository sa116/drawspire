const features = [
  { label: 'Dual Compression', detail: 'Targeted lumbar pressure' },
  { label: 'Breathable Mesh', detail: 'All-day cool comfort' },
  { label: 'Medical-Grade', detail: 'Ortho-approved support' },
  { label: 'Invisible Fit', detail: 'Undetectable under clothes' },
  { label: 'Only 250g', detail: 'Ultra-lightweight design' },
  { label: 'Non-Slip', detail: 'Stays in place all day' },
];

export function FeatureChips() {
  return (
    <section className="px-4 py-8">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          Why Bracelite
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {features.map((f) => (
            <div
              key={f.label}
              className="rounded-lg border border-brand-200 bg-brand-50 px-3.5 py-3"
            >
              <span className="text-[13px] font-bold text-neutral-900">{f.label}</span>
              <span className="mt-0.5 block text-[11px] text-neutral-500">{f.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
