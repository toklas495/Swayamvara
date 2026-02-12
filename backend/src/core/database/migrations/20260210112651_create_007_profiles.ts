import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('profiles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').notNullable().unique().references('id').inTable('users').onDelete('CASCADE');
    table.enum('gender', ['male', 'female']).notNullable();
    table.string('full_name', 100).notNullable();
    table.date('date_of_birth').notNullable();
    table.integer('height_cm').notNullable();
    table.string('education', 100).notNullable();
    table.string('occupation', 100).notNullable();
    table.integer('income_annual').nullable();
    table.uuid('village_id').notNullable().references('id').inTable('villages').onDelete('RESTRICT');
    table.text('about_me').nullable();
    table.jsonb('siblings_json').nullable();
    table.enum('marital_status', ['never_married', 'divorced', 'widowed']).notNullable();
    table.enum('profile_status', ['active', 'engaged', 'inactive']).notNullable().defaultTo('active');
    table.timestamp('completed_at').nullable();
    table.timestamps(true, true);

    table.index('user_id');
    table.index('village_id');
    table.index(['gender', 'profile_status']);
    table.index('completed_at');
    
    // Check constraint for age
    table.check(
      `EXTRACT(YEAR FROM AGE(date_of_birth)) >= 18 AND EXTRACT(YEAR FROM AGE(date_of_birth)) <= 60`,
      [],
      'profiles_age_check'
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('profiles');
}