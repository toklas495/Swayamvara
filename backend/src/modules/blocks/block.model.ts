import { Knex } from 'knex';

export interface Block {
  id: string;
  blocker_profile_id: string;
  blocked_profile_id: string;
  created_at: string;
}

export interface BlockModelSchema {
  blockProfile(blockerProfileId: string, blockedProfileId: string): Promise<Block>;
  getBlockedProfiles(profileId: string): Promise<Block[]>;
  unblockProfile(blockId: string, profileId: string): Promise<boolean>;
}

const createBlockModel = (knex: Knex): BlockModelSchema => ({
  async blockProfile(blockerProfileId, blockedProfileId) {
    const [block] = await knex('blocks')
      .insert({ blocker_profile_id: blockerProfileId, blocked_profile_id: blockedProfileId })
      .returning(['id', 'blocker_profile_id', 'blocked_profile_id', 'created_at']);
    return block;
  },

  async getBlockedProfiles(profileId) {
    return knex('blocks')
      .where('blocker_profile_id', profileId)
      .select('id', 'blocker_profile_id', 'blocked_profile_id', 'created_at');
  },

  async unblockProfile(blockId, profileId) {
    const rows = await knex('blocks')
      .where({ id: blockId, blocker_profile_id: profileId })
      .del();
    return rows > 0;
  },
});

export default createBlockModel;
