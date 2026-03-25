// ─────────────────────────────────────────────────────────────
//  Turso (libSQL) direct client wrapper
// ─────────────────────────────────────────────────────────────
import { createClient } from '@libsql/client';
import 'dotenv/config';

// Initialize the libSQL client
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'libsql://arthanova-riteshkumar2e.aws-ap-south-1.turso.io',
  authToken: process.env.TURSO_AUTH_TOKEN,
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
