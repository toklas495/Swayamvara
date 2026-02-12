import type { Knex } from 'knex';
import type { ErrorSchema } from '../../utils/app.error';

interface ModelOpts {
  db: Knex;
  Error: ErrorSchema;
}

const createVillageModel = (opts: ModelOpts) => {
  const { db, Error } = opts;

  // Get all villages (Betul only)
  const getAll = async () => {
    return db('villages').where({ district: 'Betul' }).orderBy('village_name', 'asc');
  };

  // Search villages by name (Betul only)
  const search = async (name: string) => {
    return db('villages')
      .where({ district: 'Betul' })
      .andWhere('village_name', 'ilike', `%${name}%`)
      .orderBy('village_name', 'asc');
  };

  // Get village details by ID
  const getById = async (villageId: string) => {
    const village = await db('villages').where({ id: villageId }).first();
    if (!village) throw Error.notFound('Village not found');
    return village;
  };

  return {
    getAll,
    search,
    getById,
  };
};

export type VillageModelSchema = ReturnType<typeof createVillageModel>;
export default createVillageModel;
