/*
  Warnings:

  - You are about to drop the column `level_air` on the `SensorEntry` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SensorEntry" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "file" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "status" INTEGER NOT NULL,
    "suhu_air" INTEGER NOT NULL,
    "suhu_udara" INTEGER,
    "kelembapan_udara" INTEGER,
    "tds" INTEGER,
    "debit" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_SensorEntry" ("createdAt", "debit", "file", "id", "kelembapan_udara", "status", "suhu_air", "suhu_udara", "tds", "tipe") SELECT "createdAt", "debit", "file", "id", "kelembapan_udara", "status", "suhu_air", "suhu_udara", "tds", "tipe" FROM "SensorEntry";
DROP TABLE "SensorEntry";
ALTER TABLE "new_SensorEntry" RENAME TO "SensorEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
