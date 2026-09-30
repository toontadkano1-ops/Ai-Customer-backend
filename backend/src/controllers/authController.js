import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.js';
import { config } from '../config/env.js';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

export const authController = {
  register: async (req, res, next) => {
    try {
      const validated = registerSchema.parse(req.body);

      // Check if user already exists
      const existingProfile = await db.findOne('profiles', { email: validated.email });
      const existingCustomer = await db.findOne('customers', { email: validated.email });
      if (existingProfile || existingCustomer) {
        return res.status(400).json({ success: false, message: 'Email is already registered' });
      }

      // Identify or create business
      let businessId;
      const businesses = await db.find('businesses', {});
      if (businesses.length > 0) {
        businessId = businesses[0].id;
      } else {
        const newBiz = await db.insert('businesses', {
          name: validated.business_name || 'My Business',
          description: 'Default organization'
        });
        businessId = newBiz.id;
      }

      const passwordHash = await bcrypt.hash(validated.password, 10);

      let newUser;
      if (validated.role === 'customer') {
        newUser = await db.insert('customers', {
          business_id: businessId,
          name: validated.full_name,
          email: validated.email,
          password_hash: passwordHash,
          preferences: { interests: [], preferred_channel: 'web_chat', notifications: true }
        });
        newUser.role = 'customer';
      } else {
        newUser = await db.insert('profiles', {
          business_id: businessId,
          full_name: validated.full_name,
          email: validated.email,
          password_hash: passwordHash,
          role: validated.role
        });
      }

      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, business_id: businessId },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      res.status(201).json({
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role,
          full_name: newUser.full_name || newUser.name,
          business_id: businessId
        }
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const validated = loginSchema.parse(req.body);

      // Check profiles first
      let user = await db.findOne('profiles', { email: validated.email });
      let role = user ? user.role : 'customer';

      // Check customers if not found in profiles
      if (!user) {
        user = await db.findOne('customers', { email: validated.email });
        if (user) {
          role = 'customer';
        }
      }

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(validated.password, user.password_hash || '');
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role, business_id: user.business_id },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          role,
          full_name: user.full_name || user.name,
          business_id: user.business_id
        }
      });
    } catch (err) {
      next(err);
    }
  },

  me: async (req, res, next) => {
    try {
      const user = req.user;
      const business = await db.findById('businesses', user.business_id);

      res.json({
        success: true,
        user,
        business
      });
    } catch (err) {
      next(err);
    }
  }
};
