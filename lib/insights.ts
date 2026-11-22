import { daysSince } from "./format";
import type { Product } from "./types";

export function frozenStock(products: Product[]) {
  return products.filter((p) => p.stock > 0 && daysSince(p.lastSoldAt) > 30);
}

export function frozenCapital(products: Product[]) {
  return frozenStock(products).reduce((s, p) => s + p.cost * p.stock, 0);
}

export function starProducts(products: Product[]) {
  return [...products]
    .filter((p) => p.unitsSold30d >= 20)
    .sort((a, b) => b.unitsSold30d - a.unitsSold30d);
}

export function daysCover(p: Product) {
  const daily = p.unitsSold30d / 30;
  if (daily <= 0) return 999;
  return Math.round(p.stock / daily);
}

export function remateIdea(p: Product) {
  if (p.category === "Tablets" || p.category === "Laptops") {
    return `Combo: ${p.name} + cargador 65W (−8%)`;
  }
  if (p.category === "Wearables") {
    return `Remate 15% + case de regalo`;
  }
  return `Oferta 2x1 en accesorios junto a ${p.name}`;
}
