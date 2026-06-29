import mysql from 'mysql2/promise';

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'elakarbazar',
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
