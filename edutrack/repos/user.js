import prisma from './prisma';


export async function authUser(email, password) {
    // Clean input data to avoid simple issues
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // pull in any related profiles so you can infer role
    const user = await prisma.user.findFirst({
      where: { 
        email: {
          equals: cleanEmail,
          mode: 'insensitive'  // Case insensitive comparison
        }
      },
      include: {
        admin: true,
        instructor: true,
        student: true,
      },
    });
  
    if (!user) {
      console.log(`No user found with email: ${cleanEmail}`);
      return null;
    }
  
    if (!user.password || user.password !== cleanPassword) {
      console.log(`Password mismatch for user: ${cleanEmail}`);
      return null;
    }

    let role = "USER";
    if (user.admin)       role = "ADMIN";
    else if (user.instructor) role = "INSTRUCTOR";
    else if (user.student)    role = "STUDENT";
  
    return {
      id:    user.id,
      name:  user.name,
      email: user.email,
      image: user.image,
      role,
    };
  }