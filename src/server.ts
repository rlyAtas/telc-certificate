import 'dotenv/config';
import { app } from './app.js';
import http from 'http';
import { prisma } from './db.js';
import cron from 'node-cron';
import { checkCertificates } from './cron/checkCertificates.js';
import { logger } from './services/logger.js';
import ngrok from '@ngrok/ngrok';

let server: http.Server | undefined;

const appPort = Number(process.env.PORT ?? 3000);
const appEnv = process.env.NODE_ENV ?? 'development';

let ngrokUrl: string | undefined;
let ngrokInstance: typeof import('@ngrok/ngrok') | undefined;

let cronTask: cron.ScheduledTask | undefined;
let cronRunning = false;

async function main() {
  server = app.listen(appPort, () => {
    logger.info(`[server] Server started on port ${appPort} in ${appEnv} mode`);
  });

  if (appEnv === 'development') {
    
    ngrokInstance = ngrok;

    const listener = await ngrok.forward({
      addr: appPort,
      authtoken_from_env: true,
    });

    const url = listener.url();
    if (!url) throw new Error('Ngrok failed to provide a URL');

    ngrokUrl = url;
    logger.info(`[server] Ngrok URL: ${ngrokUrl}`);
  }

  cronTask = cron.schedule('*/5 * * * * *', async () => {
    if (cronRunning) return;
    cronRunning = true;
    try {
      await checkCertificates();
    } catch (error) {
      logger.error(`[cron] error: ${error}`);
    } finally {
      cronRunning = false;
    }
  });

}

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info(`[server] received ${signal}, shutting down...`);

  try {
    cronTask?.stop();
  } catch (error) {
    logger.error(`[server] cron stop failed: ${error}`);
  }

  if (ngrokInstance) {
    try {
      await ngrokInstance.kill();
    } catch (error) {
      logger.error(`[server] ngrok shutdown failed: ${error}`);
    }
  }

  try {
    await prisma.$disconnect();
  } catch (error) {
    logger.error(`[server] prisma disconnect failed: ${error}`);
  }

  server?.close((error) => {
  if (error) {
    logger.error(`[server] error while closing server: ${error}`);

    process.exit(1);
  }
  process.exit(0);
});
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

main().catch((error) => {
  logger.error(`[server] error in main(): ${error}`);
  process.exit(1);
});
