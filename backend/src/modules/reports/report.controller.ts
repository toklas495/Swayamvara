import type { ReportServiceSchema } from './report.service';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { Knex } from 'knex';
import { getProfileIdByUserId } from '../../utils/profile.utils';

interface ControllerOpts {
  Service: ReportServiceSchema;
  db: Knex;
}

const createReportController = (opts: ControllerOpts) => {
  const { Service, db } = opts;

  // POST / - Report a profile
  const createReport = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.userId;
    const { reportedProfileId, category, description } = req.body as { reportedProfileId: string, category: string, description: string };
    if (!userId || !reportedProfileId || !category) return reply.code(400).send({ error: 'Missing params' });
    const reporterProfileId = await getProfileIdByUserId(db, userId);
    if (!reporterProfileId) return reply.code(400).send({ error: 'No profile for user' });
    try {
      const result = await Service.createReport(reporterProfileId, reportedProfileId, category, description);
      return reply.send(result);
    } catch (e: any) {
      return reply.code(400).send({ error: e.message });
    }
  };

  // GET /me - Get my reports
  const getMyReports = async (req: FastifyRequest, reply: FastifyReply) => {
    const userId = req.user?.userId;
    if (!userId) return reply.code(401).send({ error: 'Unauthorized' });
    const profileId = await getProfileIdByUserId(db, userId);
    if (!profileId) return reply.code(400).send({ error: 'No profile for user' });
    const result = await Service.getMyReports(profileId);
    return reply.send(result);
  };

  return {
    createReport,
    getMyReports,
  };
};

export type ReportControllerSchema = ReturnType<typeof createReportController>;
export default createReportController;
