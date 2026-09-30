import app from './app.js';
import { config } from './config/env.js';
import { logger } from './utils/logger.js';

const server = app.listen(config.port, () => {
  logger.info(`CX Intelligence Backend running on port ${config.port}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`AI Engine: ${config.ai.provider.toUpperCase()} mode active`);
  logger.info(`Ready to serve requests at http://localhost:${config.port}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
  });
});
