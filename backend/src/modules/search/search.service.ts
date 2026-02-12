import type { SearchModelSchema } from './search.model';
import type { ErrorSchema } from '../../utils/app.error';

interface ServiceOpts {
  Model: SearchModelSchema;
  Error: ErrorSchema;
}

const createSearchService = (opts: ServiceOpts) => {
  const { Model, Error } = opts;

  // POST /profiles - Search profiles with filters
  const searchProfiles = async (filters: any) => {
    return Model.searchProfiles(filters);
  };

  // GET /matches - Get AI-matched profiles
  const getMatches = async (profileId: string) => {
    if (!profileId) throw Error.badRequest('profileId required');
    return Model.getMatches(profileId);
  };

  // GET /recent-views - Profiles I recently viewed
  const getRecentViews = async (userId: string) => {
    if (!userId) throw Error.badRequest('userId required');
    return Model.getRecentViews(userId);
  };

  // GET /viewed-me - Who viewed my profile
  const getViewedMe = async (profileId: string) => {
    if (!profileId) throw Error.badRequest('profileId required');
    return Model.getViewedMe(profileId);
  };

  return {
    searchProfiles,
    getMatches,
    getRecentViews,
    getViewedMe,
  };
};

export type SearchServiceSchema = ReturnType<typeof createSearchService>;
export default createSearchService;
