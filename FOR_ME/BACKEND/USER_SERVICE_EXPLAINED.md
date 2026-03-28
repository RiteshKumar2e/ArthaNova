# Backend - userService.js - Complete Line-by-Line Explanation (Hinglish Mein)

## File Path
`backend/src/services/userService.js`

---

## 📌 IMPORTS (Line 1)

```javascript
import db from '../models/db.js';
```

✅ **What it does:** Import database module
- Direct database access using Turso/libSQL
- Provides `db.query()`, `db.queryFirst()`, `db.execute()`

---

## 🔍 GET USER BY EMAIL (Lines 3-5)

```javascript
export const getUserByEmail = async (email) => {
  return await db.queryFirst('SELECT * FROM users WHERE email = ?', [email]);
};
```

✅ **What it does:** Fetch user by email address
- `SELECT *` = get all columns
- `WHERE email = ?` = filter by email
- `?` = placeholder (prevents SQL injection)
- Return first result or null

**Used in:**
- Login validation
- Registration (check if email exists)
- Google OAuth (find/create user)

---

## 🔍 GET USER BY USERNAME (Lines 7-9)

```javascript
export const getUserByUsername = async (username) => {
  return await db.queryFirst('SELECT * FROM users WHERE username = ?', [username]);
};
```

✅ **What it does:** Fetch user by username
- Used during registration to prevent duplicate usernames

---

## 🔍 GET USER BY ID (Lines 11-13)

```javascript
export const getUserById = async (id) => {
  return await db.queryFirst('SELECT * FROM users WHERE id = ?', [id]);
};
```

✅ **What it does:** Fetch user by their ID
- Most common after user logs in (know their ID from token)
- Used to refresh user data

---

## ✏️ CREATE USER (Lines 15-22)

```javascript
export const createUser = async (userData) => {
  const { email, username, full_name, hashed_password } = userData;
  const result = await db.execute(
    'INSERT INTO users (email, username, full_name, hashed_password) VALUES (?, ?, ?, ?)',
    [email, username, full_name, hashed_password]
  );
  // Fetch and return the newly created user
  return await db.queryFirst('SELECT * FROM users WHERE id = ?', [Number(result.lastInsertRowid)]);
};
```

✅ **What it does:** Create new user in database
- Extract fields from userData object
- `INSERT INTO users` = add new row
- `VALUES (?, ?, ?, ?)` = 4 placeholders for 4 columns
- `result.lastInsertRowid` = auto-generated user ID
- Fetch & return the created user object

**Return object includes:**
```javascript
{
  id: 123,
  email: 'user@example.com',
  username: 'john',
  full_name: 'John Doe',
  hashed_password: '$2b$10$abcd...',
  is_active: true,
  is_admin: false,
  created_at: '2025-03-28T10:30:00Z',
  updated_at: '2025-03-28T10:30:00Z',
  last_login: null,
  ...
}
```

---

## 🕐 UPDATE LAST LOGIN (Lines 24-28)

```javascript
export const updateUserLastLogin = async (id) => {
  const now = new Date().toISOString();
  return await db.execute(
    'UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?',
    [now, now, id]
  );
};
```

✅ **What it does:** Update last login timestamp
- Convert Date object to ISO string (e.g., `2025-03-28T10:30:00.000Z`)
- `UPDATE users SET` = modify existing row
- `last_login = ?` = set login timestamp
- `updated_at = ?` = also update modified time
- `WHERE id = ?` = only this user

**Used in:** Every successful login (tracks user activity)

---

## 🔐 UPDATE PASSWORD (Lines 30-34)

```javascript
export const updateUserPassword = async (id, hashedPassword) => {
  const now = new Date().toISOString();
  return await db.execute(
    'UPDATE users SET hashed_password = ?, updated_at = ? WHERE id = ?',
    [hashedPassword, now, id]
  );
};
```

✅ **What it does:** Change user password
- Takes already hashed password (caller must hash)
- Update hashed_password column
- Update modified timestamp

**Used in:** Password reset, change password flows

---

## 👑 UPDATE ADMIN STATUS (Lines 35-40)

