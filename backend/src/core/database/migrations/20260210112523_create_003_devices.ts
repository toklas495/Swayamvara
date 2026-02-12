import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('devices', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('device_fingerprint', 255).notNullable();
    table.string('fcm_token', 255).nullable();
    table.timestamp('last_active').notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);

    table.unique(['user_id', 'device_fingerprint']);
    table.index('user_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('devices');
}

