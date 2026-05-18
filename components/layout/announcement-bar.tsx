export function AnnouncementBar() {
  const content = (
    <>
      <span className="whitespace-nowrap">
        <span className="font-bold text-accent-300">50% OFF</span> — Limited Stock
      </span>
      <span className="text-brand-400">·</span>
      <span className="whitespace-nowrap">📦 Ships in 24 hrs</span>
      <span className="text-brand-400">·</span>
      <span className="whitespace-nowrap">🛡️ 7-Day Replacement</span>
      <span className="text-brand-400">·</span>
      <span className="whitespace-nowrap">💳 Pay on Delivery</span>
    </>
  );

  return (
    <div data-announcement className="overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 py-2.5 text-sm font-medium text-brand-100">
      <div className="flex w-max animate-marquee sm:w-auto sm:animate-none sm:justify-center">
        <p className="flex shrink-0 items-center gap-5 px-6 sm:gap-4 sm:px-0">
          {content}
        </p>
        <p className="flex shrink-0 items-center gap-5 px-6 sm:hidden" aria-hidden="true">
          {content}
        </p>
      </div>
    </div>
  );
}
