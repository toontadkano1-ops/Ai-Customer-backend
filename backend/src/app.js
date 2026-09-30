import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { config } from './config/env.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import sentimentRoutes from './routes/sentimentRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import knowledgeRoutes from './routes/knowledgeRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

const app = express();

// Security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS setup
app.use(cors({
  origin: (origin, callback) => {
    // allow all origins in dev or configured client URL
    callback(null, true);
  },
  credentials: true
}));

// Request logger
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Request parsers
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CX Intelligence API',
    mode: config.ai.provider === 'mock' ? 'Mock AI / Local Dev Mode' : 'Connected AI Provider'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CX Intelligence API'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ai', sentimentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/knowledge', knowledgeRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.method} ${req.baseUrl} not found` });
});

// Global centralized error handler
app.use(errorHandler);

export default app;
