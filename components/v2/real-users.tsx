'use client';

const users = [
  { src: '/users/user-1.jpg', name: 'Vikram, Chennai', caption: 'Wearing at work daily' },
  { src: '/users/user-2.jpg', name: 'Neha, Jaipur', caption: 'Post-surgery recovery' },
  { src: '/users/user-3.jpg', name: 'Arjun, Hyderabad', caption: 'Gym & lifting support' },
  { src: '/users/user-4.jpg', name: 'Meera, Kolkata', caption: 'All-day desk comfort' },
  { src: '/users/user-5.jpg', name: 'Rahul, Lucknow', caption: 'Driving long hours' },
  { src: '/users/user-6.jpg', name: 'Ananya, Mumbai', caption: 'Invisible under kurta' },
];

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-brand-100">
      <span className="text-[11px] font-medium text-brand-600">{label}</span>
    </div>
  );
}

export function RealUsers() {
  return (
    <section className="px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-brand-600">
          Real Users, Real Relief
        </h2>
        <p className="mt-1 mb-6 text-[20px] font-black tracking-tight text-neutral-900">
          See Bracelite in action
        </p>
        <div className="grid grid-cols-2 gap-2">
          {users.map((user) => (
            <div key={user.name} className="group relative overflow-hidden rounded-lg">
              <div className="aspect-[4/5] w-full">
                <img
                  src={user.src}
                  alt={user.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.style.display = 'none';
                    const sibling = img.nextElementSibling as HTMLElement | null;
                    if (sibling) sibling.style.display = 'flex';
                  }}
                />
                <div className="hidden h-full w-full">
                  <Placeholder label={user.caption} />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 pt-8 pb-3">
                <p className="text-[12px] font-semibold text-white">{user.name}</p>
                <p className="text-[11px] text-white/70">{user.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
