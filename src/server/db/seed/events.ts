// import { faker } from '@faker-js/faker';
// import { db } from '@/server/db/index';
// import { events, eventHotels } from '@/server/db/schema/events';
// import { eventTypeEnum, statusEnum } from '../schema/enums';

// export async function seedEvents(hotelIds: string[]) {
//   console.log('🎪 Seeding events...');

//   // Use proper enum values
//   const eventTypes: (typeof eventTypeEnum.enumValues)[number][] = ['Camp', 'Event', 'Trip'];
//   const statuses: (typeof statusEnum.enumValues)[number][] = [
//     'Active',
//     'Upcoming',
//     'Completed',
//     'Pending',
//     'Cancelled',
//   ];

//   for (let i = 0; i < 30; i++) {
//     const startDate = faker.date.future();
//     const endDate = new Date(startDate);
//     endDate.setDate(startDate.getDate() + faker.number.int({ min: 1, max: 7 }));
//     const numberOfDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

//     const eventType = faker.helpers.arrayElement(eventTypes);
//     let eventName: string;

//     // Generate contextual names based on event type
//     switch (eventType) {
//       case 'Camp':
//         eventName = `${faker.word.adjective()} Summer Camp ${new Date().getFullYear()}`;
//         break;
//       case 'Trip':
//         eventName = `${faker.location.country()} Adventure Trip`;
//         break;
//       default:
//         eventName = `${faker.company.name()} ${eventType}`;
//     }

//     const [event] = await db
//       .insert(events)
//       .values({
//         name: eventName,
//         type: eventType,
//         startDate,
//         endDate,
//         numberOfDays,
//         venue: faker.company.name() + ' Venue',
//         city: faker.location.city(),
//         country: faker.location.country(),
//         bussing: faker.helpers.arrayElement(['Yes', 'No', null]),
//         transport: faker.helpers.arrayElement(['Bus', 'Train', 'Plane', null]),
//         numberOfParticipants: faker.number.int({ min: 50, max: 500 }),
//         coverImages: Array(faker.number.int({ min: 1, max: 4 }))
//           .fill(null)
//           .map(() => faker.image.url()),
//         bookingOrderFooter: faker.lorem.paragraph(),
//         prefixCode: faker.string.alpha({ length: 3, casing: 'upper' }),
//         status: faker.helpers.arrayElement(statuses),
//         emails: Array(faker.number.int({ min: 1, max: 5 }))
//           .fill(null)
//           .map(() => faker.internet.email()),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//       .returning();

//     await seedEventHotels(event.id, hotelIds);
//   }
// }

// async function seedEventHotels(eventId: string, hotelIds: string[]) {
//   const numHotels = faker.number.int({ min: 1, max: 3 });
//   const selectedHotels = faker.helpers.arrayElements(hotelIds, numHotels);

//   for (const hotelId of selectedHotels) {
//     await db.insert(eventHotels).values({
//       eventId,
//       hotelId,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//   }
// }
