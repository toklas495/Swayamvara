// system/exception-handler.js
import type {FastifyInstance} from 'fastify';
import type { Knex } from 'knex';
import logger from './logger';

let fastifyInstance:FastifyInstance;
let dbInstance:Knex;

type SIGNAL="SIGINT"|"SIGHUP"|"SIGQUIT"|"SIGTERM"|"uncaughtException"|"unhandledRejection";
interface SERVICEOPTION{
    app:FastifyInstance,
    db:Knex
}

// Allow server.js to pass instances
export function setServices({ app, db }:SERVICEOPTION) {
  fastifyInstance = app;
  dbInstance = db;
}

// Graceful shutdown
async function shutdown(signal:SIGNAL, code = 0) {
  logger.warn({ signal }, 'Shutdown initiated');

  try {
    if (fastifyInstance) {
      await fastifyInstance.close();
      logger.info('Fastify server closed');
    }
  } catch (err) {
    logger.error({ err }, 'Error closing Fastify');
  }

  try {
    if (dbInstance) {
      await dbInstance.destroy();
      logger.info('Database connection closed');
    }
  } catch (err) {
    logger.error({ err }, 'Error closing database');
  }

  process.exit(code);
}

// ----------------------
// PROCESS LEVEL ERRORS
// ----------------------
process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught Exception');
  shutdown('uncaughtException', 1);
});

process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled Rejection');
  shutdown('unhandledRejection', 1);
});

// ----------------------
// OS SIGNALS
// ----------------------
['SIGINT', 'SIGTERM', 'SIGQUIT', 'SIGHUP'].forEach((signal) => {
  process.on(signal, () => shutdown(signal, 0));
});
