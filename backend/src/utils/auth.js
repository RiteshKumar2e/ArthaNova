import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import settings from '../config/settings.js';

/**
 * Hash password
 * @param {string} password 
 * @returns {Promise<string>}
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Verify password
 * @param {string} password 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>}
 */
export const verifyPassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Create access token
 * @param {object} payload 
 * @returns {string}
 */
export const createAccessToken = (payload) => {
  return jwt.sign(
    { ...payload, type: 'access' },
    settings.JWT_SECRET_KEY,
    { expiresIn: `${settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES}m` }
  );
};

/**
 * Create refresh token
 * @param {object} payload 
 * @returns {string}
 */
export const createRefreshToken = (payload) => {
  return jwt.sign(
    { ...payload, type: 'refresh' },
    settings.JWT_SECRET_KEY,
    { expiresIn: `${settings.JWT_REFRESH_TOKEN_EXPIRE_DAYS}d` }
  );
};

/**
 * Verify token
 * @param {string} token 
 * @returns {object|null}
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, settings.JWT_SECRET_KEY);
  } catch (error) {
    return null;
  }
};
