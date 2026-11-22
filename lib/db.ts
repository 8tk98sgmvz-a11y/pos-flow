import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'retailos.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS ventas (
    id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    montoTotal REAL NOT NULL,
    costoTotal REAL DEFAULT 0,
    canal TEXT NOT NULL,
    descripcion TEXT,
    estado TEXT DEFAULT 'PENDING',
    idempotencyKey TEXT
  );

  CREATE TABLE IF NOT EXISTS gastos (
    id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    descripcion TEXT,
    monto REAL NOT NULL,
    canal TEXT DEFAULT 'EFECTIVO'
  );

  CREATE TABLE IF NOT EXISTS ingresos (
    id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    monto REAL NOT NULL,
    canal TEXT DEFAULT 'EFECTIVO'
  );

  CREATE TABLE IF NOT EXISTS productos (
    id TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    costo REAL NOT NULL DEFAULT 0,
    stock REAL NOT NULL DEFAULT 0,
    sku TEXT,
    imagen TEXT,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cuentas_por_cobrar (
    id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    cliente TEXT NOT NULL,
    descripcion TEXT,
    monto REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'ABIERTA',
    ventaId TEXT,
    telefono TEXT
  );

  CREATE TABLE IF NOT EXISTS cuentas_por_pagar (
    id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    proveedor TEXT NOT NULL,
    descripcion TEXT,
    monto REAL NOT NULL,
    estado TEXT NOT NULL DEFAULT 'ABIERTA',
    fechaVencimiento TEXT,
    categoria TEXT
  );

  CREATE TABLE IF NOT EXISTS arqueos (
    id TEXT PRIMARY KEY,
    createdAt TEXT,
    declarado REAL,
    sistema REAL,
    diferencia REAL
  );

  CREATE TABLE IF NOT EXISTS venta_items (
    id TEXT PRIMARY KEY,
    ventaId TEXT NOT NULL,
    productoId TEXT,
    nombre TEXT NOT NULL,
    sku TEXT,
    quantity REAL NOT NULL,
    precio REAL NOT NULL,
    costo REAL NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS unidades (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL,
    codigo TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'EN_TIENDA',
    createdAt TEXT NOT NULL,
    vendidaAt TEXT
  );

  CREATE TABLE IF NOT EXISTS garantias (
    id TEXT PRIMARY KEY,
    codigo TEXT NOT NULL,
    sku TEXT,
    producto TEXT,
    dias INTEGER NOT NULL DEFAULT 30,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS pedidos (
    id TEXT PRIMARY KEY,
    createdAt TEXT NOT NULL,
    producto TEXT NOT NULL,
    sku TEXT,
    precio REAL NOT NULL DEFAULT 0,
    estado TEXT NOT NULL DEFAULT 'PENDIENTE'
  );

  CREATE TABLE IF NOT EXISTS negocio (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    nombre TEXT DEFAULT '',
    ruc TEXT DEFAULT '',
    whatsapp TEXT DEFAULT '',
    yape TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS conciliacion_ids (
    ventaId TEXT PRIMARY KEY
  );

  CREATE TABLE IF NOT EXISTS conciliacion_matches (
    bancoRef TEXT PRIMARY KEY,
    ventaId TEXT NOT NULL,
    monto REAL NOT NULL
  );

  INSERT OR IGNORE INTO negocio (id, nombre, ruc, whatsapp, yape) VALUES (1, '', '', '', '');
`);

export default db;