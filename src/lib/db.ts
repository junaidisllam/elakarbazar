import mysql from 'mysql2/promise';

const poolConfig = {
  host: process.env.DB_HOST ?? '127.0.0.1',
  user: process.env.DB_USER ?? 'u443657777_elakarbazar',
  password: process.env.DB_PASSWORD ?? 'Fahim(99)',
  database: process.env.DB_DATABASE ?? 'u443657777_elakarbazar',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Prevent duplicate connections in development mode during Next.js Hot Module Replacement (HMR)
const globalForDb = globalThis as unknown as {
  connPool: mysql.Pool | undefined;
};

const pool = globalForDb.connPool ?? mysql.createPool(poolConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.connPool = pool;
}

export default pool;
