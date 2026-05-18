'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const faqs = [
  {
    question: 'What age is this suitable for?',
    answer:
      'We recommend ages 3 and above. At 3, kids have enough motor control to hold chalk or a marker and enjoy drawing freely. Many parents tell us their 2½-year-olds love it too with light supervision. There are no small parts and no sharp edges, so it\'s safe for young children.',
  },
  {
    question: 'What exactly comes in the box?',
    answer:
      'The board ships with chalk pieces, a dry-erase marker, an eraser, and a cleaning cloth — everything your child needs to start drawing on both sides right away. All supplies are stored in the built-in tray below the board.',
  },
  {
    question: 'Will my kid lose interest after 2 days like with every other toy?',
    answer:
      'Drawing is fundamentally open-ended — there\'s no game to "finish" or level to beat, so kids keep coming back naturally. We hear from parents whose children use it daily for 6+ months. Wiping the board clean also removes the frustration of "ruining" a drawing, which keeps even perfectionists engaged.',
  },
  {
    question: 'Is it actually safe? I\'ve heard some cheap toys have toxic materials.',
    answer:
      'Completely safe. The board is made from non-toxic, BPA-free materials with no sharp edges. The chalk is food-safe grade, and the markers are washable — safe even if kids get them on their hands or clothes. It meets international toy safety standards.',
  },
  {
    question: 'How do you erase? Is it easy for kids?',
    answer:
      'Yes, very easy. The chalkboard side wipes clean with the included felt eraser — the same way a school blackboard works, so even a 3-year-old can do it. The whiteboard side wipes clean with a dry cloth in one stroke. No buttons, no electronics, no fuss.',
  },
  {
    question: 'What if it breaks? What\'s your replacement policy?',
    answer:
      '7-day replacement guarantee, no questions asked. If it arrives damaged or has any defect within 7 days — contact us and we\'ll send a replacement immediately. We want you to be happy; if something\'s wrong, we\'ll make it right.',
  },
  {
    question: 'How is this different from an iPad or drawing app?',
    answer:
      'Three big differences: (1) No screen time — real chalk and markers on a real surface, not a backlit display. (2) No apps, no ads, no distraction — just pure drawing. (3) ₹2,499 vs ₹20,000+. Unstructured drawing on a physical board builds fine motor skills in a way that no screen can replicate.',
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
