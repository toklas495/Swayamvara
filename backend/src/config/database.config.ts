import { env } from "./env";

export const databaseConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  poolMin: 2,
  poolMax: 10,
};