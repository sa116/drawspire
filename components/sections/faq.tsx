'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const faqs = [
  {
    question: 'What age is this suitable for? My toddler is only 2½.',
    answer:
      'We recommend ages 3 and above — at 3, kids have enough motor control to hold the stylus and enjoy drawing. That said, many parents tell us their 2½-year-olds love it too with light supervision. The erase button is the same motion as pressing a lift button, so it\'s very intuitive.',
  },
  {
    question: 'How long does the battery last? I don\'t want it dying in a week.',
    answer:
      'The button cell battery (included) lasts 6–12 months of regular daily use. No cables, no charging, no waiting. When it\'s time to replace, any standard button cell from a local store works — costs about ₹20.',
  },
  {
    question: 'Will my kid lose interest after 2 days like with every other toy?',
    answer:
      'Drawing is fundamentally open-ended — there\'s no game to "finish" or level to beat, so kids come back to it naturally. We hear from parents whose children use it daily for 6+ months. The instant-erase also removes the frustration of "ruining" a drawing, which keeps even perfectionists engaged.',
  },
  {
    question: 'Is it actually safe? I\'ve heard some cheap toys from China have toxic materials.',
    answer:
      'Completely safe. The board is made from non-toxic, BPA-free materials with no sharp edges. The LCD erase uses a tiny, harmless electrical pulse — the same technology in calculators. It meets international toy safety standards. We wouldn\'t sell it if we wouldn\'t give it to our own kids.',
  },
  {
    question: 'What if it breaks? What\'s your return/refund policy?',
    answer:
      '30-day no-questions-asked return policy. If it breaks within 30 days of delivery — for any reason — contact us for a full refund or replacement. After 30 days, defects are covered under our quality guarantee. We want you to be happy; if something\'s wrong, we\'ll make it right.',
  },
  {
    question: 'How is this different from an iPad or drawing tablet?',
    answer:
      'Three big differences: (1) No screen time — it\'s not a backlit screen emitting blue light. (2) No apps, no ads, no distraction — just drawing. (3) ₹999 vs ₹20,000+. We\'re not saying iPads are bad — we\'re saying that unstructured drawing is a completely different (and developmentally valuable) activity, and this is the best tool for it.',
  },
  {
    question: 'Can I order multiple for my classroom or as gifts?',
    answer:
      'Absolutely. Use the quantity selector on the order form. Many teachers order 5–10 at a time. For bulk orders (10+), reach out to us directly for pricing — we\'re happy to help.',
  },
  {
    question: 'How fast will it arrive?',
    answer:
      'We ship within 24 hours of order confirmation. Delivery takes 3–5 business days for most metro cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad, Pune) and 5–7 days for other locations. You\'ll receive an SMS with tracking.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-neutral-50 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-3 text-sm font-bold uppercase tracking-widest text-brand-600">
            FAQs
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            We&apos;ve heard every question.
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Here are the ones parents ask most before ordering.
          </p>
        </div>

        <div className="mt-12 space-y-2">
          {faqs.map((faq, i) => (
            <Disclosure key={faq.question} as="div" defaultOpen={i < 2}>
              {({ open }) => (
                <div className={clsx(
                  'rounded-xl border transition-all duration-200',
                  open ? 'border-brand-200 bg-white shadow-sm' : 'border-neutral-200 bg-white hover:border-neutral-300'
                )}>
                  <DisclosureButton className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left">
                    <span className={clsx(
                      'text-sm font-semibold sm:text-base',
                      open ? 'text-brand-700' : 'text-neutral-900'
                    )}>
                      {faq.question}
                    </span>
                    <ChevronDownIcon
                      className={clsx(
                        'h-5 w-5 shrink-0 transition-transform duration-200',
                        open ? 'rotate-180 text-brand-600' : 'text-neutral-400'
                      )}
                    />
                  </DisclosureButton>
                  <DisclosurePanel className="px-5 pb-5 text-sm leading-relaxed text-neutral-600">
                    {faq.answer}
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-neutral-500">
          Still have questions?{' '}
          <a href="mailto:support@drawspire.in" className="font-semibold text-brand-600 underline underline-offset-2 hover:text-brand-700">
            Email us
          </a>{' '}
          — we reply within 2 hours.
        </p>
      </div>
    </section>
  );
}
