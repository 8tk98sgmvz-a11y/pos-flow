'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { menuItems } from './nav-items';

export function CxpSidebar() {
  const path = usePathname();

  return (
    <aside className="w-[180px] shrink-0 bg-[#08101C] border-r border-white/5 hidden md:flex flex-col">
      <div className="px-4 py-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black">R</div>
          <div>
            <p className="text-[13px] font-bold">RETAIL OS</p>
            <p className="text-[8px] text-muted tracking-[0.16em] uppercase">Por pagar</p>
          </div>
        </Link>
      </div>
      <nav className="p-2 space-y-0.5">
        {menuItems.map((item) => {
          const active = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] ${
                active ? 'bg-blue-600/20 text-white' : 'text-white/80 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
