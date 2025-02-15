import { db } from '@/server/db';
// import { seedEvents } from './events';
// import { seedHotels } from './hotels';
// import { eventHotels, events } from '@/server/db/schema/events';
// import { hotels, rooms } from '@/server/db/schema/hotels';

async function seedDatabase() {
  try {
    await clearData();
    // const hotelIds = await seedHotels();

    // await seedEvents(hotelIds);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

async function clearData() {
  console.log('🧹 Clearing existing data...');
  // await db.delete(eventHotels);
  // await db.delete(rooms);
  // await db.delete(hotels);
  // await db.delete(events);
}

seedDatabase();
