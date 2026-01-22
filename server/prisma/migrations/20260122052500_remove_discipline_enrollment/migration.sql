/*
  Warnings:

  - You are about to drop the column `semester` on the `disciplines` table. All the data in the column will be lost.
  - You are about to drop the column `selectedSemester` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `discipline_enrollments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "discipline_enrollments" DROP CONSTRAINT "discipline_enrollments_disciplineId_fkey";

-- DropForeignKey
ALTER TABLE "discipline_enrollments" DROP CONSTRAINT "discipline_enrollments_userId_fkey";

-- AlterTable
ALTER TABLE "disciplines" DROP COLUMN "semester";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "selectedSemester";

-- DropTable
DROP TABLE "discipline_enrollments";
