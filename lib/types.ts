export type PaymentMethod = "efectivo" | "yape" | "plin" | "tarjeta" | "fiado";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  requiresSerial: boolean;
  lastSoldAt: string | null;
  createdAt: string;
  unitsSold30d: number;
};

export type CartLine = {
  productId: string;
  qty: number;
  serials: string[];
};

export type YapePlinCheck = {
  id: string;
  channel: "yape" | "plin";
  last4: string;
  voucherClock: string;
  capturedAt: string;
  mismatch: boolean;
  amount?: number;
  saleId?: string;
};

export type SaleItem = {
  productId: string;
  name: string;
  qty: number;
  unitPrice: number;
  serials: string[];
};

export type Sale = {
  id: string;
  createdAt: string;
  items: SaleItem[];
  subtotal: number;
  igv: number;
  total: number;
  paymentMethod: PaymentMethod;
  yapeCheck?: YapePlinCheck;
  customerId?: string;
  customerName?: string;
};

export type SerialRecord = {
  serial: string;
  productId: string;
  productName: string;
  saleId: string;
  soldAt: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  balance: number;
  lastPurchaseAt: string;
  lastReminderAt: string | null;
};

export type Warranty = {
  id: string;
  saleId: string;
  productName: string;
  serial: string;
  customerName: string;
  issuedAt: string;
  months: number;
};

export type CashSession = {
  id: string;
  openedAt: string;
  openingAmount: number;
  closedAt: string | null;
  countedAmount: number | null;
  expectedCash: number | null;
  difference: number | null;
  note: string;
};

export type StoreState = {
  products: Product[];
  cart: CartLine[];
  sales: Sale[];
  serials: SerialRecord[];
  customers: Customer[];
  warranties: Warranty[];
  yapeChecks: YapePlinCheck[];
  cashSession: CashSession | null;
  cashHistory: CashSession[];
  shop: {
    name: string;
    phone: string;
    whatsapp: string;
  };
};
