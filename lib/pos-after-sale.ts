import { isolateAsync } from '@/lib/isolate';

export type AfterSaleItem = { nombre: string; sku?: string; quantity: number };

/** Series, garantías y pedidos: no forman parte del cobro. Si fallan, la venta ya está. */
export function runAfterSale(items: AfterSaleItem[]) {
  void isolateAsync(undefined, async () => {
    const { disponiblesPorSku, marcarVendida } = await import('@/lib/imei');
    const { registrarGarantia } = await import('@/lib/garantias');
    await Promise.all(
      items.map(async (item) => {
        if (!item.sku) return;
        await isolateAsync(undefined, async () => {
          const disponibles = await disponiblesPorSku(item.sku as string);
          const take = disponibles.slice(0, item.quantity);
          await Promise.all(
            take.map(async (u) => {
              await isolateAsync(null, () => marcarVendida(u.codigo));
              await isolateAsync(undefined, () =>
                registrarGarantia({ codigo: u.codigo, sku: item.sku, producto: item.nombre })
              );
            })
          );
        });
      })
    );
  });

  void isolateAsync(undefined, async () => {
    const { listarPedidosPendientes, marcarPedidoAtendido } = await import('@/lib/pedidos');
    const pend = await listarPedidosPendientes();
    await Promise.all(
      pend
        .filter((ped) =>
          items.some(
            (c) =>
              String(c.sku || '').toLowerCase() === String(ped.sku || '').toLowerCase() ||
              String(c.nombre || '').toLowerCase() === String(ped.producto || '').toLowerCase()
          )
        )
        .map((ped) => isolateAsync(undefined, () => marcarPedidoAtendido(ped.id)))
    );
  });
}
