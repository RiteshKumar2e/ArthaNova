import db from '../models/db.js';

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const updateProfile = async (req, res) => {
  const { full_name, bio, phone, avatar_url, risk_profile, theme, preferred_currency } = req.body;
  
  try {
    const now = new Date().toISOString();
    await db.execute(`
      UPDATE users 
      SET full_name = ?, 
          bio = ?, 
          phone = ?, 
          avatar_url = ?, 
          risk_profile = ?, 
          theme = ?, 
          preferred_currency = ?, 
          updated_at = ?
      WHERE id = ?`,
      [full_name, bio, phone, avatar_url, risk_profile, theme, preferred_currency, now, req.user.id]
    );

    const updatedUser = await db.queryFirst('SELECT * FROM users WHERE id = ?', [req.user.id]);
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to update profile" });
  }
};

export const listUsers = async (req, res) => {
  try {
    const users = await db.query(`
      SELECT id, email, username, full_name, role, is_active, created_at 
      FROM users
    `);
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ detail: "Failed to fetch users" });
  }
};
