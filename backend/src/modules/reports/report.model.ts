import { Knex } from 'knex';

export interface Report {
  id: string;
  reporter_profile_id: string;
  reported_profile_id: string;
  category: string;
  description: string;
  status: string;
  created_at: string;
}

export interface ReportModelSchema {
  createReport(reporterProfileId: string, reportedProfileId: string, category: string, description: string): Promise<Report>;
  getMyReports(profileId: string): Promise<Report[]>;
}

const createReportModel = (knex: Knex): ReportModelSchema => ({
  async createReport(reporterProfileId, reportedProfileId, category, description) {
    const [report] = await knex('reports')
      .insert({
        reporter_profile_id: reporterProfileId,
        reported_profile_id: reportedProfileId,
        category,
        description,
        status: 'pending',
        created_at: new Date(),
      })
      .returning(['id', 'reporter_profile_id', 'reported_profile_id', 'category', 'description', 'status', 'created_at']);
    return report;
  },
  async getMyReports(profileId) {
    return knex('reports')
      .where('reporter_profile_id', profileId)
      .select('id', 'reporter_profile_id', 'reported_profile_id', 'category', 'description', 'status', 'created_at');
  },
});

export default createReportModel;
