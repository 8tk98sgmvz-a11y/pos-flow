import { FlujoSaleRow } from './flujo-sale-row';
import { FlujoSalesList } from './flujo-sales-list';

type Sale = {
  id?: string;
  createdAt?: string;
  canal?: string;
  descripcion?: string;
  montoTotal?: number;
};

export function FlujoSalesPanel({ empty, items }: { empty: boolean; items: Sale[] }) {
  return (
    <FlujoSalesList empty={empty}>
      {items.map((v, i) => (
        <FlujoSaleRow
          key={v.id || i}
          createdAt={v.createdAt}
          canal={v.canal}
          descripcion={v.descripcion}
          monto={v.montoTotal}
        />
      ))}
    </FlujoSalesList>
  );
}
