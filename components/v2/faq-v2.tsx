'use client';

import { useState } from 'react';

const faqs = [
  {
    q: 'Will it fit me?',
    a: 'Universal fit — adjustable dual-strap system fits 28" to 48" waist. Works for all body types.',
  },
  {
    q: 'Can I wear it all day?',
    a: 'Yes. Start with 2-3 hours and increase gradually. The breathable mesh prevents overheating even in summer.',
  },
  {
    q: 'Will it help my herniated disc / sciatica?',
    a: 'Bracelite provides targeted lumbar compression that reduces disc pressure and stabilizes the spine. It complements your treatment — consult your doctor for medical advice.',
  },
  {
    q: 'Is it visible under clothes?',
    a: 'No. The slim profile fits under shirts, kurtas, and office wear completely undetected.',
  },
  {
    q: 'What if it doesn\'t work for me?',
    a: '7-day easy returns. If you\'re not satisfied, return in original condition for a full refund.',
  },
  {
    q: 'How do I wash it?',
    a: 'Hand wash in cold water with mild detergent, air dry. Do not machine wash to preserve support plates.',
  },
];

export function FaqV2() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          Common Questions
        </h2>
        <div className="divide-y divide-brand-100">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between py-4 text-left"
              >
                <span className="pr-4 text-[14px] font-semibold text-neutral-900">
                  {faq.q}
                </span>
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-brand-300 text-sm text-brand-600 transition-transform duration-200 ${open === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${
                  open === i ? 'grid-rows-[1fr] pb-4 opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="text-[13px] leading-relaxed text-neutral-500">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
