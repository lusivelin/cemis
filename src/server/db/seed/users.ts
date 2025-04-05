import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { users } from '@/server/db/schema/users';
import { createClient } from '@supabase/supabase-js';

interface SeedUsersConfig {
  adminCount?: number;
  teacherCount?: number;
  studentCount?: number;
}

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function seedUsers(config: SeedUsersConfig = {}) {
  console.log('👥 Seeding users with Supabase Auth integration...');

  const { adminCount = 1, teacherCount = 2, studentCount = 5 } = config;

  // Create admin users
  const adminUsers = await createRoleUsers('admin', adminCount);
  console.log(`✅ Seeded ${adminUsers.length} admin users`);

  // Create teacher users
  const teacherUsers = await createRoleUsers('teacher', teacherCount);
  console.log(`✅ Seeded ${teacherUsers.length} teacher users`);

  // Create student users
  const studentUsers = await createRoleUsers('student', studentCount);
  console.log(`✅ Seeded ${studentUsers.length} student users`);

  return {
    adminUsers,
    teacherUsers,
    studentUsers,
    allUsers: [...adminUsers, ...teacherUsers, ...studentUsers],
  };
}

async function createRoleUsers(role: 'admin' | 'teacher' | 'student', count: number) {
  const userRecords = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const password = '12345';

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        firstName,
        lastName,
        role,
      },
    });

    if (authError) {
      console.error(`Error creating auth user ${email}:`, authError);
      continue;
    }

    const createdAt = faker.date.past({ years: 1 });

    const [insertedUser] = await db
      .insert(users)
      .values({
        authUserId: authData.user.id,
        role,
        createdAt,
        updatedAt: new Date(),
      })
      .returning();

    userRecords.push({
      ...insertedUser,
      email,
      password,
      firstName,
      lastName,
    });
  }

  return userRecords;
}

export const clearAuthData = async () => {
  console.log('🔑 Clearing authentication data except admin@weverlab.com...');

  try {
    const { data: allUsers, error: getUsersError } = await supabaseAdmin.auth.admin.listUsers();

    if (getUsersError) {
      console.error('Error fetching users:', getUsersError);
      return;
    }

    const usersToDelete = allUsers.users.filter((user) => user.email !== 'admin@weverlab.com');

    console.log(`Found ${usersToDelete.length} users to delete`);

    for (const user of usersToDelete) {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id);
      if (error) {
        console.error(`Error deleting user ${user.email}:`, error);
      } else {
        console.log(`Deleted user: ${user.email}`);
      }
    }

    console.log('✅ Authentication data cleared successfully');
  } catch (error) {
    console.error('Error clearing authentication data:', error);
  }
};
