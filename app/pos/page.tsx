'use client';

import React, { useState, useEffect, useRef } from 'react';
import { registrarFiado } from '@/lib/cxc';
import { pingLive } from '@/lib/live';
import { isolateAsync } from '@/lib/isolate';
import { money } from '@/lib/money';
import { runAfterSale } from '@/lib/pos-after-sale';
import { PosCart } from '@/components/pos/pos-cart';
import { PosCatalog } from '@/components/pos/pos-catalog';
import { PosFiadoModal } from '@/components/pos/pos-fiado-modal';
import { PosProductModal } from '@/components/pos/pos-product-modal';
import { PosShell } from '@/components/pos/pos-shell';
import { PosWorkspace } from '@/components/pos/pos-workspace';
import { Button } from '@/components/ui';

interface Product {
  id: string;
  nombre: string;
  precio: number;
  costo: number;
  stock: number;
  sku: string;
  imagen: string;
}

interface CartItem extends Product {
  quantity: number;
}

type TicketSnap = {
  items: { nombre: string; quantity: number; precio: number }[];
  total: number;
  canal: string;
  recibido: number;
  vuelto: number;
};

type CanalPago = 'EFECTIVO' | 'YAPE' | 'TARJETA';

function toCanal(metodo: string): CanalPago {
  if (metodo === 'Yape' || metodo === 'Plin') return 'YAPE';
  if (metodo === 'Tarjeta') return 'TARJETA';
  return 'EFECTIVO';
}

