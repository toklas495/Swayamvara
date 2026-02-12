import type { ReportModelSchema } from './report.model';

export interface ReportServiceSchema {
  createReport(reporterProfileId: string, reportedProfileId: string, category: string, description: string): Promise<any>;
  getMyReports(profileId: string): Promise<any[]>;
}

const createReportService = (model: ReportModelSchema): ReportServiceSchema => ({
  async createReport(reporterProfileId, reportedProfileId, category, description) {
    if (reporterProfileId === reportedProfileId) throw new Error('Cannot report self');
    return model.createReport(reporterProfileId, reportedProfileId, category, description);
  },
  async getMyReports(profileId) {
    return model.getMyReports(profileId);
  },
});

export default createReportService;
