-- CreateTable
CREATE TABLE "CertificateCheck" (
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
    "nextRunAt" DATETIME,
    "cursorOffset" INTEGER NOT NULL DEFAULT 0,
    "activeUntil" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "CertificateCheck_confirmToken_key" ON "CertificateCheck"("confirmToken");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateCheck_publicToken_key" ON "CertificateCheck"("publicToken");

-- CreateIndex
CREATE INDEX "CertificateCheck_status_nextRunAt_idx" ON "CertificateCheck"("status", "nextRunAt");

-- CreateIndex
CREATE INDEX "CertificateCheck_emailLower_idx" ON "CertificateCheck"("emailLower");

-- CreateIndex
CREATE UNIQUE INDEX "CertificateCheck_emailLower_userNumber_examDate_birthDate_key" ON "CertificateCheck"("emailLower", "userNumber", "examDate", "birthDate");
