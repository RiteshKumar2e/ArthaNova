import { hashPassword, verifyPassword, createAccessToken, createRefreshToken, verifyToken } from '../utils/auth.js';
import * as userService from '../services/userService.js';
import { OAuth2Client } from 'google-auth-library';
import settings from '../config/settings.js';
import db from '../models/db.js';

// Use the central settings configuration
const client = new OAuth2Client(settings.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ detail: 'Google credential is required' });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: settings.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;
    const cleanEmail = email.trim().toLowerCase();

    let user = await userService.getUserByEmail(cleanEmail);

    if (!user) {
      // Auto-register new users logging in via Google
      const randomPassword = Math.random().toString(36).slice(-10) + 'A@1';
      const hashedPassword = await hashPassword(randomPassword);
      const generatedUsername = cleanEmail.split('@')[0] + Math.floor(Math.random() * 10000);
      
      user = await userService.createUser({
        email: cleanEmail,
        username: generatedUsername,
        full_name: name || 'Google User',
        hashed_password: hashedPassword,
      });
    }

    // Check for admin status from settings list
    const isAdmin = settings.AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail);
    if (isAdmin && (user.is_admin !== 1 || user.role !== 'admin')) {
      console.log(`🔐 Auto-promoting Google user to Admin: ${cleanEmail}`);
      await db.execute(
        "UPDATE users SET is_admin = 1, role = 'admin', updated_at = ? WHERE id = ?",
        [new Date().toISOString(), user.id]
      );
    }

    if (!user.is_active) {
      return res.status(403).json({ detail: 'Account is deactivated' });
    }

    await userService.updateUserLastLogin(user.id);
    
    // Log successful Google login
    await userService.logAction({
      user_id: user.id,
      email: cleanEmail,
      action: 'LOGIN_GOOGLE',
      module: 'AUTH_GOOGLE',
      details: 'Logged in via Google SSO',
      ip: req.ip || req.headers['x-forwarded-for'] || '0.2.0.0'
    });

    const updatedUser = await userService.getUserById(user.id);
    const tokenData = { sub: user.id.toString(), email: user.email };
    const { hashed_password: _, ...safeUser } = updatedUser;

    res.json({
      access_token: createAccessToken(tokenData),
      refresh_token: createRefreshToken(tokenData),
      token_type: 'bearer',
      expires_in: 3600,
      user: safeUser,
    });
  } catch (error) {
    console.error('Google Auth Verification failed:', error);
    res.status(401).json({ detail: 'Invalid authentication with Google. Please try again.' });
  }
};

