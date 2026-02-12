import type { InterestServiceSchema } from './interest.service';
import type { ErrorSchema } from '../../utils/app.error';
import type { FastifyRequest, FastifyReply } from 'fastify';

interface ControllerOpts {
  Service: InterestServiceSchema;
  Error: ErrorSchema;
}

const createInterestController = (opts: ControllerOpts) => {
  const { Service } = opts;

  // POST /send
  const send = async (req: FastifyRequest, reply: FastifyReply) => {
    const senderProfileId = req.user?.profileId;
    const { receiverProfileId, message } = req.body as { receiverProfileId: string, message?: string };
    if (!senderProfileId || !receiverProfileId) return reply.code(400).send({ error: 'Missing profileId' });
    const result = await Service.send(senderProfileId, receiverProfileId, message);
    return reply.send(result);
  };

  // GET /sent
  const getSent = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.getSent(profileId);
    return reply.send(result);
  };

  // GET /received
  const getReceived = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const result = await Service.getReceived(profileId);
    return reply.send(result);
  };

  // PUT /:interestId/accept
  const accept = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { interestId } = req.params as { interestId: string };
    if (!profileId || !interestId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.accept(interestId, profileId);
    return reply.send(result);
  };

  // PUT /:interestId/reject
  const reject = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { interestId } = req.params as { interestId: string };
    const { reason } = req.body as { reason?: string };
    if (!profileId || !interestId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.reject(interestId, profileId, reason);
    return reply.send(result);
  };

  // POST /:interestId/question
  const askQuestion = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { interestId } = req.params as { interestId: string };
    const { questionText } = req.body as { questionText: string };
    if (!profileId || !interestId || !questionText) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.askQuestion(interestId, profileId, questionText);
    return reply.send(result);
  };

  // PUT /:interestId/answer
  const answerQuestion = async (req: FastifyRequest, reply: FastifyReply) => {
    const { interestId } = req.params as { interestId: string };
    const { answerText } = req.body as { answerText: string };
    if (!interestId || !answerText) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.answerQuestion(interestId, answerText);
    return reply.send(result);
  };

  // DELETE /:interestId/withdraw
  const withdraw = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { interestId } = req.params as { interestId: string };
    if (!profileId || !interestId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.withdraw(interestId, profileId);
    return reply.send(result);
  };

  // GET /:interestId
  const getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    const { interestId } = req.params as { interestId: string };
    if (!profileId || !interestId) return reply.code(400).send({ error: 'Missing params' });
    const result = await Service.getById(interestId, profileId);
    return reply.send(result);
  };

  return {
    send,
    getSent,
    getReceived,
    accept,
    reject,
    askQuestion,
    answerQuestion,
    withdraw,
    getById,
  };
};

export type InterestControllerSchema = ReturnType<typeof createInterestController>;
export default createInterestController;
