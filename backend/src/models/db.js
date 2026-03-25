// ─────────────────────────────────────────────────────────────
//  Turso (libSQL) direct client wrapper
// ─────────────────────────────────────────────────────────────
import { createClient } from '@libsql/client';
import 'dotenv/config';

// Initialize the libSQL client using the combined DATABASE_URL 
// (Format: libsql://your-db-name.turso.io?authToken=your-token)
const client = createClient({
  url: process.env.DATABASE_URL || 'libsql://arthanova-riteshkumar2e.aws-ap-south-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzQ0MDYyMjcsImlkIjoiMDE5ZDIyZGEtMDMwMS03ZmVlLWFiNmMtNjEyODg3ZDFlNmE3IiwicmlkIjoiODg1YjVkYmEtYWVmOS00MDkyLWJjYTktNWFmYjZhN2JjN2Y3In0.RwrBzlKkfjSfhBkaLQXdr9DXE4XNOjNwSEV_iSr4mGs-VW0qHO7I7CZGQJPpDPoSaYts7moZNdfEXGtl3tPODA',
});

/**
 * Basic database helper functions to replace Prisma calls
 */
const db = {
  /**
   * Run a raw SQL query and return rows
   */
  query: async (sql, params = []) => {
    const result = await client.execute({ sql, args: params });
    return result.rows;
  },

  /**
   * Run a raw SQL query and return the first row
   */
  queryFirst: async (sql, params = []) => {
    const rows = await db.query(sql, params);
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Run a raw SQL query (INSERT, UPDATE, DELETE)
   */
  execute: async (sql, params = []) => {
    return await client.execute({ sql, args: params });
  },

  // Export the original client for complex transactions
  client
};

export default db;
