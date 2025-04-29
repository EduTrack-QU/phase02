import { PrismaClient } from '../prisma/client/index.js';
import { faker } from '@faker-js/faker';
// import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Configuration
const STUDENT_COUNT = 500;
const INSTRUCTOR_COUNT = 100;
const COURSE_COUNT = 50;
const CLASS_COUNT = 150;
const ADMIN_COUNT = 5;

// Helper functions
// const hashPassword = async (password) => {
//   const saltRounds = 10;
//   return await bcrypt.hash(password, saltRounds);
// };

async function main() {
  console.log('Starting seeding...');
  
  // Create Admins
  console.log('Creating admins...');
  const adminPromises = [];
  for (let i = 0; i < ADMIN_COUNT; i++) {
    adminPromises.push(
      prisma.admin.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
        //   password: await hashPassword('password123')
            password: 'password123'
        }
      })
    );
  }
  await Promise.all(adminPromises);
  
  // Create Instructors
  console.log('Creating instructors...');
  const instructors = [];
  for (let i = 0; i < INSTRUCTOR_COUNT; i++) {
    const instructor = await prisma.instructor.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        // password: await hashPassword('password123')
        password: 'password123'

      }
    });
    instructors.push(instructor);
  }

  // Create Students
  console.log('Creating students...');
  const students = [];
  for (let i = 0; i < STUDENT_COUNT; i++) {
    const student = await prisma.student.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        // password: await hashPassword('password123'),
        password: 'password123',
        gpa: parseFloat(faker.number.float({ min: 2.0, max: 4.0, precision: 0.01 }))
      }
    });
    students.push(student);
  }

  // Course subjects and grade levels for more realistic data
  const subjects = ['Mathematics', 'Computer Science', 'English', 'History', 'Science', 'Art', 'Music', 'Physics', 'Chemistry', 'Biology'];
  const gradeLevels = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'];

  // Create Courses
  console.log('Creating courses...');
  const courses = [];
  for (let i = 0; i < COURSE_COUNT; i++) {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const level = Math.floor(Math.random() * 400) + 100; // Course levels like 101, 204, etc
    const course = await prisma.course.create({
      data: {
        name: `${subject} ${level}`,
        description: faker.lorem.paragraph(),
        grade: gradeLevels[Math.floor(Math.random() * gradeLevels.length)],
        students: {
          connect: faker.helpers.arrayElements(students, { min: 5, max: 30 }).map(student => ({ id: student.id }))
        }
      },
      include: {
        students: true  // Add this line to include the students relationship
      }
    });
    courses.push(course);
  }

  // Locations for classes
  const locations = ['Main Hall Room 101', 'Science Building 305', 'Library 201', 'Arts Center 405', 'Engineering Building 202'];
  const classStatus = ['Scheduled', 'In Progress', 'Completed', 'Canceled'];

  // Create Classes
  console.log('Creating classes...');
  for (let i = 0; i < CLASS_COUNT; i++) {
    // Create a start time between 8am and 5pm
    const startHour = faker.number.int({ min: 8, max: 17 });
    const startDate = faker.date.future();
    startDate.setHours(startHour, 0, 0, 0);
    
    // End time is 1-3 hours after start time
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + faker.number.int({ min: 1, max: 3 }));
    
    // Randomly select a course and instructor
    const randomCourse = courses[Math.floor(Math.random() * courses.length)];
    const randomInstructor = instructors[Math.floor(Math.random() * instructors.length)];
    
    // Create a subset of students for this class
    const classStudents = faker.helpers.arrayElements(
      students.filter(student => {
        // Find students in the course
        return randomCourse.students.some(s => s.id === student.id);
      }),
      { min: 5, max: 25 }
    );

    await prisma.class.create({
      data: {
        name: `${randomCourse.name} - Section ${String.fromCharCode(65 + i % 26)}`,
        courseId: randomCourse.id,
        instructorId: randomInstructor.id,
        startTime: startDate,
        endTime: endDate,
        location: locations[Math.floor(Math.random() * locations.length)],
        status: classStatus[Math.floor(Math.random() * classStatus.length)],
        students: {
          connect: classStudents.map(student => ({ id: student.id }))
        }
      }
    });
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });