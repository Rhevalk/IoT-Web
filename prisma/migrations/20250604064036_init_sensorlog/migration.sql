/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SensorLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "espId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
