import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('otp_requests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('phone', 15).notNullable();
    table.string('otp_hash', 255).notNullable();
    table.timestamp('expires_at').notNullable();
    table.integer('attempts').notNullable().defaultTo(0);
    table.timestamp('verified_at').nullable();
    table.string('ip_address', 45).nullable();
    table.timestamps(true, true);

    table.index(['phone', 'expires_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('otp_requests');
}