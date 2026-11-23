# POS Flow

Software POS profesional (Next.js, Tailwind CSS, Lucide) con tema oscuro.

## Módulos

1. **Control de caja y series** — verificador Yape/Plin (últimos 4 + hora de captura POS), IMEI/serie obligatorio, arqueo de caja ciego.
2. **Pantalla POS y catálogo móvil** — búsqueda, stock, carrito con IGV 18% y pedido por WhatsApp.
3. **Inteligencia comercial** — capital congelado (+30 días sin rotar) y productos estrella.
4. **Cobranzas y garantías** — fiados con recordatorio WhatsApp y ticket digital vinculado al IMEI.

## Requisitos

- Node.js 18 o superior

## Arranque

```bash
cd "%USERPROFILE%\Pos-flow"
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). Los datos de demo se guardan en `localStorage`.
