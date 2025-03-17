import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { students } from '@/server/db/schema/students';

interface SeedStudentsConfig {
  count?: number;
  startingBatch?: number;
  programs?: string[];
}

export async function seedStudents(config: SeedStudentsConfig = {}) {
  console.log('👨‍🎓 Seeding students...');

  const {
    count = 50,
    startingBatch = new Date().getFullYear(),
    programs = ['Computer Science', 'Engineering', 'Business', 'Mathematics', 'Physics'],
  } = config;

  const studentRecords = [];

  const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'India', 'China', 'Nigeria', 'Germany', 'France', 'Brazil'];
  
  const relationships = ['Father', 'Mother', 'Uncle', 'Aunt', 'Grandfather', 'Grandmother', 'Guardian', 'Sibling'];

  for (let i = 0; i < count; i++) {
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
    const guardianLastName = faker.datatype.boolean(0.8) ? lastName : faker.person.lastName(); // 80% chance to have same last name
    const guardianName = `${guardianFirstName} ${guardianLastName}`;
    const guardianRelationship = faker.helpers.arrayElement(relationships);
    const guardianEmail = faker.internet.email({ firstName: guardianFirstName, lastName: guardianLastName }).toLowerCase();
    
    const batch = startingBatch - faker.number.int({ min: 0, max: 3 });
    const program = faker.helpers.arrayElement(programs);

    studentRecords.push({
      authUserId: faker.string.uuid(),
      
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

  const insertedStudents = await db.insert(students).values(studentRecords).returning();

  console.log(`✅ Seeded ${insertedStudents.length} students`);

  return insertedStudents;
}