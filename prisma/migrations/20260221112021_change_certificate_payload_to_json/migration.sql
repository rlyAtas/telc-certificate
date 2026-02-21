/*
  Warnings:

  - You are about to alter the column `certificatePayloadJson` on the `CertificateCheck` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CertificateCheck" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "emailLower" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" DATETIME,
    "userNumber" TEXT NOT NULL,
    "examDate" DATETIME NOT NULL,
    "birthDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "confirmToken" TEXT,
    "confirmTokenExpiresAt" DATETIME,
    "confirmedAt" DATETIME,
    "publicToken" TEXT NOT NULL,
    "certificatePayloadJson" JSONB,
    "lastCheckedAt" DATETIME,
    "nextRunAt" DATETIME,
    "cursorOffset" INTEGER NOT NULL DEFAULT 0,
    "activeUntil" DATETIME
);
INSERT INTO "new_CertificateCheck" ("activeUntil", "birthDate", "certificatePayloadJson", "confirmToken", "confirmTokenExpiresAt", "confirmedAt", "createdAt", "cursorOffset", "email", "emailLower", "examDate", "finishedAt", "id", "lastCheckedAt", "nextRunAt", "publicToken", "status", "userNumber") SELECT "activeUntil", "birthDate", "certificatePayloadJson", "confirmToken", "confirmTokenExpiresAt", "confirmedAt", "createdAt", "cursorOffset", "email", "emailLower", "examDate", "finishedAt", "id", "lastCheckedAt", "nextRunAt", "publicToken", "status", "userNumber" FROM "CertificateCheck";
DROP TABLE "CertificateCheck";
ALTER TABLE "new_CertificateCheck" RENAME TO "CertificateCheck";
CREATE UNIQUE INDEX "CertificateCheck_confirmToken_key" ON "CertificateCheck"("confirmToken");
CREATE UNIQUE INDEX "CertificateCheck_publicToken_key" ON "CertificateCheck"("publicToken");
CREATE INDEX "CertificateCheck_status_nextRunAt_idx" ON "CertificateCheck"("status", "nextRunAt");
CREATE INDEX "CertificateCheck_emailLower_idx" ON "CertificateCheck"("emailLower");
CREATE UNIQUE INDEX "CertificateCheck_emailLower_userNumber_examDate_birthDate_key" ON "CertificateCheck"("emailLower", "userNumber", "examDate", "birthDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
