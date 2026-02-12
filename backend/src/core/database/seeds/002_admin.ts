import { Knex } from 'knex';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries
  await knex('admins').del();
  await knex('users').where('role', 'admin').del();

  // Create super admin user
  const [adminUser] = await knex('users')
    .insert({
      phone: '+919999999999',
      phone_verified_at: knex.fn.now(),
      role: 'admin',
      is_active: true,
    })
    .returning('*');

  // Create admin record
  await knex('admins').insert({
    user_id: adminUser.id,
    admin_level: 'super_admin',
    permissions_json: JSON.stringify({
      can_review_profiles: true,
      can_review_reports: true,
      can_suspend_users: true,
      can_delete_users: true,
      can_approve_photos: true,
    }),
  });
}