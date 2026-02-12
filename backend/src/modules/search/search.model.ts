import type { Knex } from 'knex';
import type { ErrorSchema } from '../../utils/app.error';

interface ModelOpts {
  db: Knex;
  Error: ErrorSchema;
}

const createSearchModel = (opts: ModelOpts) => {
  const { db, Error } = opts;

  // Search profiles with filters
  const searchProfiles = async (filters: any) => {
    let query = db('profiles').where('profile_status', 'active');
    if (filters.gender) query = query.andWhere('gender', filters.gender);
    if (filters.age_min) query = query.andWhereRaw('EXTRACT(YEAR FROM AGE(date_of_birth)) >= ?', [filters.age_min]);
    if (filters.age_max) query = query.andWhereRaw('EXTRACT(YEAR FROM AGE(date_of_birth)) <= ?', [filters.age_max]);
    if (filters.education) query = query.andWhere('education', 'ilike', `%${filters.education}%`);
    if (filters.village_id) query = query.andWhere('village_id', filters.village_id);
    // Add more filters as needed
    return query.orderBy('updated_at', 'desc');
  };

  // Get AI-matched profiles (stub, real logic can use preferences)
  const getMatches = async (profileId: string) => {
    // Example: return profiles of opposite gender, similar age, etc.
    const myProfile = await db('profiles').where({ id: profileId }).first();
    if (!myProfile) throw Error.notFound('Profile not found');
    return db('profiles')
      .where('gender', myProfile.gender === 'male' ? 'female' : 'male')
      .andWhere('profile_status', 'active')
      .andWhereRaw('ABS(EXTRACT(YEAR FROM AGE(date_of_birth)) - EXTRACT(YEAR FROM AGE(?::date))) <= 5', [myProfile.date_of_birth])
      .orderBy('updated_at', 'desc')
      .limit(20);
  };

  // Profiles I recently viewed
  const getRecentViews = async (userId: string) => {
    // Find audit_logs where user_id = userId and entity_type = 'profile', order by created_at desc
    const logs = await db('audit_logs')
      .where({ user_id: userId, entity_type: 'profile' })
      .orderBy('created_at', 'desc')
      .limit(20);
    const profileIds = logs.map((log: any) => log.entity_id);
    return db('profiles').whereIn('id', profileIds);
  };

  // Who viewed my profile
  const getViewedMe = async (profileId: string) => {
    // Find audit_logs where entity_id = profileId and entity_type = 'profile', group by user_id
    const logs = await db('audit_logs')
      .where({ entity_type: 'profile', entity_id: profileId })
      .orderBy('created_at', 'desc')
      .limit(20);
    const userIds = logs.map((log: any) => log.user_id);
    return db('users').whereIn('id', userIds);
  };

  return {
    searchProfiles,
    getMatches,
    getRecentViews,
    getViewedMe,
  };
};

export type SearchModelSchema = ReturnType<typeof createSearchModel>;
export default createSearchModel;