```javascript
export const updateUserAdminStatus = async (id, isAdmin) => {
  const now = new Date().toISOString();
  return await db.execute(
    'UPDATE users SET is_admin = ?, updated_at = ? WHERE id = ?',
    [isAdmin ? 1 : 0, now, id]
  );
};
```

✅ **What it does:** Promote/demote user to admin
- `isAdmin ? 1 : 0` = convert boolean to 1 (true) or 0 (false) for database
- Database stores boolean as INTEGER (0 or 1)
- Used by admin panel to manage roles

---

## 📝 LOG ACTION (Lines 41-53)

```javascript
export const logAction = async (data) => {
  const { user_id, email, action, module = 'CORE', details, status = 'SUCCESS', ip } = data;
  try {
    const timestamp = new Date().toISOString();
    return await db.execute(
      `INSERT INTO audit_logs (user_id, email, action, module, details, status, ip_address, timestamp) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, email, action, module, details, status, ip, timestamp]
    );
  } catch (err) {
    console.error('FAILED TO LOG AUDIT:', err);
  }
};
```

✅ **What it does:** Log user actions for security & compliance
- Destructure parameters with defaults:
  - `module = 'CORE'` = default module if not provided
  - `status = 'SUCCESS'` = default to success
- Insert into audit_logs table (different from users table)
- Wrap in try/catch to prevent logs from breaking app

**Example usage:**
```javascript
await logAction({
  user_id: 123,
  email: 'user@example.com',
  action: 'LOGIN_GOOGLE',
  module: 'AUTH_GOOGLE',
  details: 'Logged in via Google SSO',
  ip: '192.168.1.1'
});
```

**Audit log records:**
- Who (user_id, email)
- What (action)
- When (timestamp)
- Where (ip_address)
- How it went (status)

**Actions logged:**
- LOGIN_GOOGLE
- LOGIN_PASSWORD
- LOGOUT
- CREATE_PORTFOLIO
- DELETE_PORTFOLIO
- CHANGE_PASSWORD
- etc.

---

## 🔄 SERVICE FUNCTION PATTERNS

### All these functions follow same pattern:

```
1. Destructure parameters
2. Execute SQL query with placeholders
3. Await result
4. Return result
5. Caller uses returned data
```

### Why use parameterized queries?

**Unsafe (vulnerable to SQL injection):**
```javascript
// DON'T DO THIS!
const query = `SELECT * FROM users WHERE email = '${email}'`
// If email = "' OR '1'='1", could query entire table!
```

**Safe (parameterized):**
```javascript
// DO THIS!
const query = `SELECT * FROM users WHERE email = ?`
const result = await db.queryFirst(query, [email])
// Database treats email as data, not SQL code
```

---

## 📊 DATABASE TABLE SCHEMA

### users table:
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  hashed_password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT 1,
  is_admin BOOLEAN DEFAULT 0,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP,
  ...
);
```

### audit_logs table:
```sql
CREATE TABLE audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  email TEXT,
  action TEXT,
  module TEXT,
  details TEXT,
  status TEXT,
  ip_address TEXT,
  timestamp TIMESTAMP,
  ...
);
```

---

## 🔄 HOW SERVICES ARE USED

### In authController.js:
```javascript
// Check if email exists
let user = await userService.getUserByEmail(cleanEmail);

// Create new user
user = await userService.createUser({...});

// Update after login
await userService.updateUserLastLogin(user.id);

// Log the action
await userService.logAction({...});

// Get fresh data
const updatedUser = await userService.getUserById(user.id);
```

---

## 💡 KEY PATTERNS

**Async/Await:** All functions are async
- Database operations are slow
- Must wait for results
- Caller must also be async

**Error Handling:**
- Caller (authController) wraps in try/catch
- Service functions just execute (let errors bubble up)

**SQL Injection Prevention:**
- All use parameterized queries (`?` placeholders)
- Never interpolate user input directly

**Timestamps:**
- Always use ISO format: `2025-03-28T10:30:00.000Z`
- Database stores as TEXT (Turso/libSQL)
- Easy to parse on frontend

**Boolean as Integer:**
- Database: `is_admin = 1` (true) or `0` (false)
- JavaScript: `isAdmin ? 1 : 0` conversion
- Reverse: `Boolean(1)` or just check `if (user.is_admin)`

