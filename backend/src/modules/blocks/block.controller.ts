
import type { BlockServiceSchema } from './block.service';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Knex } from 'knex';
import { getProfileIdByUserId } from '../../utils/profile.utils';

interface ControllerOpts {
  Service: BlockServiceSchema;
  db: Knex;
}

const createBlockController = (opts: ControllerOpts) => {
  const { Service, db } = opts;

  // POST / - Block a profile
  const blockProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.userId;
    const { blockedProfileId } = req.body as { blockedProfileId: string };
    if (!userId || !blockedProfileId) return reply.code(400).send({ error: 'Missing params' });
    const blockerProfileId = await getProfileIdByUserId(db, userId);
    if (!blockerProfileId) return reply.code(400).send({ error: 'No profile for user' });
    try {
      const result = await Service.blockProfile(blockerProfileId, blockedProfileId);
      return reply.send(result);
    } catch (e: any) {
      return reply.code(400).send({ error: e.message });
    }
  };

  // GET / - Get my blocked profiles
  const getBlockedProfiles = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.userId;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
    const profileId = await getProfileIdByUserId(db, userId);
    if (!profileId) return reply.code(400).send({ error: 'No profile for user' });
    const result = await Service.getBlockedProfiles(profileId);
    return reply.send(result);
  };

  // DELETE /:blockId - Unblock profile
  const unblockProfile = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.userId;
    const { blockId } = req.params as { blockId: string };
    if (!userId || !blockId) return reply.code(400).send({ error: 'Missing params' });
    const profileId = await getProfileIdByUserId(db, userId);
    if (!profileId) return reply.code(400).send({ error: 'No profile for user' });
    const result = await Service.unblockProfile(blockId, profileId);
    return reply.send({ success: result });
  };

  return {
    blockProfile,
    getBlockedProfiles,
    unblockProfile,
  };
};

export type BlockControllerSchema = ReturnType<typeof createBlockController>;
export default createBlockController;
