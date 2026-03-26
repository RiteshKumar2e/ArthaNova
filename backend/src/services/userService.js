import db from '../models/db.js';

export const getUserByEmail = async (email) => {
  return await db.queryFirst('SELECT * FROM users WHERE email = ?', [email]);
};

export const getUserByUsername = async (username) => {
  return await db.queryFirst('SELECT * FROM users WHERE username = ?', [username]);
};

export const getUserById = async (id) => {
  return await db.queryFirst('SELECT * FROM users WHERE id = ?', [id]);
};

export const createUser = async (userData) => {
  const { email, username, full_name, hashed_password } = userData;
  const result = await db.execute(
    'INSERT INTO users (email, username, full_name, hashed_password) VALUES (?, ?, ?, ?)',
    [email, username, full_name, hashed_password]
  );
  // Fetch and return the newly created user
  return await db.queryFirst('SELECT * FROM users WHERE id = ?', [Number(result.lastInsertRowid)]);
};

export const updateUserLastLogin = async (id) => {
  const now = new Date().toISOString();
  return await db.execute(
    'UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?',
    [now, now, id]
  );
};

export const updateUserPassword = async (id, hashedPassword) => {
  const now = new Date().toISOString();
  return await db.execute(
    'UPDATE users SET hashed_password = ?, updated_at = ? WHERE id = ?',
    [hashedPassword, now, id]
  );
};
export const updateUserAdminStatus = async (id, isAdmin) => {
  const now = new Date().toISOString();
  return await db.execute(
    'UPDATE users SET is_admin = ?, updated_at = ? WHERE id = ?',
    [isAdmin ? 1 : 0, now, id]
  );
};
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
