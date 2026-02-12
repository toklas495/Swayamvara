import type { BlockModelSchema } from './block.model';

export interface BlockServiceSchema {
  blockProfile(blockerProfileId: string, blockedProfileId: string): Promise<any>;
  getBlockedProfiles(profileId: string): Promise<any[]>;
  unblockProfile(blockId: string, profileId: string): Promise<boolean>;
}

const createBlockService = (model: BlockModelSchema): BlockServiceSchema => ({
  async blockProfile(blockerProfileId, blockedProfileId) {
    // Prevent self-block
    if (blockerProfileId === blockedProfileId) throw new Error('Cannot block self');
    // Prevent duplicate block
    const existing = await model.getBlockedProfiles(blockerProfileId);
    if (existing.some(b => b.blocked_profile_id === blockedProfileId)) throw new Error('Already blocked');
    return model.blockProfile(blockerProfileId, blockedProfileId);
  },
  async getBlockedProfiles(profileId) {
    return model.getBlockedProfiles(profileId);
  },
  async unblockProfile(blockId, profileId) {
    return model.unblockProfile(blockId, profileId);
  },
});

export default createBlockService;
