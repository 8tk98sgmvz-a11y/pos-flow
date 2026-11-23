   "use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  serials?: string[];
  requiresSerial?: boolean;
  unitsSold30d?: number;
}

interface CartItem {
  productId: string;
  qty: number;
}

interface Sale {
  id: string;
  total: number;
  date: string;
  yapeCheck?: boolean;
  items?: CartItem[];
}

interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number;
  lastPurchaseAt: string;
  lastReminderAt: string | null;
}

interface CashEntry {
  id: string;
  difference: number;
  date: string;
}

interface YapeCheck {
  id: string;
  mismatch: boolean;
  amount?: number;
}

interface ShopInfo {
  name: string;
  whatsapp: string;
}

interface StoreContextType {
  products: Product[];
  sales: Sale[];
  customers: Customer[];
  cashHistory: CashEntry[];
  serials: string[];
  yapeChecks: YapeCheck[];
  cart: CartItem[];
  search: string;
  cashSession: boolean;
  shop: ShopInfo;
  cartTotals: { subtotal: number; igv: number; total: number };
  setSearch: (q: string) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  lookupSerial: (serial: string) => any;
  addToCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  removeFromCart: (productId: string) => void;
  checkout: (data: { paymentMethod: string; customerId?: string; customerName?: string; yape?: any }) => { ok: boolean; saleId?: string; error?: string };
  recordReminder: (id: string) => void;
  payCredit: (id: string, amount: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  const [sales, setSales] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "c1", name: "Cliente Mostrador", phone: "", balance: 0, lastPurchaseAt: "", lastReminderAt: null }
  ]);
  const [cashHistory, setCashHistory] = useState<CashEntry[]>([]);
  const [serials, setSerials] = useState<string[]>([]);
  const [yapeChecks, setYapeChecks] = useState<YapeCheck[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [cashSession, setCashSession] = useState(true);
  const [shop] = useState<ShopInfo>({ name: "Master Apple Peru", whatsapp: "51999999999" });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/productos", { cache: "no-store" });
        if (!res.ok) return;
        const rows = await res.json();
        if (!Array.isArray(rows)) return;
        setProducts(
          rows.map((p: { id: string; nombre?: string; sku?: string; precio?: number; stock?: number; imagen?: string }) => ({
            id: p.id,
            name: String(p.nombre || ""),
            category: "",
            sku: String(p.sku || ""),
            price: Number(p.precio || 0),
            stock: Number(p.stock || 0),
            image: p.imagen,
          }))
        );
      } catch {
        /* ignore */
      }
    };
    load();
  }, []);

  const addProduct = (product: Product) => {
    setProducts((prev) => [product, ...prev]);
    void fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: product.id,
        nombre: product.name,
        precio: product.price,
        costo: 0,
        stock: product.stock,
        sku: product.sku,
        imagen: product.image || "",
      }),
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const lookupSerial = (serial: string) => {
    return products.find((p) => p.serials?.includes(serial));
  };

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { productId, qty: 1 }];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, qty } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const cartTotals = React.useMemo(() => {
    const subtotal = cart.reduce((acc, item) => {
      const p = products.find((x) => x.id === item.productId);
      return acc + (p?.price ?? 0) * item.qty;
    }, 0);
    const igv = subtotal * 0.18;
    const total = subtotal;
    return { subtotal, igv, total };
  }, [cart, products]);

  const checkout = (data: { paymentMethod: string; customerId?: string; customerName?: string; yape?: any }) => {
    if (cart.length === 0) {
      return { ok: false, error: "El carrito está vacío" };
    }

    const newSale: Sale = {
      id: "V-" + Date.now().toString().slice(-4),
      total: cartTotals.total,
      date: new Date().toISOString(),
      items: [...cart],
    };

    setSales((prev) => [newSale, ...prev]);
    setCart([]);

    setProducts((prev) =>
      prev.map((prod) => {
        const itemInCart = cart.find((ci) => ci.productId === prod.id);
        if (itemInCart) {
          return { ...prod, stock: Math.max(0, prod.stock - itemInCart.qty) };
        }
        return prod;
      })
    );

    return { ok: true, saleId: newSale.id };
  };

  const recordReminder = (id: string) => {
    const at = new Date().toISOString();
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, lastReminderAt: at } : c)));
  };

  const payCredit = (id: string, amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, balance: Math.max(0, +(c.balance - amount).toFixed(2)) } : c
      )
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        sales,
        customers,
        cashHistory,
        serials,
        yapeChecks,
        cart,
        search,
        cashSession,
        shop,
        cartTotals,
        setSearch,
        addProduct,
        deleteProduct,
        lookupSerial,
        addToCart,
        updateQty,
        removeFromCart,
        checkout,
        recordReminder,
        payCredit,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore debe ser usado dentro de un StoreProvider");
  }
  return context;
}