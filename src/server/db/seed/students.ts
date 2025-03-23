import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { students } from '@/server/db/schema/students';
import { users } from '@/server/db/schema/users';
import { eq } from 'drizzle-orm';

interface SeedStudentsConfig {
  count?: number;
  startingBatch?: number;
  programs?: string[];
  existingUsers?: any[];
}

export async function seedStudents(config: SeedStudentsConfig = {}) {
  console.log('👨‍🎓 Seeding students...');

  const {
    count = 50,
    startingBatch = new Date().getFullYear(),
    programs = ['Computer Science', 'Engineering', 'Business', 'Mathematics', 'Physics'],
    existingUsers = [],
  } = config;

  let userIds = [];

  if (existingUsers.length > 0) {
    const studentUsers = existingUsers.filter((user) => user.role === 'student');

    if (studentUsers.length > 0) {
      console.log(`Using ${studentUsers.length} existing student users from user seeding`);
      userIds = studentUsers.map((user) => user.id);
    }
  }

  if (userIds.length < count) {
    const dbStudentUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, 'student'))
      .limit(count - userIds.length);
    userIds = [...userIds, ...dbStudentUsers.map((user) => user.id)];
  }

  const adjustedCount = Math.min(count, userIds.length);

  if (adjustedCount < count) {
    console.warn(`Not enough valid student user IDs. Creating ${adjustedCount} students instead of ${count}.`);
  }

  if (adjustedCount === 0) {
    console.warn('No valid student user IDs found. Cannot create any student records.');
    return [];
  }

  const studentRecords = [];
  const countries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'India',
    'China',
    'Nigeria',
    'Germany',
    'France',
    'Brazil',
  ];
  const relationships = ['Father', 'Mother', 'Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Guardian', 'Sibling'];

  for (let i = 0; i < adjustedCount; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const gender = faker.helpers.arrayElement(['Male', 'Female', 'Other', 'Prefer not to say']);
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();
    const dateOfBirth = faker.date.birthdate({ min: 18, max: 30, mode: 'age' });

    const currentAddress = faker.location.streetAddress({ useFullAddress: true });
    const permanentAddress = faker.datatype.boolean(0.7)
      ? currentAddress
      : faker.location.streetAddress({ useFullAddress: true });

    const guardianFirstName = faker.person.firstName();
    const guardianLastName = faker.datatype.boolean(0.8) ? lastName : faker.person.lastName();
    const guardianName = `${guardianFirstName} ${guardianLastName}`;
    const guardianRelationship = faker.helpers.arrayElement(relationships);
    const guardianEmail = faker.internet
      .email({ firstName: guardianFirstName, lastName: guardianLastName })
      .toLowerCase();

    const batch = startingBatch - faker.number.int({ min: 0, max: 3 });
    const program = faker.helpers.arrayElement(programs);

    const userId = userIds[i];

    console.log(`Creating student with user ID: ${userId}`);

    studentRecords.push({
      userId: userId,
      firstName: firstName,
      lastName: lastName,
      displayName: `${firstName} ${lastName}`,
      email: email,
      phone: faker.phone.number(),
      gender: gender,
      dateOfBirth: dateOfBirth,
      placeOfBirth: faker.location.city(),
      nationality: faker.helpers.arrayElement(countries),
      currentAddress: currentAddress,
      permanentAddress: permanentAddress,
      guardianName: guardianName,
      guardianRelationship: guardianRelationship,
      guardianPhone: faker.phone.number(),
      guardianEmail: guardianEmail,
      batch: batch,
      program: program,
      createdAt: faker.date.between({ from: new Date(`${batch}-01-01`), to: new Date() }),
      updatedAt: new Date(),
    });
  }

  if (studentRecords.length === 0) {
    console.log('No student records to insert.');
    return [];
  }

  const insertedStudents = await db.insert(students).values(studentRecords).returning();

  console.log(`✅ Seeded ${insertedStudents.length} students`);

  return insertedStudents;
}
