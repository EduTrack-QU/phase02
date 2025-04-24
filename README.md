# phase02

# Student & Course Management App

A Next.js + React application for managing students, instructors, courses and classes, with a real relational database backend (via Prisma).

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Getting Started](#getting-started)  
   1. [Prerequisites](#prerequisites)  
   2. [Installation](#installation)  
   3. [Environment Variables](#environment-variables)  
4. [Data Modeling](#data-modeling)  
   1. [Conceptual Model](#conceptual-model)  
   2. [Prisma Schema](#prisma-schema)  
5. [Database Initialization & Seeding](#database-initialization--seeding)  
   1. [Seed Script (`seed.js`)](#seed-script-seedjs)  
6. [Data Repository](#data-repository)  
   - CRUD functions for Students, Courses, Instructors, Classes, …  
   - Examples:  
     - `getStudentsByCourse(courseId)`  
     - `createInstructor(data)`  
     - `countStudentsByYear(year)`  
7. [API & Server Actions](#api--server-actions)  
   1. [Server Actions (Next.js)](#server-actions-nextjs)  
   2. [REST / Web APIs](#rest--web-apis)  
   3. [Usage Examples](#usage-examples)  
8. [Statistics Dashboard](#statistics-dashboard)  
   - Total students per year / course category / individual course  
   - Top 3 most-taken courses  
   - Failure rate per course and per category  
   - …your custom metrics!  
9. [Running the App](#running-the-app)  
   1. [Development](#development)  
   2. [Production](#production)  
10. [Contributing](#contributing)  
11. [License](#license)  

---

## Features

- Full CRUD for Students, Courses, Instructors, Classes  
- Efficient filtering, sorting & aggregation at the database level  
- Next.js Server Actions & REST APIs  
- React-based stats dashboard  

## Tech Stack

- **Frontend:** Next.js, React  
- **Backend:** Node.js, Next.js Server Actions  
- **ORM:** Prisma  
- **Database:** PostgreSQL (or SQLite / Oracle / …)  
- **Language:** JavaScript  

