import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { appConfig } from './config/app.config';

const buildApp = () => {
  const app = Fastify({
    logger: {
      level: appConfig.logLevel,
      transport:
        appConfig.env === 'development'
          ? {
              target: 'pino-pretty',
              options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
              },
            }
          : undefined,
    },
  });

  // Security plugins
  app.register(helmet);
  app.register(cors, {
    origin: appConfig.env === 'development' ? '*' : process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  });

  // Rate limiting
  app.register(rateLimit, {
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    timeWindow: process.env.RATE_LIMIT_TIME_WINDOW || '15m',
  });

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // TODO: Register module routes here
  // app.register(otpRoutes, { prefix: '/api/v1/otp' });
  // app.register(authRoutes, { prefix: '/api/v1/auth' });
  // etc...

  // Global error handler
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    reply.status(error.statusCode || 500).send({
      success: false,
      data: null,
      error: {
        code: error.code || 'INTERNAL_SERVER_ERROR',
        message: error.message || 'An unexpected error occurred',
      },
    });
  });

  return app;
};

export default buildApp;