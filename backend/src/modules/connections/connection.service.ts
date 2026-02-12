import type { ConnectionModelSchema } from './connection.model';
import type { ErrorSchema } from '../../utils/app.error';

interface ServiceOpts {
  Model: ConnectionModelSchema;
  Error: ErrorSchema;
}

const createConnectionService = (opts: ServiceOpts) => {
  const { Model } = opts;

  const getAll = async (profileId: string) => Model.getAll(profileId);
  const getById = async (connectionId: string, profileId: string) => Model.getById(connectionId, profileId);
  const updateStatus = async (connectionId: string, status: string, byProfileId: string, reason?: string) => Model.updateStatus(connectionId, status, byProfileId, reason);
  const unlockContact = async (connectionId: string, byProfileId: string) => Model.unlockContact(connectionId, byProfileId);
  const familyApprove = async (connectionId: string, byProfileId: string) => Model.familyApprove(connectionId, byProfileId);
  const markEngaged = async (connectionId: string, byProfileId: string) => Model.markEngaged(connectionId, byProfileId);
  const breakConnection = async (connectionId: string, byProfileId: string, reason?: string) => Model.breakConnection(connectionId, byProfileId, reason);
  const getLogs = async (connectionId: string, profileId: string) => Model.getLogs(connectionId, profileId);

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

export type ConnectionServiceSchema = ReturnType<typeof createConnectionService>;
export default createConnectionService;
