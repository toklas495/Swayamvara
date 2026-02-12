import knex from 'knex';
import knexConfig from '../../../knexfile';
import { env } from '../../config/env';

const environment = env.NODE_ENV;
const config = knexConfig[environment];

const db = knex(config);

export async function initializeDatabase() {
  try {
    await db.raw('select 1');
  } catch (err) {
    // Log, close connection pool, then re-throw
    try {
      await db.destroy();
    } catch (_) {
      /* swallowed to avoid masking original error */
    }
    throw err;
  }
}

export default db;