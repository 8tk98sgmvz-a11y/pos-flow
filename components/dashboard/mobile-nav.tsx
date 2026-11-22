'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from './nav-items';

export function MobileNav() {
  const path = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-background/95 backdrop-blur-xl border-t border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] z-50 flex items-center justify-around px-1">
      {menuItems.map((item) => {
        const isActive = path === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center min-w-0 flex-1 h-full gap-0.5 px-1 ${
              isActive ? 'text-primary' : 'text-subtle'
            }`}
          >
            <span>{item.icon}</span>
            <span className="text-[10px] font-medium leading-tight text-center">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
