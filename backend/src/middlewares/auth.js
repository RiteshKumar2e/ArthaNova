import { verifyToken } from '../utils/auth.js';
import * as userService from '../services/userService.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ detail: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);
  
  if (!payload || payload.type !== 'access') {
    return res.status(401).json({ detail: 'Invalid or expired token' });
  }

  const user = await userService.getUserById(parseInt(payload.sub));
  if (!user || !user.is_active) {
    return res.status(401).json({ detail: 'User not found or inactive' });
  }

  req.user = user;
  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ detail: 'Admin privileges required' });
  }
  next();
};
