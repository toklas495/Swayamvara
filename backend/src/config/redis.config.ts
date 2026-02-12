import { env } from "./env";

export const redisConfig = {
    redisHost:env.REDIS_HOST,
    redisPass:env.REDIS_PASS,
    redisPort:env.REDIS_PORT
}