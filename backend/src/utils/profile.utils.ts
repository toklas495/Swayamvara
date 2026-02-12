import { Knex } from 'knex';

export async function getProfileIdByUserId(db: Knex, userId: string): Promise<string | null> {
  const profile = await db('profiles').where({ user_id: userId }).first('id');
  return profile?.id || null;
}
