import { Knex } from 'knex';

export interface AdminModelSchema {
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

const createAdminModel = (knex: Knex): AdminModelSchema => ({
  // Reports
  async getAllReports() {
    return knex('reports').select('*');
  },
  async takeActionOnReport(reportId, status, actionedBy) {
    return knex('reports').where({ id: reportId }).update({ status, actioned_by: actionedBy, actioned_at: new Date() });
  },
  // Users
  async getAllUsers() {
    return knex('users').select('*');
  },
  async suspendUser(userId) {
    return knex('users').where({ id: userId }).update({ status: 'suspended', updated_at: new Date() });
  },
  async activateUser(userId) {
    return knex('users').where({ id: userId }).update({ status: 'active', updated_at: new Date() });
  },
  async deleteUser(userId) {
    return knex('users').where({ id: userId }).del();
  },
  // Profiles
  async getAllProfiles() {
    return knex('profiles').select('*');
  },
  async approveProfile(profileId) {
    return knex('profiles').where({ id: profileId }).update({ profile_status: 'active', updated_at: new Date() });
  },
  async rejectProfile(profileId) {
    return knex('profiles').where({ id: profileId }).update({ profile_status: 'rejected', updated_at: new Date() });
  },
  // Photos
  async getPendingPhotos() {
    return knex('profile_photos').where({ is_approved: false }).select('*');
  },
  async approvePhoto(photoId) {
    return knex('profile_photos').where({ id: photoId }).update({ is_approved: true, approved_at: new Date() });
  },
  async rejectPhoto(photoId) {
    return knex('profile_photos').where({ id: photoId }).update({ is_approved: false, rejected_at: new Date() });
  },
  // Stats
  async getPlatformStats() {
    const users = await knex('users').count('id as count');
    const profiles = await knex('profiles').count('id as count');
    const reports = await knex('reports').count('id as count');
    return {
      users: parseInt(users[0]?.count ?? '0', 10),
      profiles: parseInt(profiles[0]?.count ?? '0', 10),
      reports: parseInt(reports[0]?.count ?? '0', 10),
    };
  },
  // Audit logs
  async getAuditLogs() {
    return knex('audit_logs').select('*').orderBy('created_at', 'desc');
  },
});

export default createAdminModel;
