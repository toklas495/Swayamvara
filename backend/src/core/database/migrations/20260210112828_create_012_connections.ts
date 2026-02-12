import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('connections', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('interest_id').notNullable().unique().references('id').inTable('interests').onDelete('RESTRICT');
    table.uuid('profile1_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.uuid('profile2_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.enum('status', ['active', 'family_approved', 'engaged', 'broken']).notNullable().defaultTo('active');
    table.timestamp('family_approved_at').nullable();
    table.timestamp('engaged_at').nullable();
    table.timestamp('broken_at').nullable();
    table.uuid('broken_by_profile_id').nullable().references('id').inTable('profiles').onDelete('SET NULL');
    table.timestamps(true, true);

    table.unique(['profile1_id', 'profile2_id']);
    table.index('interest_id');
    table.index(['profile1_id', 'status']);
    table.index(['profile2_id', 'status']);
    
    // Canonical ordering: profile1_id < profile2_id
    table.check('profile1_id < profile2_id', [], 'connections_canonical_order');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('connections');
}