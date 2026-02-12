import type { ErrorSchema } from "../../utils/app.error";
import type { Knex } from "knex";

interface ModelOpts {
    db:Knex;
    Error:ErrorSchema
}


import { LIMITS } from '../../config/constants';
import { hashSHA256 } from '../../utils/token.utils';

const createAuthModel = (opts:ModelOpts) => {
    const { db, Error } = opts;

    // Insert OTP request
    const insertOtpRequest = async ({ phone, otpHash, expiresAt, ip }: { phone: string, otpHash: string, expiresAt: Date, ip: string }) => {
        await db('otp_requests').insert({
            phone,
            otp_hash: otpHash,
            expires_at: expiresAt,
            ip_address: ip,
            attempts: 0,
            created_at: new Date(),
            updated_at: new Date(),
        });
    };

    // Verify OTP and upsert user/device/session
    const verifyOtpAndUpsertUserDevice = async (phone: string, otp: string, deviceFingerprint: string) => {
        const otpReq = await db('otp_requests')
            .where({ phone })
            .orderBy('created_at', 'desc')
            .first();
        if (!otpReq) throw Error.notFound('OTP request not found');
        if (otpReq.verified_at) throw Error.badRequest('OTP already used');
        if (new Date(otpReq.expires_at) < new Date()) throw Error.badRequest('OTP expired');
        if (otpReq.attempts >= LIMITS.OTP_MAX_ATTEMPTS) throw Error.badRequest('Too many attempts');

        if (otpReq.otp_hash !== hashSHA256(otp)) {
            await db('otp_requests').where({ id: otpReq.id }).increment('attempts', 1);
            throw Error.badRequest('Invalid OTP');
        }

        await db('otp_requests').where({ id: otpReq.id }).update({ verified_at: new Date() });

        let user = await db('users').where({ phone }).first();
        if (!user) {
            const [userId] = await db('users').insert({ phone, phone_verified_at: new Date(), is_active: true }, ['id']);
            user = { id: userId.id, phone };
        } else if (!user.is_active) {
            throw Error.unAuth('User is deactivated');
        }

        let device = await db('devices').where({ user_id: user.id, device_fingerprint: deviceFingerprint }).first();
        if (!device) {
            const [deviceId] = await db('devices').insert({ user_id: user.id, device_fingerprint: deviceFingerprint, last_active: new Date() }, ['id']);
            device = { id: deviceId.id };
        }

        // TODO: Create session and tokens
        return { success: true, user_id: user.id, device_id: device.id };
    };

    // Refresh session (validate and rotate refresh token)
    const getSessionByRefreshToken = async (refreshTokenHash: string) => {
        return db('sessions').where({ refresh_token_hash: refreshTokenHash, revoked_at: null }).first();
    };

    const updateSessionRefreshToken = async (sessionId: string, newRefreshTokenHash: string, newExpiresAt: Date) => {
        await db('sessions').where({ id: sessionId }).update({ refresh_token_hash: newRefreshTokenHash, expires_at: newExpiresAt, updated_at: new Date() });
    };

    // Logout (revoke session)
    const revokeSession = async (sessionId: string) => {
        await db('sessions').where({ id: sessionId }).update({ revoked_at: new Date(), updated_at: new Date() });
    };

    // Logout all (revoke all sessions for user)
    const revokeAllSessions = async (userId: string) => {
        await db('sessions').where({ user_id: userId, revoked_at: null }).update({ revoked_at: new Date(), updated_at: new Date() });
    };

    // Get all sessions for user
    const getSessionsByUser = async (userId: string) => {
        return db('sessions').where({ user_id: userId }).orderBy('created_at', 'desc');
    };

    // Delete session (hard delete)
    const deleteSession = async (sessionId: string) => {
        await db('sessions').where({ id: sessionId }).del();
    };

    return {
        insertOtpRequest,
        verifyOtpAndUpsertUserDevice,
        getSessionByRefreshToken,
        updateSessionRefreshToken,
        revokeSession,
        revokeAllSessions,
        getSessionsByUser,
        deleteSession,
    };
}

export type AuthModelSchema = ReturnType<typeof createAuthModel>;