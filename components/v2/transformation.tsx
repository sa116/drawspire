export function Transformation() {
  return (
    <section className="bg-brand-900 px-4 py-12">
      <div className="mx-auto max-w-7xl lg:flex lg:items-center lg:gap-16">
        {/* Before */}
        <div className="mb-10 lg:mb-0 lg:flex-1">
          <div className="mb-4 inline-block rounded bg-red-500/10 px-2.5 py-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-400">
              Without Support
            </span>
          </div>
          <h3 className="text-[28px] font-black leading-[1.1] tracking-tight text-white sm:text-4xl">
            Every movement<br />
            <span className="text-brand-300/50">is a reminder of pain.</span>
          </h3>
          <ul className="mt-5 space-y-2.5">
            {[
              'Sharp pain when bending or lifting',
              'Numbness radiating down your legs',
              'Can\'t sit through a workday',
              'Sleepless nights, tossing for relief',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13px] text-brand-200/70">
                <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Divider */}
        <div className="mb-10 flex items-center gap-3 lg:mb-0 lg:flex-col">
          <div className="h-px flex-1 bg-brand-700 lg:h-24 lg:w-px" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-500">then</span>
          <div className="h-px flex-1 bg-brand-700 lg:h-24 lg:w-px" />
        </div>

        {/* After */}
        <div className="lg:flex-1">
          <div className="mb-4 inline-block rounded bg-brand-500/15 px-2.5 py-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-300">
              With Bracelite
            </span>
          </div>
          <h3 className="text-[28px] font-black leading-[1.1] tracking-tight text-white sm:text-4xl">
            Move freely.<br />
            <span className="text-brand-400">Live fully.</span>
          </h3>
          <ul className="mt-5 space-y-2.5">
            {[
              'Targeted compression reduces disc pressure',
              'Stabilizes lumbar spine during activity',
              'Work 8+ hours with zero discomfort',
              'Wake up refreshed, not aching',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-[13px] text-brand-100">
                <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-brand-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