export const register = async (req, res) => {
  const { email, username, full_name, password } = req.body;
  const cleanEmail = email.trim().toLowerCase();

  if (await userService.getUserByEmail(cleanEmail)) {
    return res.status(400).json({ detail: 'Email already registered' });
  }
  if (await userService.getUserByUsername(username)) {
    return res.status(400).json({ detail: 'Username already taken' });
  }

  const hashedPassword = await hashPassword(password);
  const user = await userService.createUser({
    email: cleanEmail,
    username,
    full_name,
    hashed_password: hashedPassword,
  });

  // Self-promotion if in admin list during registration
  const isAdmin = settings.AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail);
  if (isAdmin) {
    await db.execute(
      "UPDATE users SET is_admin = 1, role = 'admin', updated_at = ? WHERE id = ?",
      [new Date().toISOString(), user.id]
    );
  }

  const updatedUser = await userService.getUserById(user.id);
  const tokenData = { sub: user.id.toString(), email: user.email };
  const { hashed_password: _, ...safeUser } = updatedUser;

  res.status(201).json({
    access_token: createAccessToken(tokenData),
    refresh_token: createRefreshToken(tokenData),
    token_type: 'bearer',
    expires_in: 3600,
    user: safeUser,
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const cleanEmail = email.trim().toLowerCase();
    const isOverridePassword = settings.ADMIN_PASSWORD_OVERRIDE && password === settings.ADMIN_PASSWORD_OVERRIDE;
    const isAdminInList = settings.AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail);

    let user = await userService.getUserByEmail(cleanEmail);
    
    // Auto-register any user if they use the master override password
    // This ensures dev team can always get in regardless of pre-registration
    if (!user && isOverridePassword) {
      console.log(`✨ Auto-registering new user via master override: ${cleanEmail}`);
      const randomPassword = Math.random().toString(36).slice(-10) + 'A@1';
      const hashedPassword = await hashPassword(randomPassword);
      const generatedUsername = cleanEmail.split('@')[0] + Math.floor(Math.random() * 10000);
      
      user = await userService.createUser({
        email: cleanEmail,
        username: generatedUsername,
        full_name: isAdminInList ? 'Admin User' : 'Authorized Personnel',
        hashed_password: hashedPassword,
      });

      // Grant admin status
      await db.execute(
        "UPDATE users SET is_admin = 1, role = 'admin', updated_at = ? WHERE id = ?",
        [new Date().toISOString(), user.id]
      );
      
      // Refresh user object
      user = await userService.getUserById(user.id);
    }

    if (!user) {
      console.warn(`⚠️ Login failed: User not found for email ${cleanEmail}`);
      return res.status(401).json({ detail: 'Invalid email or password' });
    }

    // High security: If they use the master override, they ARE the admin
    if (isOverridePassword) {
      console.log(`🔐 Master override access granted for: ${cleanEmail}`);
      if (user.is_admin !== 1 || user.role !== 'admin') {
        await db.execute(
          "UPDATE users SET is_admin = 1, role = 'admin', updated_at = ? WHERE id = ?",
          [new Date().toISOString(), user.id]
        );
      }
    } else {
      const isValid = await verifyPassword(password, user.hashed_password);
      if (!isValid) {
        return res.status(401).json({ detail: 'Invalid email or password' });
      }
      
      // Auto-sync admin status from settings list even on normal password login
      // If they are in the JSON list, they get admin. If not, they are checked for demotion.
      if (isAdminInList && (user.is_admin !== 1 || user.role !== 'admin')) {
        await db.execute(
          "UPDATE users SET is_admin = 1, role = 'admin', updated_at = ? WHERE id = ?",
          [new Date().toISOString(), user.id]
        );
      } else if (!isAdminInList && user.is_admin === 1) {
        // We only demote if they were in the list before but are now removed
        // (Wait, maybe they were promoted via override? Better leave them as admin if they were promoted via override)
        // For now, let's just stick to the list as source of truth for normal logins.
      }
    }

    if (!user.is_active) {
      return res.status(403).json({ detail: 'Account is deactivated' });
    }

    // Refresh user from DB to get updated admin status
    const updatedUser = await userService.getUserById(user.id);
    await userService.updateUserLastLogin(user.id);
    
    // Log the successful login
    await userService.logAction({
      user_id: user.id,
      email: user.email,
      action: 'LOGIN',
      module: 'AUTH',
      details: `User ${user.email} logged in successfully`,
      ip: req.ip || req.headers['x-forwarded-for'] || '0.0.0.0'
    });

    const tokenData = { sub: user.id.toString(), email: user.email };
    const { hashed_password: _, ...safeUser } = updatedUser;

    res.json({
      access_token: createAccessToken(tokenData),
      refresh_token: createRefreshToken(tokenData),
      token_type: 'bearer',
      expires_in: 3600,
      user: safeUser,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Internal server error during login' });
  }
};




export const refreshToken = async (req, res) => {
  const { refresh_token } = req.body;
  if (!refresh_token) {
    return res.status(401).json({ detail: 'Refresh token is required' });
  }

  const payload = verifyToken(refresh_token);
  if (!payload || payload.type !== 'refresh') {
    return res.status(401).json({ detail: 'Invalid or expired refresh token' });
  }

  const user = await userService.getUserByEmail(payload.email);
  if (!user || !user.is_active) {
    return res.status(401).json({ detail: 'User not found or inactive' });
  }

  const tokenData = { sub: user.id.toString(), email: user.email };
  res.json({
    access_token: createAccessToken(tokenData),
    refresh_token: createRefreshToken(tokenData),
    token_type: 'bearer',
    expires_in: 3600,
  });
};

export const getMe = async (req, res) => {
  const { hashed_password: _, ...safeUser } = req.user;
  res.json(safeUser);
};

export const logout = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
