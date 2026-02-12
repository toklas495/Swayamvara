import type { ConnectionServiceSchema } from './connection.service';
import type { ErrorSchema } from '../../utils/app.error';
import type { FastifyRequest, FastifyReply } from 'fastify';

interface ControllerOpts {
  Service: ConnectionServiceSchema;
  Error: ErrorSchema;
}

const createConnectionController = (opts: ControllerOpts) => {
  const { Service } = opts;

  // GET /
  const getAll = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.getAll(profileId);
    return reply.send(result);
  };

  // GET /:connectionId
  const getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { connectionId } = req.params as { connectionId: string };
    if (!profileId || !connectionId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.getById(connectionId, profileId);
    return reply.send(result);
  };

  // PUT /:connectionId/status
  const updateStatus = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { connectionId } = req.params as { connectionId: string };
    const { status, reason } = req.body as { status: string, reason?: string };
    if (!profileId || !connectionId || !status) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.updateStatus(connectionId, status, profileId, reason);
    return reply.send(result);
  };

  // POST /:connectionId/unlock-contact
  const unlockContact = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { connectionId } = req.params as { connectionId: string };
    if (!profileId || !connectionId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.unlockContact(connectionId, profileId);
    return reply.send(result);
  };

  // PUT /:connectionId/family-approve
  const familyApprove = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { connectionId } = req.params as { connectionId: string };
    if (!profileId || !connectionId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.familyApprove(connectionId, profileId);
    return reply.send(result);
  };

  // PUT /:connectionId/engaged
  const markEngaged = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { connectionId } = req.params as { connectionId: string };
    if (!profileId || !connectionId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.markEngaged(connectionId, profileId);
    return reply.send(result);
  };

  // PUT /:connectionId/break
  const breakConnection = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { connectionId } = req.params as { connectionId: string };
    const { reason } = req.body as { reason?: string };
    if (!profileId || !connectionId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.breakConnection(connectionId, profileId, reason);
    return reply.send(result);
  };

  // GET /:connectionId/logs
  const getLogs = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { connectionId } = req.params as { connectionId: string };
    if (!profileId || !connectionId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.getLogs(connectionId, profileId);
    return reply.send(result);
  };

  return {
    getAll,
    getById,
    updateStatus,
    unlockContact,
    familyApprove,
    markEngaged,
    breakConnection,
    getLogs,
  };
};

export type ConnectionControllerSchema = ReturnType<typeof createConnectionController>;
export default createConnectionController;