function toNum(raw: string | number) {
  const n = Number(String(raw ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : 0;
}

async function apiListarProductos(): Promise<Product[]> {
  try {
    const res = await fetch('/api/productos');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function apiGuardarProducto(p: Product) {
  try {
    await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
  } catch {
    /* fallback local */
  }
}

export default function PosScreen() {
  const [metodoPago, setMetodoPago] = useState('Efectivo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fiadoOpen, setFiadoOpen] = useState(false);
  const [clienteFiado, setClienteFiado] = useState('');
  const [telFiado, setTelFiado] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [recibido, setRecibido] = useState('');
  const [toast, setToast] = useState('');

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [costo, setCosto] = useState('');
  const [stock, setStock] = useState('');
  const [sku, setSku] = useState('');
  const [imagen, setImagen] = useState('');

  const [productos, setProductos] = useState<Product[]>([]);
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const lastTicket = useRef<TicketSnap | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const busy = useRef(false);

  const persistProductos = (next: Product[]) => {
    setProductos(next);
  };

  const cargarProductos = async () => {
    try {
      let fromDb = await apiListarProductos();
      if (fromDb.length === 0) {
        const raw = localStorage.getItem('master_apple_productos');
        if (raw && raw !== 'undefined' && raw !== 'null') {
          const parsed = JSON.parse(raw) as Product[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            await Promise.all(
              parsed.map((p) =>
                apiGuardarProducto({
                  ...p,
                  precio: Number(p.precio || 0),
                  costo: Number(p.costo || 0),
                  stock: Number(p.stock || 0),
                })
              )
            );
            localStorage.removeItem('master_apple_productos');
            fromDb = await apiListarProductos();
          }
        }
      }
      const mapped = fromDb.map((p) => ({
        ...p,
        precio: Number(p.precio || 0),
        costo: Number(p.costo || 0),
        stock: Number(p.stock || 0),
      }));
      setProductos(mapped);
    } catch {
      setProductos([]);
    }
  };

  useEffect(() => {
    void cargarProductos();
    const vis = () => {
      if (document.visibilityState === 'visible') void cargarProductos();
    };
    document.addEventListener('visibilitychange', vis);
    return () => document.removeEventListener('visibilitychange', vis);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 1200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'F2') {
        e.preventDefault();
        setMetodoPago('Efectivo');
      }
      if (e.key === 'F3') {
        e.preventDefault();
        setMetodoPago('Yape');
      }
      if (e.key === 'F4') {
        e.preventDefault();
        setMetodoPago('Plin');
      }
      if (e.key === 'F5') {
        e.preventDefault();
        setMetodoPago('Tarjeta');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const total = money(carrito.reduce((acc, item) => acc + Number(item.precio || 0) * Number(item.quantity || 0), 0));
  const costoTotal = money(carrito.reduce((acc, item) => acc + Number(item.costo || 0) * Number(item.quantity || 0), 0));
  const rec = metodoPago === 'Efectivo' && !String(recibido).trim() ? total : toNum(recibido);
  const vuelto = rec - total;
  const efectivoCorto = metodoPago === 'Efectivo' && total > 0 && rec + 0.001 < total;

  const productosFiltrados = productos.filter((p) => {
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      return (
        String(p.nombre || '').toLowerCase().includes(q) ||
        String(p.sku || '').toLowerCase().includes(q)
      );
    }
    return Number(p.costo || 0) > 0 && Number(p.stock || 0) > 0;
  });

  const addToCart = (prod: Product) => {
    if (Number(prod.stock || 0) <= 0) {
      setToast('Sin stock');
      return;
    }
    setCarrito((prev) => {
      const found = prev.find((i) => i.id === prod.id);
      if (found) {
        if (found.quantity >= Number(prod.stock || 0)) {
          setToast('No hay más stock');
          return prev;
        }
        return prev.map((i) => (i.id === prod.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...prod, quantity: 1 }];
    });
    requestAnimationFrame(() => searchRef.current?.focus());
  };

  const reponerUno = async (prod: Product) => {
    const updated = { ...prod, stock: Number(prod.stock || 0) + 1 };
    const next = productos.map((p) => (p.id === prod.id ? updated : p));
    persistProductos(next);
    await apiGuardarProducto(updated);
    setToast(`+1 ${prod.nombre} · stock ${updated.stock}`);
  };

  const handleSearchEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    const q = searchTerm.trim();
    if (!q) return;
    const hit = productosFiltrados[0];
    if (hit) {
      addToCart(hit);
      setSearchTerm('');
      return;
    }
    const porCodigo = await isolateAsync(null, async () => {
      const { buscarPorCodigo } = await import('@/lib/imei');
      return buscarPorCodigo(q);
    });
    if (porCodigo && porCodigo.estado === 'EN_TIENDA') {
      const prod = productos.find(
        (p) => String(p.sku || '').trim().toLowerCase() === String(porCodigo.sku || '').trim().toLowerCase()
      );
      if (prod) {
        addToCart(prod);
        setSearchTerm('');
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImagen(String(reader.result || ''));
    reader.readAsDataURL(file);
  };

  const handleGuardarProducto = async () => {
    if (!nombre.trim() || !precio) {
      setToast('Nombre y precio son obligatorios');
      return;
    }
    const row: Product = {
      id: `${Date.now()}`,
      nombre: nombre.trim(),
      precio: Number(precio || 0),
      costo: Number(costo || 0),
      stock: Number(stock || 0),
      sku: sku.trim(),
      imagen,
    };
    persistProductos([row, ...productos]);
    setIsModalOpen(false);
    setNombre('');
    setPrecio('');
    setCosto('');
    setStock('');
    setSku('');
    setImagen('');
    setToast('Producto guardado');
    void apiGuardarProducto(row).then(() => pingLive());
  };

  const bajarStockLocal = (items: CartItem[]) => {
    setProductos((prev) =>
      prev.map((p) => {
        const inCart = items.find((c) => c.id === p.id);
        if (!inCart) return p;
        return { ...p, stock: Math.max(0, Number(p.stock || 0) - inCart.quantity) };
      })
    );
  };

  const postVenta = async (canal: string, descripcion: string, items: CartItem[]) => {
    const res = await fetch('/api/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        montoTotal: total,
        costoTotal,
        canal,
        descripcion,
        items: items.map((i) => ({
          productoId: i.id,
          nombre: i.nombre,
          sku: i.sku,
          quantity: i.quantity,
          precio: i.precio,
          costo: i.costo,
        })),
      }),
    });
    if (!res.ok) throw new Error('API error');
    return res.json();
  };

  const imprimirTicket = async (snap: TicketSnap) => {
    const negocio = await isolateAsync(
      { nombre: 'Ticket', ruc: '', whatsapp: '', yape: '' },
      async () => {
        const { leerNegocio } = await import('@/lib/negocio');
        return leerNegocio();
      }
    );
    const w = window.open('', 'ticket', 'width=360,height=640');
    if (!w) return;
    const rows = snap.items
      .map(
        (i) =>
          `<tr><td>${i.nombre} x${i.quantity}</td><td style="text-align:right">S/ ${(i.precio * i.quantity).toFixed(2)}</td></tr>`
      )
      .join('');
    w.document.write(`<!doctype html><html><head><title>Ticket</title>
      <style>body{font-family:ui-monospace,monospace;padding:16px} h1{font-size:16px} table{width:100%}</style>
      </head><body>
      <h1>${negocio.nombre || 'Ticket'}</h1>
      <p>${new Date().toLocaleString('es-PE')}</p>
      <table>${rows}</table>
      <p><b>Total S/ ${snap.total.toFixed(2)}</b></p>
      <p>${snap.canal}${snap.recibido ? ` · Recibido S/ ${snap.recibido.toFixed(2)} · Vuelto S/ ${snap.vuelto.toFixed(2)}` : ''}</p>
      </body></html>`);
    w.document.close();
    w.focus();
    w.print();
  };

  const cobrar = async () => {
    if (busy.current || carrito.length === 0) {
      if (carrito.length === 0) setToast('Carrito vacío');
      return;
    }
    if (metodoPago === 'Efectivo' && rec + 0.001 < total) {
      setToast(`En efectivo faltan S/ ${(total - rec).toFixed(2)}`);
      return;
    }

    const items = carrito;
    const snap: TicketSnap = {
      items: items.map((i) => ({ nombre: i.nombre, quantity: i.quantity, precio: i.precio })),
      total,
      canal: metodoPago,
      recibido: rec,
      vuelto: vuelto > 0 ? vuelto : 0,
    };
    lastTicket.current = snap;
    const descripcion = items.map((i) => `${i.nombre} x${i.quantity}`).join(', ');

    busy.current = true;
    setCarrito([]);
    setRecibido('');
    bajarStockLocal(items);
    setToast(`Cobrado S/ ${total.toFixed(2)}`);

    try {
      await postVenta(toCanal(metodoPago), descripcion, items);
      pingLive();
      runAfterSale(items);
    } catch (e) {
      console.error(e);
      setCarrito(items);
      void cargarProductos();
      setToast('Error al guardar la venta');
    } finally {
      busy.current = false;
      setSearchTerm('');
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  };

  const grabarFiado = async () => {
    if (busy.current || carrito.length === 0) return;
    if (!clienteFiado.trim()) {
      setToast('Escribe el cliente');
      return;
    }

    const items = carrito;
    const cliente = clienteFiado;
    const tel = telFiado;
    const descripcion = items.map((i) => `${i.nombre} x${i.quantity}`).join(', ');

    busy.current = true;
    setCarrito([]);
    setFiadoOpen(false);
    setClienteFiado('');
    setTelFiado('');
    bajarStockLocal(items);
    setToast('Fiado registrado · no entra a caja');

    try {
      const data = await postVenta('FIADO', `FIADO ${cliente} · ${items.map((i) => i.nombre).join(', ')}`, items);
      await isolateAsync(undefined, () =>
        registrarFiado({
          cliente,
          descripcion,
          monto: total,
          ventaId: data?.id || '',
          telefono: tel,
        })
      );
      pingLive();
      runAfterSale(items);
    } catch {
      setCarrito(items);
      void cargarProductos();
      setToast('Error al guardar el fiado');
    } finally {
      busy.current = false;
      setSearchTerm('');
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  };

  return (
    <PosShell
      toast={toast}
      action={
        <Button variant="secondary" className="h-9 px-3 text-xs" onClick={() => setIsModalOpen(true)}>
          + Producto
        </Button>
      }
    >
      <PosWorkspace>
        <PosCatalog
          searchRef={searchRef}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchKeyDown={(e) => {
            if (e.key === 'Enter' && !searchTerm.trim()) {
              if (carrito.length) void cobrar();
              return;
            }
            void handleSearchEnter(e);
          }}
          productos={productosFiltrados}
          onAdd={addToCart}
          onRestock={reponerUno}
        />
        <PosCart
          carrito={carrito}
          total={total}
          metodoPago={metodoPago}
          onMetodoPago={setMetodoPago}
          onFiado={() => setFiadoOpen(true)}
          recibido={recibido}
          onRecibido={setRecibido}
          efectivoCorto={efectivoCorto}
          rec={rec}
          vuelto={vuelto}
          onCobrar={cobrar}
          showReprint={!!lastTicket.current}
          onReprint={() => lastTicket.current && imprimirTicket(lastTicket.current)}
        />
      </PosWorkspace>

      {isModalOpen && (
        <PosProductModal
          nombre={nombre}
          precio={precio}
          costo={costo}
          stock={stock}
          sku={sku}
          onNombre={setNombre}
          onPrecio={setPrecio}
          onCosto={setCosto}
          onStock={setStock}
          onSku={setSku}
          onImageChange={handleImageChange}
          onCancel={() => setIsModalOpen(false)}
          onSave={handleGuardarProducto}
        />
      )}

      {fiadoOpen && (
        <PosFiadoModal
          total={total}
          cliente={clienteFiado}
          telefono={telFiado}
          onCliente={setClienteFiado}
          onTelefono={setTelFiado}
          onCancel={() => setFiadoOpen(false)}
          onSave={grabarFiado}
        />
      )}
    </PosShell>
  );
}