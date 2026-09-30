import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { db } from '../database/db.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwtSecret);

    // Verify user exists
    let user = await db.findById('profiles', decoded.id);
    if (!user) {
      // Check customer store
      user = await db.findById('customers', decoded.id);
      if (user) {
        user.role = 'customer';
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session user'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      business_id: user.business_id,
      full_name: user.full_name || user.name
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: ' + (err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token')
    });
  }
};

export const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }

    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of [${allowed.join(', ')}] role`
      });
    }

    next();
  };
};

export const tenantScope = (req, res, next) => {
  if (req.user && req.user.business_id) {
    req.businessId = req.user.business_id;
  }
  next();
};
