import Link from 'next/link';

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2024 + (currentYear > 2024 ? `-${currentYear}` : '');
  const copyrightName = COMPANY_NAME || SITE_NAME || 'Drawspire';

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50 pb-20 md:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="text-xl font-bold text-brand-600">
              Drawspire
            </Link>
            <p className="mt-3 max-w-xs text-sm text-neutral-500">
              Spark your child&apos;s creativity with our no-mess, reusable kids drawing board.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-neutral-500 hover:text-brand-600">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-500 hover:text-brand-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-neutral-500 hover:text-brand-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-500 hover:text-brand-600">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Policies
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy-policy" className="text-neutral-500 hover:text-brand-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-500 hover:text-brand-600">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-neutral-500 hover:text-brand-600">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500">
          <p>
            &copy; {copyrightDate} {copyrightName}. All rights reserved.
          </p>
          <p className="mt-2">
            Powered by{' '}
            <span className="font-semibold text-neutral-900">Sudopers</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
