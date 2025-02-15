import { faker } from '@faker-js/faker';
import { db } from '@/server/db/index';
import { attendances } from '@/server/db/schema/attendances';

interface SeedAttendancesConfig {
  studentIds: string[];
  courseIds: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  attendanceRate?: number;
}

export async function seedAttendances(config: SeedAttendancesConfig) {
  console.log('📅 Seeding attendances...');

  if (!config.studentIds?.length || !config.courseIds?.length) {
    throw new Error('Student IDs and Course IDs are required to seed attendances');
  }

  const {
    studentIds,
    courseIds,
    dateRange = {
      start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
      end: new Date(),
    },
    attendanceRate = 90,
  } = config;

  const attendanceStatuses = ['present', 'absent', 'late', 'excused'];

  const attendanceRecords = [];

  // Generate dates within the range
  const dates: Date[] = [];
  let currentDate = new Date(dateRange.start);
  while (currentDate <= dateRange.end) {
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      // Exclude weekends
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  for (const courseId of courseIds) {
    for (const studentId of studentIds) {
      for (const date of dates) {
        // Determine if we should create an attendance record based on attendance rate
        if (faker.number.int(100) < attendanceRate) {
          // Weight the status probabilities
          let status;
          const rand = faker.number.int(100);
          if (rand < 85) {
            status = 'present';
          } else if (rand < 90) {
            status = 'late';
          } else if (rand < 95) {
            status = 'excused';
          } else {
            status = 'absent';
          }

          attendanceRecords.push({
            studentId,
            courseId,
            date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
            status,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }
  }

  // Sort by date
  attendanceRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const insertedAttendances = await db.insert(attendances).values(attendanceRecords).returning();

  console.log(`✅ Seeded ${insertedAttendances.length} attendance records`);

  return insertedAttendances;
}

export async function seedTermAttendances(
  studentIds: string[],
  courseIds: string[],
  termConfig: {
    startDate: Date;
    endDate: Date;
    attendanceRate?: number;
  }
) {
  return seedAttendances({
    studentIds,
    courseIds,
    dateRange: {
      start: termConfig.startDate,
      end: termConfig.endDate,
    },
    attendanceRate: termConfig.attendanceRate,
  });
}
