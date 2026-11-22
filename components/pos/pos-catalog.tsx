import type { KeyboardEvent, RefObject } from 'react';
import { PosProductCard } from './pos-product-card';
import { PosProductGrid } from './pos-product-grid';
import { PosSearch } from './pos-search';

type CatalogProduct = {
  id: string;
  nombre: string;
  precio: number;
  costo: number;
  stock: number;
  sku: string;
};

export function PosCatalog<T extends CatalogProduct>({
  searchRef,
  searchTerm,
  onSearchChange,
  onSearchKeyDown,
  productos,
  onAdd,
  onRestock,
}: {
  searchRef: RefObject<HTMLInputElement | null>;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  onSearchKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  productos: T[];
  onAdd: (prod: T) => void;
  onRestock: (prod: T) => void;
}) {
  return (
    <div className="lg:col-span-2">
      <PosSearch
        ref={searchRef}
        value={searchTerm}
        onChange={onSearchChange}
        onKeyDown={onSearchKeyDown}
      />
      <PosProductGrid>
        {productos.map((prod) => (
          <PosProductCard
            key={prod.id}
            nombre={prod.nombre}
            precio={prod.precio}
            costo={prod.costo}
            stock={prod.stock}
            sku={prod.sku}
            onAdd={() => onAdd(prod)}
            onRestock={() => onRestock(prod)}
          />
        ))}
      </PosProductGrid>
    </div>
  );
}
