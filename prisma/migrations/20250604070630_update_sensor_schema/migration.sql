/*
  Warnings:

  - You are about to drop the `SensorData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SensorData";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SensorEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "suhu_air" INTEGER NOT NULL,
    "suhu_udara" INTEGER,
    "kelembapan_udara" INTEGER,
    "tds" INTEGER,
    "debit" INTEGER NOT NULL,
    "level_air" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
