'use client';

import type { ReactNode } from 'react';
import { MobileNav } from './mobile-nav';
import { Sidebar } from './sidebar';

export function AppShell({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 pb-14 md:pb-0">
        <header className="h-14 px-4 md:px-5 flex items-center justify-between gap-3 border-b border-[rgb(var(--ds-color-border)_/_var(--ds-border-opacity))] sticky top-0 bg-background/90 backdrop-blur-xl z-20">
          <h1 className="text-lg font-semibold tracking-tight truncate">{title}</h1>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
        <div className="p-4 md:p-5 flex-1 w-full">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}

export function DashboardShell({
  action,
  children,
}: {
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <AppShell title="Resumen" action={action}>
      {children}
    </AppShell>
  );
}
