import type { AdminModelSchema } from './admin.model';

export interface AdminServiceSchema {
  // Reports
  getAllReports(): Promise<any[]>;
  takeActionOnReport(reportId: string, status: string, actionedBy: string): Promise<any>;
  // Users
  getAllUsers(): Promise<any[]>;
  suspendUser(userId: string): Promise<any>;
  activateUser(userId: string): Promise<any>;
  deleteUser(userId: string): Promise<any>;
  // Profiles
  getAllProfiles(): Promise<any[]>;
  approveProfile(profileId: string): Promise<any>;
  rejectProfile(profileId: string): Promise<any>;
  // Photos
  getPendingPhotos(): Promise<any[]>;
  approvePhoto(photoId: string): Promise<any>;
  rejectPhoto(photoId: string): Promise<any>;
  // Stats
  getPlatformStats(): Promise<any>;
  // Audit logs
  getAuditLogs(): Promise<any[]>;
}

const createAdminService = (model: AdminModelSchema): AdminServiceSchema => ({
  getAllReports: () => model.getAllReports(),
  takeActionOnReport: (reportId, status, actionedBy) => model.takeActionOnReport(reportId, status, actionedBy),
  getAllUsers: () => model.getAllUsers(),
  suspendUser: (userId) => model.suspendUser(userId),
  activateUser: (userId) => model.activateUser(userId),
  deleteUser: (userId) => model.deleteUser(userId),
  getAllProfiles: () => model.getAllProfiles(),
  approveProfile: (profileId) => model.approveProfile(profileId),
  rejectProfile: (profileId) => model.rejectProfile(profileId),
  getPendingPhotos: () => model.getPendingPhotos(),
  approvePhoto: (photoId) => model.approvePhoto(photoId),
  rejectPhoto: (photoId) => model.rejectPhoto(photoId),
  getPlatformStats: () => model.getPlatformStats(),
  getAuditLogs: () => model.getAuditLogs(),
});

export default createAdminService;
