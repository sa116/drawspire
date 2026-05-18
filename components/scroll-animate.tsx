import { ReactNode } from 'react';

export function ScrollAnimate({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-animate className={className}>
      {children}
    </div>
  );
}
