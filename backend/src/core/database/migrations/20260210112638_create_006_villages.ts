import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('villages', async (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('taluka', 100).notNullable();
    table.string('village_name', 100).notNullable();
    table.string('district', 100).notNullable();
    table.string('state', 100).notNullable().defaultTo('Maharashtra');
    table.timestamps(true, true);

    table.unique(['taluka', 'village_name']);
    table.index('taluka');
    
    // For fuzzy search on village names
    await knex.raw('CREATE INDEX villages_village_name_trgm_idx ON villages USING gin (village_name gin_trgm_ops)');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('villages');
}