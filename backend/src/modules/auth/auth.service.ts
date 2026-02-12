



import type { AuthModelSchema } from './auth.model';
import { sendOtpSMS } from '../../utils/twilio.utils';
import { hashSHA256 } from '../../utils/token.utils';
import { LIMITS } from '../../config/constants';

interface AuthServiceOpts {
    Model: AuthModelSchema;
    Error: any;
}

const createAuthService = (opts: AuthServiceOpts) => {
    const { Model, Error } = opts;

    // --- SEND OTP ---
    const sendOtp = async (phone: string, otp: string, expiresAt: Date, ip: string) => {
        // Store OTP request in DB
        await Model.insertOtpRequest({ phone, otpHash: hashSHA256(otp), expiresAt, ip });
        // Send OTP via Twilio
        await sendOtpSMS(phone, otp);
        return { success: true };
    };

    // --- VERIFY OTP ---
    const verifyOtp = async (phone: string, otp: string, deviceFingerprint: string) => {
        // DB logic in model
        const result = await Model.verifyOtpAndUpsertUserDevice(phone, otp, deviceFingerprint);
        return result;
    };


    // --- REFRESH TOKEN ---
    const refresh = async (refreshTokenHash: string, newRefreshTokenHash: string, newExpiresAt: Date) => {
        const session = await Model.getSessionByRefreshToken(refreshTokenHash);
        if (!session) throw Error.unAuth('Invalid or expired refresh token');
        await Model.updateSessionRefreshToken(session.id, newRefreshTokenHash, newExpiresAt);
        return { success: true, sessionId: session.id };
    };

    // --- LOGOUT (revoke session) ---
    const logout = async (sessionId: string) => {
        await Model.revokeSession(sessionId);
        return { success: true };
    };

    // --- LOGOUT ALL (revoke all sessions for user) ---
    const logoutAll = async (userId: string) => {
        await Model.revokeAllSessions(userId);
        return { success: true };
    };

    // --- GET SESSIONS ---
    const getSessions = async (userId: string) => {
        const sessions = await Model.getSessionsByUser(userId);
        return { sessions };
    };

    // --- DELETE SESSION (hard delete) ---
    const deleteSession = async (sessionId: string) => {
        await Model.deleteSession(sessionId);
        return { success: true };
    };

    return {
        sendOtp,
        verifyOtp,
        refresh,
        logout,
        logoutAll,
        getSessions,
        deleteSession,
    };
};

export type AuthServiceSchema = ReturnType<typeof createAuthService>;
export default createAuthService;