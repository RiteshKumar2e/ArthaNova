# Backend - db.js (Database Module) - Complete Line-by-Line Explanation (Hinglish Mein)

## File Path
`backend/src/models/db.js`

---

## 📌 IMPORTS (Lines 1-3)

```javascript
// ─────────────────────────────────────────────────────────────
//  Turso (libSQL) direct client wrapper
// ─────────────────────────────────────────────────────────────
import { createClient } from '@libsql/client';
import 'dotenv/config';
```

✅ **What it does:**
- `@libsql/client` = Turso database client library
- `dotenv/config` = load environment variables from `.env` file
- Comments explain: this is Turso (libSQL) not traditional database

---

## ⚙️ DATABASE CONFIG FUNCTION (Lines 8-25)

```javascript
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
```

✅ **What it does:** Parse database connection string
- Get DATABASE_URL from environment variables
- If missing, show error and fall back to local file
- Fallback helps in development but won't work for production

```javascript
  // Extract token from URL if present
  if (fullUrl.includes('?authToken=')) {
    const [url, authToken] = fullUrl.split('?authToken=');
    return { url, authToken };
  }
  
  return { url: fullUrl };
}
```

✅ **What it does:** Handle two connection string formats

**Format 1: With auth token in URL**
```javascript
// DATABASE_URL = "libsql://mydb-username.turso.io?authToken=secret123"
// After split:
// url = "libsql://mydb-username.turso.io"
// authToken = "secret123"
// Returns: { url: "...", authToken: "..." }
```

**Format 2: Token separate (or local)**
```javascript
// DATABASE_URL = "file:./local.db"
// Returns: { url: "file:./local.db" }
```

---

## 🔌 INITIALIZE CLIENT (Lines 27-31)

```javascript
const config = getDbConfig();

// Initialize the libSQL client
const client = createClient(config);
```

✅ **What it does:**
- Get config (with or without auth token)
- Create Turso client instance
- This client persists for entire app lifetime

---

## 🛠️ DATABASE HELPER FUNCTIONS (Lines 33-56)

```javascript
const db = {
  /**
   * Run a raw SQL query and return rows
   */
  query: async (sql, params = []) => {
    const result = await client.execute({ sql, args: params });
    return result.rows;
  },
```

✅ **What it does:** Execute SELECT query and return all rows
- `sql` = SQL query string with `?` placeholders
- `params` = array of values to substitute for `?`
- `client.execute()` = send query to Turso
- `result.rows` = array of result rows
- Default `params = []` means no parameters if not provided

**Example:**
```javascript
const rows = await db.query(
  'SELECT * FROM users WHERE is_active = ?',
  [true]
);
// rows = [{id: 1, email: '...', ...}, {id: 2, email: '...', ...}, ...]
```

---

### QUERY FIRST (Lines 38-42)

```javascript
  /**
   * Run a raw SQL query and return the first row
   */
  queryFirst: async (sql, params = []) => {
    const rows = await db.query(sql, params);
    return rows.length > 0 ? rows[0] : null;
  },
```

✅ **What it does:** Execute query and return only first row
- Calls `db.query()` internally
- Return first element or null if no results

**Example:**
```javascript
const user = await db.queryFirst(
  'SELECT * FROM users WHERE email = ?',
  ['user@example.com']
);
// user = {id: 1, email: 'user@example.com', ...} OR null
```

**Used in:**
- Login (get one user by email)
- Getting user by ID
- Checking if record exists

---

### EXECUTE (Lines 44-47)

```javascript
  /**
   * Run a raw SQL query (INSERT, UPDATE, DELETE)
   */
  execute: async (sql, params = []) => {
    return await client.execute({ sql, args: params });
  },
```

✅ **What it does:** Execute INSERT/UPDATE/DELETE query
- Returns metadata, not rows
- `result.changes` = number of rows affected
- `result.lastInsertRowid` = ID of last inserted row

**Example:**
```javascript
const result = await db.execute(
  'INSERT INTO users (email, username) VALUES (?, ?)',
  ['user@example.com', 'john']
);
// result = {
//   success: true,
//   changes: 1,
//   lastInsertRowid: 123,
//   ...
// }

// Use lastInsertRowid to get the new user's ID:
const user = await db.queryFirst(
  'SELECT * FROM users WHERE id = ?',
  [Number(result.lastInsertRowid)]
);
```

---

### EXPORT RAW CLIENT (Lines 49-51)

```javascript
  // Export the original client for complex transactions
  client
};

export default db;
```

