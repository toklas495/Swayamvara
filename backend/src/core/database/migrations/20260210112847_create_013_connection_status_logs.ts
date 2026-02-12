import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('connection_status_logs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('connection_id').notNullable().references('id').inTable('connections').onDelete('CASCADE');
    table.string('from_status', 50).nullable();
    table.string('to_status', 50).notNullable();
    table.uuid('changed_by_profile_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.timestamp('changed_at').notNullable().defaultTo(knex.fn.now());
    table.text('reason').nullable();
    table.timestamps(true, true);

    table.index('connection_id');
    table.index('changed_at');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('connection_status_logs');
}