import type { AdminServiceSchema } from './admin.service';
import type { FastifyRequest, FastifyReply } from 'fastify';

interface ControllerOpts {
  Service: AdminServiceSchema;
}

const createAdminController = (opts: ControllerOpts) => {
  const { Service } = opts;

  // Reports
  const getAllReports = async (_req: FastifyRequest, reply: FastifyReply) => {
    const result = await Service.getAllReports();
    return reply.send(result);
  };
  const takeActionOnReport = async (req: FastifyRequest, reply: FastifyReply) => {
    const { reportId } = req.params as { reportId: string };
    const { status, actionedBy } = req.body as { status: string, actionedBy: string };
    if (!reportId || !status || !actionedBy) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.takeActionOnReport(reportId, status, actionedBy);
    return reply.send(result);
  };

  // Users
  const getAllUsers = async (_req: FastifyRequest, reply: FastifyReply) => {
    const result = await Service.getAllUsers();
    return reply.send(result);
  };
  const suspendUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { userId } = req.params as { userId: string };
    if (!userId) return reply.code(400).send({ error: 'Missing userId' });
    const result = await Service.suspendUser(userId);
    return reply.send(result);
  };
  const activateUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { userId } = req.params as { userId: string };
    if (!userId) return reply.code(400).send({ error: 'Missing userId' });
    const result = await Service.activateUser(userId);
    return reply.send(result);
  };
  const deleteUser = async (req: FastifyRequest, reply: FastifyReply) => {
    const { userId } = req.params as { userId: string };
    if (!userId) return reply.code(400).send({ error: 'Missing userId' });
    const result = await Service.deleteUser(userId);
    return reply.send({ success: !!result });
  };

  // Profiles
  const getAllProfiles = async (_req: FastifyRequest, reply: FastifyReply) => {
    const result = await Service.getAllProfiles();
    return reply.send(result);
  };
  const approveProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = req.params as { profileId: string };
    if (!profileId) return reply.code(400).send({ error: 'Missing profileId' });
    const result = await Service.approveProfile(profileId);
    return reply.send(result);
  };
  const rejectProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    const { profileId } = req.params as { profileId: string };
    if (!profileId) return reply.code(400).send({ error: 'Missing profileId' });
    const result = await Service.rejectProfile(profileId);
    return reply.send(result);
  };

  // Photos
  const getPendingPhotos = async (_req: FastifyRequest, reply: FastifyReply) => {
    const result = await Service.getPendingPhotos();
    return reply.send(result);
  };
  const approvePhoto = async (req: FastifyRequest, reply: FastifyReply) => {
    const { photoId } = req.params as { photoId: string };
    if (!photoId) return reply.code(400).send({ error: 'Missing photoId' });
    const result = await Service.approvePhoto(photoId);
    return reply.send(result);
  };
  const rejectPhoto = async (req: FastifyRequest, reply: FastifyReply) => {
    const { photoId } = req.params as { photoId: string };
    if (!photoId) return reply.code(400).send({ error: 'Missing photoId' });
    const result = await Service.rejectPhoto(photoId);
    return reply.send(result);
  };

  // Stats
  const getPlatformStats = async (_req: FastifyRequest, reply: FastifyReply) => {
    const result = await Service.getPlatformStats();
    return reply.send(result);
  };

  // Audit logs
  const getAuditLogs = async (_req: FastifyRequest, reply: FastifyReply) => {
    const result = await Service.getAuditLogs();
    return reply.send(result);
  };

  return {
    getAllReports,
    takeActionOnReport,
    getAllUsers,
    suspendUser,
    activateUser,
    deleteUser,
    getAllProfiles,
    approveProfile,
    rejectProfile,
    getPendingPhotos,
    approvePhoto,
    rejectPhoto,
    getPlatformStats,
    getAuditLogs,
  };
};

export type AdminControllerSchema = ReturnType<typeof createAdminController>;
export default createAdminController;
