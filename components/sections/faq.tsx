'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const faqs = [
  {
    question: 'What age is the drawing board suitable for?',
    answer:
      'Drawspire is designed for children aged 3 and above. The stylus is easy to grip for small hands, and the erase button is simple enough for toddlers to use on their own.',
  },
  {
    question: 'Does it need charging or batteries?',
    answer:
      'The drawing board runs on a standard button cell battery (included in the box). It typically lasts 6–12 months with regular use. No charging cable needed.',
  },
  {
    question: 'Is it safe for kids?',
    answer:
      'Absolutely. Drawspire is made from non-toxic, BPA-free materials with rounded edges and no sharp parts. It meets international toy safety standards and is safe for children from age 3+.',
  },
  {
    question: 'How does the erase feature work?',
    answer:
      'A single press of the erase button sends a small electric pulse through the LCD layer, instantly resetting the screen to blank. It is completely safe and takes less than a second.',
  },
  {
    question: 'Can it be used in the dark?',
    answer:
      'The LCD screen does not emit light on its own — it works best in normal lighting. It is not backlit, but the high-contrast dark lines are very clear and easy to see indoors.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer a 30-day satisfaction guarantee. If you or your child are not happy with the product, return it within 30 days of delivery for a full refund. The product must be in its original condition.',
  },
];

export function FAQ() {
  return (
    <section id="faq" className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-600">
            FAQ
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
            Got questions?
          </h2>
          <p className="mt-4 text-lg text-neutral-500">
            Everything you need to know about Drawspire.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <Disclosure key={faq.question} as="div">
              {({ open }) => (
                <div className={clsx(
                  'rounded-xl border transition-colors duration-200',
                  open ? 'border-brand-200 bg-brand-50/50' : 'border-neutral-200 bg-white'
                )}>
                  <DisclosureButton className="flex w-full items-center justify-between px-5 py-4 text-left">
                    <span className={clsx(
                      'text-base font-semibold',
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
                  <DisclosurePanel className="px-5 pb-4 text-sm leading-relaxed text-neutral-600">
                    {faq.answer}
                  </DisclosurePanel>
                </div>
              )}
            </Disclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
