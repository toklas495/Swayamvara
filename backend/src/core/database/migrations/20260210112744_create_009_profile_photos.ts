import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('profile_photos', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('profile_id').notNullable().references('id').inTable('profiles').onDelete('CASCADE');
    table.string('photo_url', 500).notNullable();
    table.boolean('is_primary').notNullable().defaultTo(false);
    table.timestamp('uploaded_at').notNullable().defaultTo(knex.fn.now());
    table.enum('status', ['pending', 'approved', 'rejected']).notNullable().defaultTo('pending');
    table.timestamps(true, true);

    table.index('profile_id');
    table.index(['profile_id', 'is_primary']);
  });

  // Unique constraint: Only one primary photo per profile
  await knex.raw(`
    CREATE UNIQUE INDEX profile_photos_primary_unique 
    ON profile_photos (profile_id) 
    WHERE is_primary = true
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('profile_photos');
}