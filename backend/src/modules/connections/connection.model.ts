import type { Knex } from 'knex';
import type { ErrorSchema } from '../../utils/app.error';

interface ModelOpts {
  db: Knex;
  Error: ErrorSchema;
}

const createConnectionModel = (opts: ModelOpts) => {
  const { db, Error } = opts;

  // Get all my connections
  const getAll = async (profileId: string) => {
    return db('connections')
      .where(function() {
        this.where('profile1_id', profileId).orWhere('profile2_id', profileId);
      })
      .orderBy('created_at', 'desc');
  };

  // Get connection details
  const getById = async (connectionId: string, profileId: string) => {
    const conn = await db('connections')
      .where({ id: connectionId })
      .andWhere(function() {
        this.where('profile1_id', profileId).orWhere('profile2_id', profileId);
      })
      .first();
    if (!conn) throw Error.notFound('Connection not found');
    return conn;
  };

  // Update connection status
  const updateStatus = async (connectionId: string, status: string, byProfileId: string, reason?: string) => {
    const updated = await db('connections').where({ id: connectionId }).update({ status, updated_at: new Date() });
    if (!updated) throw Error.notFound('Connection not found');
    await db('connection_status_logs').insert({
      connection_id: connectionId,
      from_status: null, // Optionally fetch previous status
      to_status: status,
      changed_by_profile_id: byProfileId,
      changed_at: new Date(),
      reason,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return { success: true };
  };

  // Unlock contact info (Stage 3)
  const unlockContact = async (connectionId: string, byProfileId: string) => {
    // Example: set a flag or log the unlock event
    // Here, just log the event
    await db('connection_status_logs').insert({
      connection_id: connectionId,
      from_status: null,
      to_status: 'contact_unlocked',
      changed_by_profile_id: byProfileId,
      changed_at: new Date(),
      reason: 'Contact unlocked',
      created_at: new Date(),
      updated_at: new Date(),
    });
    return { success: true };
  };

  // Mark as family approved
  const familyApprove = async (connectionId: string, byProfileId: string) => {
    return updateStatus(connectionId, 'family_approved', byProfileId, 'Family approved');
  };

  // Mark as engaged
  const markEngaged = async (connectionId: string, byProfileId: string) => {
    return updateStatus(connectionId, 'engaged', byProfileId, 'Engaged');
  };

  // Break connection
  const breakConnection = async (connectionId: string, byProfileId: string, reason?: string) => {
    return updateStatus(connectionId, 'broken', byProfileId, reason || 'Broken');
  };

  // Get status change history
  const getLogs = async (connectionId: string, profileId: string) => {
    // Only allow if profile is part of connection
    const conn = await db('connections')
      .where({ id: connectionId })
      .andWhere(function() {
        this.where('profile1_id', profileId).orWhere('profile2_id', profileId);
      })
      .first();
    if (!conn) throw Error.notFound('Connection not found');
    return db('connection_status_logs').where({ connection_id: connectionId }).orderBy('changed_at', 'asc');
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

export type ConnectionModelSchema = ReturnType<typeof createConnectionModel>;
export default createConnectionModel;
