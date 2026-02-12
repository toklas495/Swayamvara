import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('profile_preferences', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('profile_id').notNullable().unique().references('id').inTable('profiles').onDelete('CASCADE');
    table.integer('age_min').nullable();
    table.integer('age_max').nullable();
    table.integer('height_min_cm').nullable();
    table.integer('height_max_cm').nullable();
    table.string('education_preference', 500).nullable();
    table.string('marital_status_preference', 100).nullable();
    table.string('village_preference', 500).nullable();
    table.timestamps(true, true);

    table.index('profile_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('profile_preferences');
}