import type { SearchServiceSchema } from './search.service';
import type { ErrorSchema } from '../../utils/app.error';
import type { FastifyRequest, FastifyReply } from 'fastify';

interface ControllerOpts {
  Service: SearchServiceSchema;
  Error: ErrorSchema;
}

const createSearchController = (opts: ControllerOpts) => {
  const { Service } = opts;

  // POST /profiles
  const searchProfiles = async (req: FastifyRequest, reply: FastifyReply) => {
    const filters = req.body;
    const results = await Service.searchProfiles(filters);
    return reply.send(results);
  };

  // GET /matches
  const getMatches = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const results = await Service.getMatches(profileId);
    return reply.send(results);
  };

  // GET /recent-views
  const getRecentViews = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.id;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
    const results = await Service.getRecentViews(userId);
    return reply.send(results);
  };

  // GET /viewed-me
  const getViewedMe = async (req: FastifyRequest, reply: FastifyReply) => {
    const profileId = req.user?.profileId;
    if (!profileId) return reply.code(401).send({ error: 'Unauthorized' });
    const results = await Service.getViewedMe(profileId);
    return reply.send(results);
  };

  return {
    searchProfiles,
    getMatches,
    getRecentViews,
    getViewedMe,
  };
};

export type SearchControllerSchema = ReturnType<typeof createSearchController>;
export default createSearchController;
