import { z } from "zod";
import "dotenv/config";

// Define the schema for required environment variables
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  HOST: z.string().default("0.0.0.0"),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  DB_USER: z.string().default("postgres"),
  DB_PASSWORD: z.string().default("postgres"),
  DB_NAME: z.string().default("404db"),
  JWT_ACCESS_EXPIRY: z.string().default("14m"),
  JWT_REFRESH_EXPIRY: z.string().default("6d"),
  OTP_EXPIRY_MINUTES: z.string().regex(/^\d+$/).transform(Number),
  OTP_MAX_ATTEMPTS: z.string().regex(/\d+$/).transform(Number),
  OTP_RATE_LIMIT_PER_HOUR: z.string().regex(/\d+$/).transform(Number),
  SMS_PROVIDER: z.string().default("mock"),
  SMS_API_KEY: z.string(),
  SMS_SENDER_ID: z.string(),
  SMS_TEMPLATE_ID: z.string(),
  STORAGE_PROVIDER: z.string(),
  AWS_S2_BUCKET: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  RATE_LIMIT_MAX: z.string().regex(/\d+$/).transform(Number),
  RATE_LIMIT_TIME_WINDOW: z.string().default("14m"),
  LOG_LEVEL: z.string().default("info"),
  REDIS_HOST:z.string().default("0.0.0.0"),
  REDIS_PORT:z.string().regex(/\d+$/).transform(Number),
  REDIS_PASS:z.string().default("mypassword")
});

// Parse and validate process.env
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;