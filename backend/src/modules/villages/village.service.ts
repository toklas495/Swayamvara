import type { VillageModelSchema } from './village.model';
import type { ErrorSchema } from '../../utils/app.error';

interface ServiceOpts {
  Model: VillageModelSchema;
  Error: ErrorSchema;
}

const createVillageService = (opts: ServiceOpts) => {
  const { Model } = opts;

  // Get all villages (Betul only)
  const getAll = async () => {
    return Model.getAll();
  };

  // Search villages by name
  const search = async (name: string) => {
    if (!name) throw opts.Error.badRequest('Name is required');
    return Model.search(name);
  };

  // Get village details by ID
  const getById = async (villageId: string) => {
    return Model.getById(villageId);
  };

  return {
    getAll,
    search,
    getById,
  };
};

export type VillageServiceSchema = ReturnType<typeof createVillageService>;
export default createVillageService;
