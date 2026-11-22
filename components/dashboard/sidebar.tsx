'use client';

import { usePathname } from 'next/navigation';
import { Button, ButtonLink } from '@/components/ui';
import { menuItems } from './nav-items';

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-48 border-r border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] bg-background hidden md:flex flex-col justify-between">
      <div>
        <div className="px-4 h-14 flex items-center border-b border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))]">
          <p className="text-xs font-bold tracking-wider">
            RETAIL <span className="text-primary">OS</span>
          </p>
        </div>
        <nav className="p-2 space-y-0.5">
          {menuItems.map((item) => {
            const isActive = path === item.href;
            return (
              <ButtonLink
                key={item.href}
                href={item.href}
                variant={isActive ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-2.5 h-9 px-3 text-sm border-transparent ${
                  isActive ? 'text-foreground' : 'text-muted'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-primary' : 'text-subtle'}`}>{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </ButtonLink>
            );
          })}
        </nav>
      </div>
      <div className="p-2 border-t border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))]">
        <Button
          variant="ghost"
          className="w-full h-9 text-xs text-muted"
          onClick={() => {
            localStorage.removeItem('retailos_auth');
            window.location.href = '/login';
          }}
        >
          Salir
        </Button>
      </div>
    </aside>
  );
}
