import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('blocks', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('blocker_profile_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.uuid('blocked_profile_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.text('reason').nullable();
    table.timestamp('blocked_at').notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);

    table.unique(['blocker_profile_id', 'blocked_profile_id']);
    table.index('blocker_profile_id');
    table.index('blocked_profile_id');
    
    // Prevent self-blocking
    table.check('blocker_profile_id != blocked_profile_id', [], 'blocks_no_self_block');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('blocks');
}