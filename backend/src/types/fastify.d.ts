// src/types/fastify.d.ts
// Extend Fastify types here if needed
import { UserRole } from './index';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      userId: string;
      role: UserRole;
    };
  }
}