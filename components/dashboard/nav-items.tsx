import type { ReactNode } from 'react';
import { Icons } from './icons';

export type MenuItem = { name: string; icon: ReactNode; href: string };

/** Menú principal del negocio. El resto de rutas sigue existiendo. */
export const menuItems: MenuItem[] = [
  { name: 'POS', icon: <Icons.Monitor />, href: '/pos' },
  { name: 'Resumen', icon: <Icons.Home />, href: '/' },
  { name: 'Arqueo', icon: <Icons.Eye />, href: '/arqueo' },
  { name: 'Fiados', icon: <Icons.Book />, href: '/cuentas-por-cobrar' },
  { name: 'Por pagar', icon: <Icons.Wallet />, href: '/cuentas-por-pagar' },
  { name: 'Flujo de Caja', href: '/flujo-de-caja', icon: <Icons.Flow /> },
];
