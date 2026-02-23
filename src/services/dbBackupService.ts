import { randomUUID } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { prisma } from '../db.js';

type DatabaseSnapshot = {
  snapshotPath: string;
  downloadName: string;
};

/**
 * Создает консистентный snapshot текущей SQLite-базы во временный файл.
 */
export async function createDatabaseSnapshot(): Promise<DatabaseSnapshot> {
  const timestamp = createUtcTimestamp();
  const fileName = `certificate-backup-${timestamp}-${randomUUID()}.db`;
  const snapshotPath = path.join(tmpdir(), fileName);

  // Экранируем путь для SQLite string literal в выражении VACUUM INTO.
  const escapedPath = snapshotPath.replaceAll("'", "''");
  await prisma.$executeRawUnsafe(`VACUUM INTO '${escapedPath}'`);

  return {
    snapshotPath,
    downloadName: fileName,
  };
}

/**
 * Удаляет временный snapshot; отсутствие файла не считается ошибкой.
 */
export async function removeDatabaseSnapshot(snapshotPath: string): Promise<void> {
  try {
    await unlink(snapshotPath);
  } catch (error: unknown) {
    // ENOENT: файл уже удален/не существовал.
    if (isNodeErrorWithCode(error, 'ENOENT')) {
      return;
    }
    throw error;
  }
}

function createUtcTimestamp(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const hour = String(now.getUTCHours()).padStart(2, '0');
  const minute = String(now.getUTCMinutes()).padStart(2, '0');
  const second = String(now.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}-${hour}${minute}${second}`;
}

function isNodeErrorWithCode(error: unknown, code: string): error is NodeJS.ErrnoException {
  return typeof error === 'object' && error !== null && (error as NodeJS.ErrnoException).code === code;
}
