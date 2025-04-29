/*
  Warnings:

  - You are about to drop the `_ClassToStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CourseToStudent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `createdAt` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Class` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_ClassToStudent_B_index";

-- DropIndex
DROP INDEX "_ClassToStudent_AB_unique";

-- DropIndex
DROP INDEX "_CourseToStudent_B_index";

-- DropIndex
DROP INDEX "_CourseToStudent_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ClassToStudent";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CourseToStudent";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_StudentCourses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_StudentCourses_A_fkey" FOREIGN KEY ("A") REFERENCES "Course" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StudentCourses_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_StudentClasses" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_StudentClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "Class" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_StudentClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Class" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "courseId" INTEGER NOT NULL,
    "instructorId" INTEGER NOT NULL,
    CONSTRAINT "Class_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Class_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Class" ("courseId", "endTime", "id", "instructorId", "location", "name", "startTime", "status") SELECT "courseId", "endTime", "id", "instructorId", "location", "name", "startTime", "status" FROM "Class";
DROP TABLE "Class";
ALTER TABLE "new_Class" RENAME TO "Class";
CREATE INDEX "Class_courseId_idx" ON "Class"("courseId");
CREATE INDEX "Class_instructorId_idx" ON "Class"("instructorId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_StudentCourses_AB_unique" ON "_StudentCourses"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentCourses_B_index" ON "_StudentCourses"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentClasses_AB_unique" ON "_StudentClasses"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentClasses_B_index" ON "_StudentClasses"("B");
