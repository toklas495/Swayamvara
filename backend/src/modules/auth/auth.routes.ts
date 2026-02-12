import type {FastifyInstance} from 'fastify';
import type { AuthControllerSchema } from './auth.controller';

interface AuthRoutesOptions {
    fastify:FastifyInstance,
    Auth:AuthControllerSchema
}

const createAuthRoutes = (opts:AuthRoutesOptions)=>{
    opts.fastify.post("/send-otp",opts.Auth.sendOtp);
    opts.fastify.post("/verify-otp",opts.Auth.verifyOtp);
    opts.fastify.post("/refresh",opts.Auth.refresh);
    opts.fastify.post("/logout",opts.Auth.logout);
    opts.fastify.post("/logout-all",opts.Auth.logoutAll);
    opts.fastify.get("/sessions",opts.Auth.getSessions);
    opts.fastify.delete("/sessions/:sessionId",opts.Auth.deleteSession);
}

export default createAuthRoutes;
