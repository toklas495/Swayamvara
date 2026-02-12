import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('reports', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('reporter_profile_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.uuid('reported_profile_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.enum('category', ['fake_profile', 'inappropriate_behavior', 'harassment', 'other']).notNullable();
    table.text('description').notNullable();
    table.timestamp('reported_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('admin_reviewed_at').nullable();
    table.enum('admin_action', ['no_action', 'warning', 'suspension', 'deletion']).nullable();
    table.timestamps(true, true);

    table.index('reporter_profile_id');
    table.index('reported_profile_id');
    table.index('reported_at');
    
    // Prevent self-reporting
    table.check('reporter_profile_id != reported_profile_id', [], 'reports_no_self_report');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('reports');
}