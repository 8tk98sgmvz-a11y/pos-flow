'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ErrorBoundary } from './error-boundary';

/** Un fallo en una ruta no deja bloqueadas las demás. */
export function RouteBoundary({ children }: { children: ReactNode }) {
  const path = usePathname();
  return <ErrorBoundary key={path}>{children}</ErrorBoundary>;
}
