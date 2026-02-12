import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('interests', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('sender_profile_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.uuid('receiver_profile_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.enum('status', ['pending', 'accepted', 'rejected']).notNullable().defaultTo('pending');
    table.string('message', 200).nullable();
    table.timestamp('sent_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('responded_at').nullable();
    table.string('rejection_reason', 500).nullable();
    table.timestamps(true, true);

    table.unique(['sender_profile_id', 'receiver_profile_id']);
    table.index(['sender_profile_id', 'sent_at']);
    table.index('receiver_profile_id');
    table.index('status');
    
    // Prevent self-interest
    table.check('sender_profile_id != receiver_profile_id', [], 'interests_no_self_interest');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('interests');
}