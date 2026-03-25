import { hashPassword, verifyPassword, createAccessToken, createRefreshToken, verifyToken } from '../utils/auth.js';
import * as userService from '../services/userService.js';
// DB operations are handled through userService which uses raw SQL now

export const register = async (req, res) => {
  const { email, username, full_name, password } = req.body;

  if (await userService.getUserByEmail(email)) {
    return res.status(400).json({ detail: 'Email already registered' });
  }
  if (await userService.getUserByUsername(username)) {
    return res.status(400).json({ detail: 'Username already taken' });
  }

  const hashedPassword = await hashPassword(password);
  const user = await userService.createUser({
    email,
    username,
    full_name,
    hashed_password: hashedPassword,
  });

  const tokenData = { sub: user.id.toString(), email: user.email };
  const { hashed_password: _, ...safeUser } = user;

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
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ detail: 'Invalid email or password' });
    }

    const isValid = await verifyPassword(password, user.hashed_password);
    if (!isValid) {
      return res.status(401).json({ detail: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ detail: 'Account is deactivated' });
    }

    await userService.updateUserLastLogin(user.id);
    const tokenData = { sub: user.id.toString(), email: user.email };
    const { hashed_password: _, ...safeUser } = user;

    res.json({
      access_token: createAccessToken(tokenData),
      refresh_token: createRefreshToken(tokenData),
      token_type: 'bearer',
      expires_in: 3600,
      user: safeUser,
    });
  } catch (error) {
    console.error(error);
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
