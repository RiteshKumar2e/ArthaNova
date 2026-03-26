// ─────────────────────────────────────────────────────────────
//  Turso (libSQL) direct client wrapper
// ─────────────────────────────────────────────────────────────
import { createClient } from '@libsql/client';
import 'dotenv/config';

/**
 * Prepares the connection parameters. 
 * If DATABASE_URL contains ?authToken=, it extracts it for reliability.
 */
function getDbConfig() {
  const fullUrl = process.env.DATABASE_URL;
  if (!fullUrl) {
    console.error('❌ DATABASE_URL is missing from environment variables!');
    return { url: 'file:./local.db' }; // Fallback to local file if absolutely necessary
  }
  
  // Extract token from URL if present
  if (fullUrl.includes('?authToken=')) {
    const [url, authToken] = fullUrl.split('?authToken=');
    return { url, authToken };
  }
  
  return { url: fullUrl };
}

const config = getDbConfig();

// Initialize the libSQL client
const client = createClient(config);

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
