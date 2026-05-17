const specs = [
  { label: 'Material', value: 'Breathable nylon mesh + elastic' },
  { label: 'Support', value: '4 metal lumbar plates' },
  { label: 'Fit', value: 'Universal (28"–48" waist)' },
  { label: 'Weight', value: '250g' },
  { label: 'Closure', value: 'Dual adjustable compression straps' },
  { label: 'Washable', value: 'Hand wash, air dry' },
  { label: 'Conditions', value: 'Herniated disc, sciatica, scoliosis, posture' },
  { label: 'Usage', value: 'All-day wear (start 2-3 hrs)' },
];

export function SpecsTable() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
          Product Details
        </h2>
        <div className="divide-y divide-neutral-100">
          {specs.map((spec) => (
            <div key={spec.label} className="flex items-baseline justify-between py-3">
              <span className="text-[13px] font-medium text-neutral-500">{spec.label}</span>
              <span className="text-right text-[13px] font-semibold text-neutral-900">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