✅ **What it does:** Export both helper functions AND raw client
- `db.query()` = convenient wrapper
- `db.queryFirst()` = convenient wrapper
- `db.execute()` = convenient wrapper
- `db.client` = raw client if needed for transactions

**When to use raw client:**
```javascript
// For transactions (multiple queries that must all succeed or all fail):
const transaction = await db.client.transaction();
try {
  await transaction.execute(...);
  await transaction.execute(...);
  await transaction.commit();
} catch (err) {
  await transaction.rollback();
}
```

---

## 🔄 QUERY EXECUTION FLOW

### SELECT Example:
```
user calls: db.queryFirst('SELECT * FROM users WHERE email = ?', ['user@example.com'])
   ↓
queryFirst calls: db.query(sql, params)
   ↓
query calls: client.execute({ sql: '...', args: ['user@example.com'] })
   ↓
Turso executes: SELECT * FROM users WHERE email = 'user@example.com'
   ↓
Returns: result.rows = [{id: 1, email: '...', ...}]
   ↓
queryFirst returns: rows[0] = {id: 1, email: '...', ...} OR null
```

### INSERT Example:
```
user calls: db.execute('INSERT INTO users (...) VALUES (?, ?, ?)', [email, username, name])
   ↓
execute calls: client.execute({ sql: '...', args: [...] })
   ↓
Turso executes: INSERT INTO users (...) VALUES ('user@example.com', 'john', 'John Doe')
   ↓
Returns: result = { changes: 1, lastInsertRowid: 123, ... }
   ↓
user gets: result = { changes: 1, lastInsertRowid: 123, ... }
```

---

## 🛡️ SQL INJECTION PROTECTION

**Vulnerable (DON'T DO THIS):**
```javascript
const email = "' OR '1'='1";
const query = `SELECT * FROM users WHERE email = '${email}'`; // DANGER!
// Becomes: SELECT * FROM users WHERE email = '' OR '1'='1'
// This would return ALL users!
```

**Safe (DO THIS):**
```javascript
const email = "' OR '1'='1";
const query = "SELECT * FROM users WHERE email = ?";
const result = await db.queryFirst(query, [email]);
// Turso treats email as data, not SQL code
// SELECT * FROM users WHERE email = '' OR '1'='1'
// Returns: no users (correct!)
```

**All functions use parameterized queries:**
- `?` = placeholder for value
- Value passed separately in params array
- Database driver handles escaping

---

## 📊 COMPARISON: QUERY vs QUERYF IRST vs EXECUTE

| Function | Use Case | Returns | Example |
|----------|----------|---------|---------|
| `query()` | SELECTs needing multiple rows | Array of objects | All users from company |
| `queryFirst()` | SELECTs needing one row | Single object OR null | Get user by ID |
| `execute()` | INSERT/UPDATE/DELETE | Metadata object | Create new user |

---

## 🔗 HOW IT'S USED IN APP

### In userService.js:
```javascript
// GET examples (use queryFirst/query)
return await db.queryFirst('SELECT * FROM users WHERE email = ?', [email]);
return await db.query('SELECT * FROM users WHERE is_admin = 1', []);

// INSERT example (use execute)
const result = await db.execute(
  'INSERT INTO users (email, username) VALUES (?, ?, ?)',
  [email, username, password]
);
const newUser = await db.queryFirst(
  'SELECT * FROM users WHERE id = ?',
  [Number(result.lastInsertRowid)]
);

// UPDATE example (use execute)
await db.execute(
  'UPDATE users SET last_login = ? WHERE id = ?',
  [now, userId]
);
```

---

## ⚙️ TURSO vs TRADITIONAL DATABASES

| Feature | Turso/libSQL | Traditional (MySQL, PostgreSQL) |
|---------|-------------|--------|
| **Type** | Serverless SQLite | Central server |
| **Scale** | Global edge locations | One region |
| **Cost** | Pay per query | Monthly per GB |
| **Setup** | Instant | Complex |
| **Latency** | Low (edge) | Higher (central) |

**Why Turso for ArthaNova?**
- Financial app needs low latency
- Edge locations near customers
- SQLite reliability with edge distribution
- Scales with demand

---

## 💡 KEY CONCEPTS

**Async/Await:**
- All functions are async (database is slow)
- Must `await` result
- Caller must also be async

**Error Handling:**
- If query fails, error bubbles up
- Caller (authController) handles with try/catch
- Never silently fail

**Connection Pooling:**
- `createClient()` handles connection pool
- Reuses connections (efficient)
- Handles connection failures automatically

**TypeScript-ready:**
- Functions accept `sql` and `params`
- Well-documented with JSDoc comments
- Easy to add TypeScript types later

