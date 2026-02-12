import dotenv from 'dotenv';
dotenv.config();

import buildApp from './app';
import { appConfig } from './config/app.config';
import db ,{initializeDatabase} from './core/database/knex';
import { setServices } from './utils/exception-handler';
import { connectRedis } from './core/redis';

const start = async () => {
  const app = buildApp();

  // pass fastify + Db instances to global exception handler
  setServices({app,db});
  try {
    // Test database connection
    await initializeDatabase();
    app.log.info('✅ Database connected');

    connectRedis(app);

    // Start server
    await app.listen({
      port: appConfig.port,
      host: appConfig.host,
    });

    app.log.info(`🚀 Server running on http://${appConfig.host}:${appConfig.port}`);
    app.log.info(`📝 Environment: ${appConfig.env}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();