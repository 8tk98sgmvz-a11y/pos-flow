import { neonConfig, Pool, type PoolClient } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const TABLES = [
  'ventas',
  'gastos',
  'ingresos',
  'productos',
  'cuentas_por_cobrar',
  'cuentas_por_pagar',
  'arqueos',
  'venta_items',
  'unidades',
  'garantias',
  'pedidos',
  'negocio',
  'conciliacion_ids',
  'conciliacion_matches',
] as const;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS ventas (
    id TEXT PRIMARY KEY,
    "createdAt" TEXT NOT NULL,
    "montoTotal" DOUBLE PRECISION NOT NULL,
    "costoTotal" DOUBLE PRECISION NOT NULL DEFAULT 0,
    canal TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT NOT NULL DEFAULT 'PENDING',
    "idempotencyKey" TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS gastos (
    id TEXT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    monto DOUBLE PRECISION NOT NULL,
    canal TEXT NOT NULL DEFAULT 'EFECTIVO',
    "createdAt" TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS ingresos (
    id TEXT PRIMARY KEY,
    descripcion TEXT NOT NULL,
    monto DOUBLE PRECISION NOT NULL,
    canal TEXT NOT NULL DEFAULT 'EFECTIVO',
    "createdAt" TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio DOUBLE PRECISION NOT NULL,
    costo DOUBLE PRECISION NOT NULL DEFAULT 0,
    stock DOUBLE PRECISION NOT NULL DEFAULT 0,
    sku TEXT,
    imagen TEXT,
    "createdAt" TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS cuentas_por_cobrar (
    id TEXT PRIMARY KEY,
    "createdAt" TEXT NOT NULL,
    cliente TEXT NOT NULL,
    descripcion TEXT,
    monto DOUBLE PRECISION NOT NULL,
    estado TEXT NOT NULL DEFAULT 'ABIERTA',
    "ventaId" TEXT,
    telefono TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS cuentas_por_pagar (
    id TEXT PRIMARY KEY,
    "createdAt" TEXT NOT NULL,
    proveedor TEXT NOT NULL,
    descripcion TEXT,
    monto DOUBLE PRECISION NOT NULL,
    estado TEXT NOT NULL DEFAULT 'ABIERTA',
    "fechaVencimiento" TEXT,
    categoria TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS arqueos (
    id TEXT PRIMARY KEY,
    "createdAt" TEXT,
    declarado DOUBLE PRECISION,
    sistema DOUBLE PRECISION,
    diferencia DOUBLE PRECISION
  )`,
  `CREATE TABLE IF NOT EXISTS venta_items (
    id TEXT PRIMARY KEY,
    "ventaId" TEXT NOT NULL,
    "productoId" TEXT,
    nombre TEXT NOT NULL,
    sku TEXT,
    quantity DOUBLE PRECISION NOT NULL,
    precio DOUBLE PRECISION NOT NULL,
    costo DOUBLE PRECISION NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS unidades (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL,
    codigo TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'EN_TIENDA',
    "createdAt" TEXT NOT NULL,
    "vendidaAt" TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS garantias (
    id TEXT PRIMARY KEY,
    codigo TEXT NOT NULL,
    sku TEXT,
    producto TEXT,
    dias INTEGER NOT NULL DEFAULT 30,
    "createdAt" TEXT NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS pedidos (
    id TEXT PRIMARY KEY,
    "createdAt" TEXT NOT NULL,
    producto TEXT NOT NULL,
    sku TEXT,
    precio DOUBLE PRECISION NOT NULL DEFAULT 0,
    estado TEXT NOT NULL DEFAULT 'PENDIENTE'
  )`,
  `CREATE TABLE IF NOT EXISTS negocio (
    id INTEGER PRIMARY KEY,
    nombre TEXT DEFAULT '',
    ruc TEXT DEFAULT '',
    whatsapp TEXT DEFAULT '',
    yape TEXT DEFAULT '',
    CONSTRAINT negocio_singleton CHECK (id = 1)
  )`,
  `CREATE TABLE IF NOT EXISTS conciliacion_ids (
    "ventaId" TEXT PRIMARY KEY
  )`,
  `CREATE TABLE IF NOT EXISTS conciliacion_matches (
    "bancoRef" TEXT PRIMARY KEY,
    "ventaId" TEXT NOT NULL,
    monto DOUBLE PRECISION NOT NULL
  )`,
  `INSERT INTO negocio (id, nombre, ruc, whatsapp, yape)
   VALUES (1, '', '', '', '')
   ON CONFLICT (id) DO NOTHING`,
];

let pool: Pool | null = null;
let schemaReady: Promise<void> | null = null;

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Falta DATABASE_URL');
  }
  if (!pool) {
    pool = new Pool({ connectionString, max: 5 });
  }
  return pool;
}

function toPg(sql: string) {
  let n = 0;
  return sql.replace(/\?/g, () => `$${++n}`);
}

async function query(client: Pool | PoolClient, sql: string, params: unknown[] = []) {
  return client.query(toPg(sql), params as never[]);
}

export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      const client = await getPool().connect();
      try {
        for (const statement of SCHEMA) {
          await client.query(statement);
        }
      } finally {
        client.release();
      }
    })().catch((error) => {
      schemaReady = null;
      throw error;
    });
  }
  await schemaReady;
}

export async function all<T extends Record<string, unknown> = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T[]> {
  await ensureSchema();
  const result = await query(getPool(), sql, params);
  return result.rows as T[];
}

export async function get<T extends Record<string, unknown> = Record<string, unknown>>(
  sql: string,
  params: unknown[] = []
): Promise<T | undefined> {
  const rows = await all<T>(sql, params);
  return rows[0];
}

export async function run(sql: string, params: unknown[] = []): Promise<void> {
  await ensureSchema();
  await query(getPool(), sql, params);
}

export type DbTx = {
  all: <T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ) => Promise<T[]>;
  get: <T extends Record<string, unknown> = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ) => Promise<T | undefined>;
  run: (sql: string, params?: unknown[]) => Promise<void>;
};

export async function transaction<T>(fn: (tx: DbTx) => Promise<T>): Promise<T> {
  await ensureSchema();
  const client = await getPool().connect();
  const tx: DbTx = {
    all: async <T extends Record<string, unknown> = Record<string, unknown>>(sql: string, params: unknown[] = []) => {
      const result = await query(client, sql, params);
      return result.rows as T[];
    },
    get: async <T extends Record<string, unknown> = Record<string, unknown>>(sql: string, params: unknown[] = []) => {
      const result = await query(client, sql, params);
      return result.rows[0] as T | undefined;
    },
    run: async (sql, params = []) => {
      await query(client, sql, params);
    },
  };

  try {
    await client.query('BEGIN');
    const value = await fn(tx);
    await client.query('COMMIT');
    return value;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

function quoteIdent(name: string) {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(name)) {
    throw new Error('Columna inválida');
  }
  return `"${name}"`;
}

export async function dumpDatabase() {
  await ensureSchema();
  const data: Record<string, Record<string, unknown>[]> = {};
  for (const table of TABLES) {
    data[table] = await all(`SELECT * FROM ${table}`);
  }
  return data;
}

export async function restoreDatabase(input: unknown) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new Error('El backup tiene que ser un objeto JSON');
  }
  const data = input as Record<string, unknown>;
  await transaction(async (tx) => {
    for (const table of [...TABLES].reverse()) {
      await tx.run(`DELETE FROM ${table}`);
    }
    for (const table of TABLES) {
      const rows = data[table];
      if (!Array.isArray(rows)) continue;
      for (const row of rows) {
        if (!row || typeof row !== 'object' || Array.isArray(row)) continue;
        const record = row as Record<string, unknown>;
        const keys = Object.keys(record);
        if (keys.length === 0) continue;
        const cols = keys.map(quoteIdent).join(', ');
        const placeholders = keys.map(() => '?').join(', ');
        await tx.run(
          `INSERT INTO ${table} (${cols}) VALUES (${placeholders})`,
          keys.map((key) => record[key] ?? null)
        );
      }
    }
  });
}
