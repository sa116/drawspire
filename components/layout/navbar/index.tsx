import Link from 'next/link';

export async function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link href="/" prefetch={true}>
          <span className="text-lg font-bold tracking-tight text-brand-600 sm:text-xl">
            Drawspire
          </span>
        </Link>

        <Link
          href="/#shop"
          className="shrink-0 whitespace-nowrap rounded-full bg-brand-700 px-4 py-2 sm:px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-800"
        >
          Shop Now
        </Link>
      </div>
    </nav>
  );
}
