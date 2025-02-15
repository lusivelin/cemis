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
      start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      end: new Date(),
    },
    attendanceRate = 90,
  } = config;

  const courseDays = new Map<string, number[]>();
  courseIds.forEach((courseId, index) => {
    courseDays.set(courseId, index % 2 === 0 ? [1, 3] : [2, 4]);
  });

  const dates: Date[] = [];
  let currentDate = new Date(dateRange.start);
  while (currentDate <= dateRange.end) {
    if (dates.length < 4) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  let totalInserted = 0;
  const BATCH_SIZE = 100;

  for (const courseId of courseIds) {
    const courseDaysList = courseDays.get(courseId) || [1, 3];
    
    const courseDates = dates.filter(date => 
      courseDaysList.includes(date.getDay())
    );

    for (const studentId of studentIds) {
      const attendanceRecords = [];

      for (const date of courseDates) {
        if (faker.number.int(100) < attendanceRate) {
          const rand = faker.number.int(100);
          let status;
          
          if (rand < 85) status = 'present';
          else if (rand < 90) status = 'late';
          else if (rand < 95) status = 'excused';
          else status = 'absent';

          attendanceRecords.push({
            studentId,
            courseId,
            date: date.toISOString().split('T')[0],
            status,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }

      if (attendanceRecords.length > 0) {
        const inserted = await db
          .insert(attendances)
          .values(attendanceRecords)
          .returning();
        
        totalInserted += inserted.length;
      }
    }
    
    console.log(`Inserted attendance records for course ${courseId}...`);
  }

  console.log(`✅ Seeded ${totalInserted} attendance records`);
  return totalInserted;
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