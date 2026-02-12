import type { Knex } from 'knex';
import type { ErrorSchema } from '../../utils/app.error';

interface ModelOpts {
  db: Knex;
  Error: ErrorSchema;
}

const createProfileModel = (opts: ModelOpts) => {
  const { db, Error } = opts;

  // Step 1: Create profile with basic info and village verification
  const createStep1 = async (userId: string, data: any) => {
    // data: { full_name, date_of_birth, gender, height_cm, marital_status, village_id }
    // 1. Verify village exists
    const village = await db('villages').where({ id: data.village_id }).first();
    if (!village) throw Error.notFound('Village not found');

    // 2. Check if profile already exists for user
    const existing = await db('profiles').where({ user_id: userId }).first();
    if (existing) throw Error.badRequest('Profile already exists');

    // 3. Insert profile
    const [profile] = await db('profiles')
      .insert({
        user_id: userId,
        full_name: data.full_name,
        date_of_birth: data.date_of_birth,
        gender: data.gender,
        height_cm: data.height_cm,
        marital_status: data.marital_status,
        village_id: data.village_id,
        profile_status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
      }, ['id']);
    return { profile_id: profile.id };
  };

  // Step 2: Add education, occupation, family details
  const createStep2 = async (profileId: string, data: any) => {
    // data: { education, occupation, income_annual, family_details }
    // Update profile with education, occupation, income, family (family_details can be a JSON field or mapped to columns)
    const updated = await db('profiles')
      .where({ id: profileId })
      .update({
        education: data.education,
        occupation: data.occupation,
        income_annual: data.income_annual,
        // If you have a family_details column or siblings_json, update accordingly
        siblings_json: data.siblings_json || null,
        updated_at: new Date(),
      });
    if (!updated) throw Error.notFound('Profile not found');
    return { success: true };
  };

  // Step 3: Add about me, siblings, preferences
  const createStep3 = async (profileId: string, data: any) => {
    // data: { about_me, siblings_json, preferences: { ... } }
    // 1. Update profile with about_me, siblings_json
    const updated = await db('profiles')
      .where({ id: profileId })
      .update({
        about_me: data.about_me,
        siblings_json: data.siblings_json || null,
        updated_at: new Date(),
      });
    if (!updated) throw Error.notFound('Profile not found');

    // 2. Upsert profile_preferences
    if (data.preferences) {
      const pref = data.preferences;
      const exists = await db('profile_preferences').where({ profile_id: profileId }).first();
      if (exists) {
        await db('profile_preferences').where({ profile_id: profileId }).update({
          age_min: pref.age_min,
          age_max: pref.age_max,
          height_min_cm: pref.height_min_cm,
          height_max_cm: pref.height_max_cm,
          education_preference: pref.education_preference,
          marital_status_preference: pref.marital_status_preference,
          village_preference: pref.village_preference,
          updated_at: new Date(),
        });
      } else {
        await db('profile_preferences').insert({
          profile_id: profileId,
          age_min: pref.age_min,
          age_max: pref.age_max,
          height_min_cm: pref.height_min_cm,
          height_max_cm: pref.height_max_cm,
          education_preference: pref.education_preference,
          marital_status_preference: pref.marital_status_preference,
          village_preference: pref.village_preference,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    }
    return { success: true };
  };

  // Complete profile
  const completeProfile = async (profileId: string) => {
    const updated = await db('profiles')
      .where({ id: profileId })
      .update({
        completed_at: new Date(),
        updated_at: new Date(),
      });
    if (!updated) throw Error.notFound('Profile not found');
    return { success: true };
  };

  // Get my profile
  const getMyProfile = async (userId: string) => {
    const profile = await db('profiles').where({ user_id: userId }).first();
    if (!profile) throw Error.notFound('Profile not found');
    return profile;
  };

  // Update my profile
  const updateMyProfile = async (userId: string, data: any) => {
    const updated = await db('profiles').where({ user_id: userId }).update({ ...data, updated_at: new Date() });
    if (!updated) throw Error.notFound('Profile not found');
    return { success: true };
  };

  // View another profile
  const getProfileById = async (profileId: string, _viewerId?: string) => {
    // TODO: Add logic to respect stages (anonymity, etc.)
    const profile = await db('profiles').where({ id: profileId }).first();
    if (!profile) throw Error.notFound('Profile not found');
    return profile;
  };

  // Get my profile stats
  const getMyStats = async (userId: string) => {
    // Example: count interests and views (audit_logs)
    const profile = await db('profiles').where({ user_id: userId }).first();
    if (!profile) throw Error.notFound('Profile not found');
    const profileId = profile.id;
    const interests = await db('interests').where({ receiver_profile_id: profileId }).count('id as count');
    const views = await db('audit_logs').where({ entity_type: 'profile', entity_id: profileId }).count('id as count');
    return {
      interests: parseInt(String(interests[0]?.count ?? '0'), 10),
      views: parseInt(String(views[0]?.count ?? '0'), 10),
    };
  };

  // Update partner preferences
  const updatePreferences = async (profileId: string, data: any) => {
    const exists = await db('profile_preferences').where({ profile_id: profileId }).first();
    if (exists) {
      await db('profile_preferences').where({ profile_id: profileId }).update({ ...data, updated_at: new Date() });
    } else {
      await db('profile_preferences').insert({ ...data, profile_id: profileId, created_at: new Date(), updated_at: new Date() });
    }
    return { success: true };
  };

  // Update profile visibility
  const updateVisibility = async (profileId: string, visible: boolean) => {
    // visible: true => active, false => inactive
    const status = visible ? 'active' : 'inactive';
    const updated = await db('profiles').where({ id: profileId }).update({ profile_status: status, updated_at: new Date() });
    if (!updated) throw Error.notFound('Profile not found');
    return { success: true };
  };

  // Delete/deactivate profile
  const deleteProfile = async (userId: string) => {
    const updated = await db('profiles').where({ user_id: userId }).update({ profile_status: 'inactive', updated_at: new Date() });
    if (!updated) throw Error.notFound('Profile not found');
    return { success: true };
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

export type ProfileModelSchema = ReturnType<typeof createProfileModel>;
export default createProfileModel;
