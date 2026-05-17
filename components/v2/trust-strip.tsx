const badges = [
  { icon: TruckIcon, label: 'Free Delivery' },
  { icon: ReturnIcon, label: '7-Day Returns' },
  { icon: CashIcon, label: 'COD Available' },
];

function TruckIcon() {
  return (
    <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H21M3.375 14.25h3.75m0 0V11.25m0 3h10.5V6.375a1.125 1.125 0 0 0-1.125-1.125H3.375m3.75 9V11.25m0 0h7.5" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
    </svg>
  );
}

function CashIcon() {
  return (
    <svg className="h-4 w-4 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
    </svg>
  );
}

export function TrustStrip() {
  return (
    <div className="border-y border-brand-100 bg-brand-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {badges.map((badge, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <badge.icon />
            <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-800">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
