import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('interest_questions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('interest_id').notNullable().unique().references('id').inTable('interests').onDelete('CASCADE');
    table.uuid('asked_by_profile_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.text('question_text').notNullable();
    table.text('answer_text').nullable();
    table.timestamp('asked_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('answered_at').nullable();
    table.timestamps(true, true);

    table.index('interest_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('interest_questions');
}