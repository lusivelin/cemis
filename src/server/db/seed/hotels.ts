// import { faker } from '@faker-js/faker';
// import { db } from '@/server/db/index';
// import { hotels, rooms } from '@/server/db/schema/hotels';

// export async function seedHotels() {
//   console.log('🏨 Seeding hotels and rooms...');
//   const hotelIds: string[] = [];

//   for (let i = 0; i < 30; i++) {
//     const [hotel] = await db
//       .insert(hotels)
//       .values({
//         name: faker.company.name() + ' Hotel',
//         address: faker.location.streetAddress(),
//         city: faker.location.city(),
//         country: faker.location.country(),
//         active: true,

//         // Age ranges
//         adultAgeRange: [18, 65],
//         childWithoutBedAgeRange: [2, 11],
//         childWithBedAgeRange: [2, 11],
//         infantAgeRange: [0, 1],

//         // Configuration
//         currencyCode: faker.finance.currencyCode(),
//         assigned: faker.datatype.boolean(),

//         // Maximum occupancy limits
//         maxAdultExtraBed: faker.number.int({ min: 0, max: 2 }),
//         maxAdult: faker.number.int({ min: 2, max: 4 }),
//         maxInfant: faker.number.int({ min: 1, max: 2 }),
//         maxChildWithoutBed: faker.number.int({ min: 1, max: 2 }),
//         maxChildWithBed: faker.number.int({ min: 1, max: 2 }),

//         createdAt: new Date(),
//         updatedAt: new Date(),
//       })
//       .returning();

//     hotelIds.push(hotel.id);
//     await seedRoomsForHotel(hotel.id);
//   }

//   return hotelIds;
// }

// function generatePricingDates() {
//   const now = new Date();
//   const preLaunchStart = faker.date.future({ years: 0.5, refDate: now });
//   const preLaunchEnd = faker.date.future({ years: 0.5, refDate: preLaunchStart });
//   const normalStart = faker.date.future({ years: 0.5, refDate: preLaunchEnd });
//   const normalEnd = faker.date.future({ years: 0.5, refDate: normalStart });

//   return {
//     preLaunchStartDate: preLaunchStart,
//     preLaunchEndDate: preLaunchEnd,
//     normalStartDate: normalStart,
//     normalEndDate: normalEnd,
//   };
// }

// function generatePricingSet(basePrice: number) {
//   const dates = generatePricingDates();

//   return {
//     buyingPrice: (basePrice * 0.7).toFixed(2),
//     costPrice: (basePrice * 0.8).toFixed(2),
//     normalOnlinePrice: basePrice.toFixed(2),
//     preLaunchRate: (basePrice * 0.9).toFixed(2),
//     ...dates,
//   };
// }

// async function seedRoomsForHotel(hotelId: string) {
//   const numberOfRooms = faker.number.int({ min: 5, max: 10 });

//   for (let i = 0; i < numberOfRooms; i++) {
//     const basePrice = faker.number.float({ min: 100, max: 1000 });
//     const adultPricing = generatePricingSet(basePrice);
//     const childWithBedPricing = generatePricingSet(basePrice * 0.7);
//     const childWithoutBedPricing = generatePricingSet(basePrice * 0.5);
//     const infantPricing = generatePricingSet(basePrice * 0.3);

//     await db.insert(rooms).values({
//       hotelId,
//       name: `Room ${i + 1}`,
//       description: faker.lorem.paragraph(),
//       photo: faker.image.url(),
//       sleeps: faker.number.int({ min: 1, max: 4 }),
//       sleepDescription: faker.lorem.sentence(),
//       inventory: faker.number.int({ min: 5, max: 20 }),

//       // Configuration
//       bedConfiguration: faker.helpers.arrayElement(['1 King', '2 Queen', '1 Queen', '2 Single']),
//       displayOrder: i + 1,
//       addOn: faker.lorem.sentence(),
//       extraBedAllowed: faker.datatype.boolean(),
//       isTwinNoRoommate: faker.datatype.boolean(),
//       openForOnlineRegistration: faker.datatype.boolean(),
//       specialArrangement: faker.datatype.boolean(),

//       // Occupancy limits
//       occupantLimits: {
//         adult: {
//           min: faker.number.int({ min: 1, max: 2 }),
//           max: faker.number.int({ min: 2, max: 4 }),
//         },
//         childWithBed: {
//           min: faker.number.int({ min: 0, max: 1 }),
//           max: faker.number.int({ min: 1, max: 2 }),
//         },
//         childWithoutBed: {
//           min: faker.number.int({ min: 0, max: 1 }),
//           max: faker.number.int({ min: 1, max: 2 }),
//         },
//         infant: {
//           min: faker.number.int({ min: 0, max: 1 }),
//           max: faker.number.int({ min: 1, max: 2 }),
//         },
//         extraBed: {
//           max: faker.number.int({ min: 0, max: 2 }),
//         },
//         paxPerRoom: faker.number.int({ min: 1, max: 2 }),
//       },

//       // RTB configuration
//       minCoupleRTB: faker.number.int({ min: 1, max: 3 }),
//       minFamilyRTB: faker.number.int({ min: 1, max: 5 }),

//       pricing: {
//         adult: adultPricing,
//         childWithBed: childWithBedPricing,
//         childWithoutBed: childWithoutBedPricing,
//         infant: infantPricing,
//       },

//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });
//   }
// }
