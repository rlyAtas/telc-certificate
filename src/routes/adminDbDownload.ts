import { timingSafeEqual } from 'node:crypto';
import { Router } from 'express';
import {
  createDatabaseSnapshot,
  removeDatabaseSnapshot,
} from '../services/dbBackupService.js';
import { logger } from '../services/logger.js';

export const routerAdminDbDownload = Router();

const RATE_LIMIT_MS = 5 * 60 * 1000;
let nextAllowedDownloadAt = 0;

/**
 * GET /admin/db/download
 * Закрытый эндпоинт для выгрузки snapshot базы данных.
 */
routerAdminDbDownload.get('/download', async (req, res) => {
  const adminToken = process.env.ADMIN_EXPORT_TOKEN;
  if (!adminToken) {
    logger.error('[routes/adminDbDownload] ADMIN_EXPORT_TOKEN is missing');
    return res.status(503).json({ error: 'Service unavailable' });
  }

  const providedToken = req.header('X-Admin-Token') ?? '';
  if (!isAuthorizedToken(providedToken, adminToken)) {
    logger.warn('[routes/adminDbDownload] Forbidden: invalid admin token');
    return res.status(403).json({ error: 'Forbidden' });
  }

  const nowMs = Date.now();
  if (nowMs < nextAllowedDownloadAt) {
    logger.warn('[routes/adminDbDownload] Too many requests');
    return res.status(429).json({ error: 'Too many requests' });
  }
  nextAllowedDownloadAt = nowMs + RATE_LIMIT_MS;

  try {
    const { snapshotPath, downloadName } = await createDatabaseSnapshot();
    logger.info(`[routes/adminDbDownload] Snapshot created: ${downloadName}`);

    let cleanedUp = false;
    const cleanup = async () => {
      if (cleanedUp) return;
      cleanedUp = true;
      try {
        await removeDatabaseSnapshot(snapshotPath);
      } catch (error: unknown) {
        logger.error(`[routes/adminDbDownload] Snapshot cleanup failed: ${String(error)}`);
      }
    };

    res.on('close', () => {
      void cleanup();
    });
    res.on('error', () => {
      void cleanup();
    });

    res.download(snapshotPath, downloadName, (error) => {
      void cleanup();
      if (error) {
        logger.error(`[routes/adminDbDownload] Download failed: ${String(error)}`);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Download failed' });
        }
        return;
      }

      logger.info('[routes/adminDbDownload] Snapshot downloaded successfully');
    });
  } catch (error: unknown) {
    logger.error(`[routes/adminDbDownload] Snapshot creation failed: ${String(error)}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

function isAuthorizedToken(providedToken: string, expectedToken: string): boolean {
  const provided = Buffer.from(providedToken, 'utf8');
  const expected = Buffer.from(expectedToken, 'utf8');

  if (provided.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(provided, expected);
}
