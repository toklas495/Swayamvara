import type { AuthServiceSchema } from "./auth.service";
import type { ErrorSchema } from "../../utils/app.error";

interface ControllerOpts {
    Auth:AuthServiceSchema;
    Error:ErrorSchema
}


import { LIMITS } from '../../config/constants';
import type { FastifyRequest, FastifyReply } from 'fastify';

const createAuthController = (opts: ControllerOpts) => {
    const { Auth } = opts;

    // POST /auth/send-otp
    const sendOtp = async (req: FastifyRequest, reply: FastifyReply) => {
        const { phone } = req.body as { phone: string };
        const ip = req.ip;
        if (!phone) return reply.code(400).send({ error: 'Phone is required' });
        // Generate OTP and expiry
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + LIMITS.OTP_EXPIRY_MINUTES * 60 * 1000);
        await Auth.sendOtp(phone, otp, expiresAt, ip);
        return reply.send({ success: true });
    };

    // POST /auth/verify-otp
    const verifyOtp = async (req: FastifyRequest, reply: FastifyReply) => {
        const { phone, otp, deviceFingerprint } = req.body as { phone: string, otp: string, deviceFingerprint: string };
        if (!phone || !otp || !deviceFingerprint) return reply.code(400).send({ error: 'Missing params' });
        const result = await Auth.verifyOtp(phone, otp, deviceFingerprint);
        return reply.send(result);
    };

    // POST /auth/refresh
    const refresh = async (req: FastifyRequest, reply: FastifyReply) => {
        const { refreshTokenHash, newRefreshTokenHash, newExpiresAt } = req.body as { refreshTokenHash: string, newRefreshTokenHash: string, newExpiresAt: string };
        if (!refreshTokenHash || !newRefreshTokenHash || !newExpiresAt) return reply.code(400).send({ error: 'Missing params' });
        const result = await Auth.refresh(refreshTokenHash, newRefreshTokenHash, new Date(newExpiresAt));
        return reply.send(result);
    };

    // POST /auth/logout
    const logout = async (req: FastifyRequest, reply: FastifyReply) => {
        const { sessionId } = req.body as { sessionId: string };
        if (!sessionId) return reply.code(400).send({ error: 'Missing sessionId' });
        const result = await Auth.logout(sessionId);
        return reply.send(result);
    };

    // POST /auth/logout-all
    const logoutAll = async (req: FastifyRequest, reply: FastifyReply) => {
        const { userId } = req.body as { userId: string };
        if (!userId) return reply.code(400).send({ error: 'Missing userId' });
        const result = await Auth.logoutAll(userId);
        return reply.send(result);
    };

    // GET /auth/sessions
    const getSessions = async (req: FastifyRequest, reply: FastifyReply) => {
        const { userId } = req.query as { userId: string };
        if (!userId) return reply.code(400).send({ error: 'Missing userId' });
        const result = await Auth.getSessions(userId);
        return reply.send(result);
    };

    // DELETE /auth/sessions/:sessionId
    const deleteSession = async (req: FastifyRequest, reply: FastifyReply) => {
        const { sessionId } = req.params as { sessionId: string };
        if (!sessionId) return reply.code(400).send({ error: 'Missing sessionId' });
        const result = await Auth.deleteSession(sessionId);
        return reply.send(result);
    };

    return {
        sendOtp,
        verifyOtp,
        refresh,
        logout,
        logoutAll,
        getSessions,
        deleteSession
    };
}

export type AuthControllerSchema = ReturnType<typeof createAuthController>;
export default createAuthController;