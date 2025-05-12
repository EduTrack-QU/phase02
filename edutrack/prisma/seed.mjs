import { PrismaClient } from './client/index.js';
import { faker } from '@faker-js/faker';
import { registerUser } from '../lib/auth.js';

const prisma = new PrismaClient();

// Configuration
const STUDENT_COUNT = 50;
const INSTRUCTOR_COUNT = 10;
const COURSE_COUNT = 10;
const SECTION_COUNT = 20;
async function main() {
  console.log('Starting database seeding...');

  try {
    // Create the admin user using registerUser
    // console.log('Creating admin user...');
    const adminResult = await registerUser({
      name: 'Mahmoud Barhamghi',
      email: 'edutrack@qu.edu.qa',
      password: 'admin123',
      role: 'ADMIN'
    });

    if (!adminResult.success) {
      throw new Error(`Failed to create admin: ${adminResult.message}`);
    }

    // console.log(`Admin created with ID: ${adminResult.user.id}`);

    // Update admin profile with additional details
    const admin = await prisma.admin.findUnique({
      where: { userId: adminResult.user.id }
    });

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        name: 'ansari',
        permissions: 'FULL_ACCESS',
        isActive: true
      }
    });

    // Create instructor users
    // console.log('Creating instructor users...');
    const instructors = [];
    for (let i = 0; i < INSTRUCTOR_COUNT; i++) {
      const fullName = faker.person.fullName();
      const email = faker.internet.email({ firstName: fullName.split(' ')[0], lastName: fullName.split(' ')[1] }).toLowerCase();

      const instructorResult = await registerUser({
        name: fullName,
        email: email,
        password: 'instructor123',
        role: 'INSTRUCTOR'
      });

      if (!instructorResult.success) {
        console.error(`Failed to create instructor: ${instructorResult.message}`);
        continue;
      }

      const instructor = await prisma.instructor.findUnique({
        where: { userId: instructorResult.user.id }
      });

      // Update the instructor with additional details
      const updatedInstructor = await prisma.instructor.update({
        where: { id: instructor.id },
        data: {
          speciality: faker.helpers.arrayElement([
            'Computer Science', 'Mathematics', 'Physics', 'Literature',
            'History', 'Biology', 'Chemistry', 'Philosophy'
          ]),
          isActive: true
        }
      });

      instructors.push(updatedInstructor);
    }

    // Create student users
    // console.log('Creating student users...');
    const students = [];
    for (let i = 0; i < STUDENT_COUNT; i++) {
      const fullName = faker.person.fullName();
      const email = faker.internet.email({ firstName: fullName.split(' ')[0], lastName: fullName.split(' ')[1] }).toLowerCase();

      const studentResult = await registerUser({
        name: fullName,
        email: email,
        password: 'student123',
        role: 'STUDENT'
      });

      if (!studentResult.success) {
        console.error(`Failed to create student: ${studentResult.message}`);
        continue;
      }

      const student = await prisma.student.findUnique({
        where: { userId: studentResult.user.id }
      });

      // Update the student with additional details
      const updatedStudent = await prisma.student.update({
        where: { id: student.id },
        data: {
          gpa: parseFloat(faker.number.float({ min: 2.0, max: 4.0, precision: 0.01 })),
          isActive: true
        }
      });

      students.push(updatedStudent);
    }

    // Create courses
    // console.log('Creating courses...');
    const departments = ['Mathematics', 'Computer Science', 'English', 'History', 'Science', 'Art', 'Music', 'Physics', 'Chemistry', 'Biology'];
    const levels = ['Undergraduate', 'Graduate'];
    const courses = [];

    for (let i = 0; i < COURSE_COUNT; i++) {
      const department = faker.helpers.arrayElement(departments);
      const level = faker.helpers.arrayElement(levels);
      const courseNumber = faker.number.int({ min: 100, max: 499 });
      const courseCode = `${department.substring(0, 3).toUpperCase()}${courseNumber}`;

      const course = await prisma.course.create({
        data: {
          name: `${department} ${courseNumber}`,
          courseCode: courseCode,
          description: faker.lorem.paragraph(),
          credits: faker.helpers.arrayElement([1, 2, 3, 4, 5]),
          department: department,
          level: level,
          isActive: true
        }
      });
      courses.push(course);
    }

    // Create sections
    // console.log('Creating sections...');
    const locations = ['Main Hall Room 101', 'Science Building 305', 'Library 201', 'Arts Center 405', 'Engineering Building 202'];
    const sectionStatus = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
    const terms = ['Fall 2025', 'Spring 2026', 'Summer 2026'];
    const sections = [];

    for (let i = 0; i < SECTION_COUNT; i++) {
      const term = faker.helpers.arrayElement(terms);

      // Set appropriate dates based on term
      let startDate, endDate;
      if (term === 'Fall 2025') {
        startDate = new Date('2025-08-15');
        endDate = new Date('2025-12-15');
      } else if (term === 'Spring 2026') {
        startDate = new Date('2026-01-15');
        endDate = new Date('2026-05-15');
      } else {
        startDate = new Date('2026-06-01');
        endDate = new Date('2026-08-01');
      }

      // Add some randomness to dates
      startDate.setDate(startDate.getDate() + faker.number.int({ min: 0, max: 5 }));
      endDate.setDate(endDate.getDate() + faker.number.int({ min: 0, max: 5 }));

      // Create schedule string
      const days = faker.helpers.arrayElement(['MWF', 'TTH', 'MW', 'TF']);
      const startHour = faker.number.int({ min: 8, max: 16 });
      const endHour = startHour + faker.helpers.arrayElement([1, 2]);
      const schedule = `${days} ${startHour}:00-${endHour}:00`;

      // Randomly select a course and instructor
      const randomCourse = faker.helpers.arrayElement(courses);
      const randomInstructor = faker.helpers.arrayElement(instructors);

      const section = await prisma.section.create({
        data: {
          sectionNumber: String(faker.number.int({ min: 1, max: 9 })).padStart(3, '0'),
          term: term,
          startDate: startDate,
          endDate: endDate,
          schedule: schedule,
          location: faker.helpers.arrayElement(locations),
          capacity: faker.number.int({ min: 20, max: 40 }),
          enrolledCount: 0,
          status: faker.helpers.arrayElement(sectionStatus),
          courseId: randomCourse.id,
          instructorId: randomInstructor.id
        }
      });
      sections.push(section);
    }

    // Create enrollments
    // console.log('Creating enrollments...');
    const gradeOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];
    const enrollmentStatus = ['ENROLLED', 'DROPPED', 'WAITLISTED'];

    for (const section of sections) {
      // Get a random number of students for this section
      const enrollmentCount = faker.number.int({ min: 5, max: 15 });
      const randomStudents = faker.helpers.arrayElements(students, enrollmentCount);

      for (const student of randomStudents) {
        try {
          const status = faker.helpers.arrayElement(enrollmentStatus);
          // Only assign grades for some enrolled students
          const grade = status === 'ENROLLED' && Math.random() > 0.3 ?
            faker.helpers.arrayElement(gradeOptions) : null;

          await prisma.enrollment.create({
            data: {
              status: status,
              grade: grade,
              studentId: student.id,
              sectionId: section.id
            }
          });
        } catch (error) {
          // Skip duplicate enrollments
          console.log(`Skipping duplicate enrollment for student ${student.id} in section ${section.id}`);
        }
      }

      // Update enrolled count for the section
      const actualEnrolled = await prisma.enrollment.count({
        where: {
          sectionId: section.id,
          status: 'ENROLLED'
        }
      });

      await prisma.section.update({
        where: { id: section.id },
        data: { enrolledCount: actualEnrolled }
      });
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  })