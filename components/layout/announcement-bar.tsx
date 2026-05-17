export function AnnouncementBar() {
  const content = (
    <>
      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
        </span>
        Free Shipping
      </span>
      <span className="text-brand-400">|</span>
      <span className="whitespace-nowrap">Safe for Kids Ages 3+</span>
      <span className="text-brand-400">|</span>
      <span className="whitespace-nowrap">No-Mess Drawing</span>
      <span className="text-brand-400">|</span>
      <span className="whitespace-nowrap">Reusable 10,000+ Times</span>
    </>
  );

  return (
    <div data-announcement className="overflow-hidden bg-gradient-to-r from-brand-800 via-brand-700 to-brand-800 py-2.5 text-sm font-medium text-brand-100">
      <div className="flex w-max animate-marquee sm:w-auto sm:animate-none sm:justify-center">
        <p className="flex shrink-0 items-center gap-6 px-6 sm:gap-3 sm:px-0">
          {content}
        </p>
        <p className="flex shrink-0 items-center gap-6 px-6 sm:hidden" aria-hidden="true">
          {content}
        </p>
      </div>
    </div>
  );
}
