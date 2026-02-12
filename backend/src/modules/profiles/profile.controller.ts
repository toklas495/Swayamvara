import type { ProfileServiceSchema } from './profile.service';
import type { ErrorSchema } from '../../utils/app.error';
import type { FastifyRequest, FastifyReply } from 'fastify';

interface ControllerOpts {
  Service: ProfileServiceSchema;
  Error: ErrorSchema;
}

const createProfileController = (opts: ControllerOpts) => {
  const { Service } = opts;

  // POST /create/step1
  const createStep1 = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.id;
    const data = req.body;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.createStep1(userId, data);
    return reply.send(result);
  };

  // POST /create/step2
  const createStep2 = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const data = req.body;
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.createStep2(profileId, data);
    return reply.send(result);
  };

  // POST /create/step3
  const createStep3 = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const data = req.body;
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.createStep3(profileId, data);
    return reply.send(result);
  };

  // POST /complete
  const completeProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.completeProfile(profileId);
    return reply.send(result);
  };

  // GET /me
  const getMyProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.id;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.getMyProfile(userId);
    return reply.send(result);
  };

  // PUT /me
  const updateMyProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.id;
    const data = req.body;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.updateMyProfile(userId, data);
    return reply.send(result);
  };

  // GET /:profileId
  const getProfileById = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.params['profileId'];
    const viewerId = req.user?.id;
    if (!profileId) return reply.code(400).send({ error: 'Missing profileId' });
    const result = await Service.getProfileById(profileId, viewerId);
    return reply.send(result);
  };

  // GET /me/stats
  const getMyStats = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.id;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.getMyStats(userId);
    return reply.send(result);
  };

  // PUT /me/preferences
  const updatePreferences = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const data = req.body;
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.updatePreferences(profileId, data);
    return reply.send(result);
  };

  // PUT /me/visibility
  const updateVisibility = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { visible } = req.body as { visible: boolean };
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.updateVisibility(profileId, visible);
    return reply.send(result);
  };

  // DELETE /me
  const deleteProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.id;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.deleteProfile(userId);
    return reply.send(result);
  };

  return {
    createStep1,
    createStep2,
    createStep3,
    completeProfile,
    getMyProfile,
    updateMyProfile,
    getProfileById,
    getMyStats,
    updatePreferences,
    updateVisibility,
    deleteProfile,
  };
};

export type ProfileControllerSchema = ReturnType<typeof createProfileController>;
export default createProfileController;
