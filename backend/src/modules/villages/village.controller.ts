import type { VillageServiceSchema } from './village.service';
import type { ErrorSchema } from '../../utils/app.error';
import type { FastifyRequest, FastifyReply } from 'fastify';

interface ControllerOpts {
  Service: VillageServiceSchema;
  Error: ErrorSchema;
}

const createVillageController = (opts: ControllerOpts) => {
  const { Service } = opts;

  // GET /
  const getAll = async (_req: FastifyRequest, reply: FastifyReply) => {
    const villages = await Service.getAll();
    return reply.send(villages);
  };

  // GET /search?name=xxx
  const search = async (req: FastifyRequest, reply: FastifyReply) => {
    const { name } = req.query as { name: string };
    if (!name) return reply.code(400).send({ error: 'Name is required' });
    const villages = await Service.search(name);
    return reply.send(villages);
  };

  // GET /:villageId
  const getById = async (req: FastifyRequest, reply: FastifyReply) => {
    const { villageId } = req.params as { villageId: string };
    if (!villageId) return reply.code(400).send({ error: 'villageId is required' });
    const village = await Service.getById(villageId);
    return reply.send(village);
  };

  return {
    getAll,
    search,
    getById,
  };
};

export type VillageControllerSchema = ReturnType<typeof createVillageController>;
export default createVillageController;
