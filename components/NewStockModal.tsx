"use client";

import React, { useState } from "react";
import { X, Package, Sparkles, Image as ImageIcon } from "lucide-react";
import { SerialTracker } from "./SerialTracker"; 
import { useStore } from "@/lib/store";

interface NewStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (productData: any) => void;
}

const CATEGORIES = [
  { id: "celulares", label: "Celulares" },
  { id: "audio", label: "Audio" },
  { id: "accesorios", label: "Accesorios" },
  { id: "textil", label: "Textil / Ropa" },
];

export function NewStockModal({ isOpen, onClose, onSave }: NewStockModalProps) {
  const store = useStore();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("celulares");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState(1);
  const [serials, setSerials] = useState<string[]>([]);
  const [image, setImage] = useState("");

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setImage(compressedBase64);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProduct = {
      id: "prod-" + Date.now(),
      name,
      category,
      sku: sku || "SKU-" + Math.floor(Math.random() * 9000 + 1000),
      price: parseFloat(price) || 0,
      stock,
      image,
      serials: category === "celulares" || category === "audio" ? serials : [],
    };

    // Si el componente padre pasó una función onSave, la ejecutamos
    if (onSave) {
      onSave(newProduct);
    } 
    
    // Inserción directa garantizada en el store global de Zustand
    if (store && store.addProduct) {
      store.addProduct(newProduct);
    }

    // Limpieza y cierre inmediato
    setName("");
    setSku("");
    setPrice("");
    setImage("");
    setStock(1);
    setSerials([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl apple-glass-card border border-slate-800 rounded-3xl p-6 shadow-2xl relative bg-slate-950">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Alta y Gestión de Stock</h2>
              <p className="text-xs text-slate-400">Registro atómico de alta velocidad</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5 pt-4">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nombre del Producto</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. iPhone 11 128GB"
                className="w-full bg-slate-900/90 border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">Categoría</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition border ${
                      category === cat.id
                        ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10"
                        : "bg-slate-900/60 border-white/10 text-slate-400 hover:border-white/20"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Fotografía del Producto (Catálogo Móvil)</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full bg-slate-900/90 border border-white/10 focus:border-emerald-500 rounded-xl px-3 py-2 text-xs text-slate-400 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-500/20 file:text-emerald-300 hover:file:bg-emerald-500/30 transition outline-none cursor-pointer"
                  />
                </div>
                {image ? (
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-emerald-500/40 flex-shrink-0 shadow-md">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-600 flex-shrink-0">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Código de Barras / SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="Ej. APP-11"
                  className="w-full bg-slate-900/90 border border-white/10 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Precio de Venta (S/)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-semibold text-emerald-400">S/</span>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-900/90 border border-white/10 focus:border-emerald-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-medium text-slate-300">Stock Inicial</label>
                <span className="text-[10px] text-slate-500">Unidades a ingresar al inventario</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/90 border border-white/10 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setStock(Math.max(1, stock - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 transition"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-semibold text-white">{stock}</span>
                <button
                  type="button"
                  onClick={() => setStock(stock + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 text-white hover:bg-white/10 transition"
                >
                  +
                </button>
              </div>
            </div>

            {(category === "celulares" || category === "audio") && (
              <SerialTracker quantity={stock} serials={serials} onChange={setSerials} />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Registrar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}