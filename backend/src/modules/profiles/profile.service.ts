import type { ProfileModelSchema } from './profile.model';
import type { ErrorSchema } from '../../utils/app.error';

interface ServiceOpts {
  Model: ProfileModelSchema;
  Error: ErrorSchema;
}

const createProfileService = (opts: ServiceOpts) => {
  const { Model, Error } = opts;

  // Step 1: Basic info + village verification
  const createStep1 = async (userId: string, data: any) => {
    if (!data.full_name || !data.date_of_birth || !data.gender || !data.height_cm || !data.marital_status || !data.village_id) {
      throw Error.badRequest('Missing required fields');
    }
    return Model.createStep1(userId, data);
  };

  // Step 2: Education, occupation, family
  const createStep2 = async (profileId: string, data: any) => {
    if (!data.education || !data.occupation) {
      throw Error.badRequest('Missing required fields');
    }
    return Model.createStep2(profileId, data);
  };

  // Step 3: About, siblings, preferences
  const createStep3 = async (profileId: string, data: any) => {
    if (!data.about_me) {
      throw Error.badRequest('Missing about_me');
    }
    return Model.createStep3(profileId, data);
  };

  // Complete profile
  const completeProfile = async (profileId: string) => {
    return Model.completeProfile(profileId);
  };

  // Get my profile
  const getMyProfile = async (userId: string) => {
    return Model.getMyProfile(userId);
  };

  // Update my profile
  const updateMyProfile = async (userId: string, data: any) => {
    return Model.updateMyProfile(userId, data);
  };

  // View another profile
  const getProfileById = async (profileId: string, viewerId?: string) => {
    return Model.getProfileById(profileId, viewerId);
  };

  // Get my profile stats
  const getMyStats = async (userId: string) => {
    return Model.getMyStats(userId);
  };

  // Update partner preferences
  const updatePreferences = async (profileId: string, data: any) => {
    return Model.updatePreferences(profileId, data);
  };

  // Update profile visibility
  const updateVisibility = async (profileId: string, visible: boolean) => {
    return Model.updateVisibility(profileId, visible);
  };

  // Delete/deactivate profile
  const deleteProfile = async (userId: string) => {
    return Model.deleteProfile(userId);
  };

  return {
    createStep1,
    createStep2,
    createStep3,
    completeProfile,
    getMyProfile,
    updateMyProfile,
    getProfileById,
    getMyStats,
    updatePreferences,
    updateVisibility,
    deleteProfile,
  };
};

export type ProfileServiceSchema = ReturnType<typeof createProfileService>;
export default createProfileService;
