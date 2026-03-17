import 'dotenv/config';
import { app } from './app.js';
import http from 'http';
import { APP_PORT, CHECK_TICK_CRON_EXPRESSION } from './config.js';
import { prisma } from './db.js';
import cron from 'node-cron';
import { checkCertificates } from './cron/checkCertificates.js';
import { logger } from './services/logger.js';
import ngrok from '@ngrok/ngrok';
import { sendTelegramAlert } from './services/alertService.js';


let server: http.Server | undefined;

const appPort = APP_PORT;
const appEnv = process.env.NODE_ENV ?? 'development';

let ngrokUrl: string | undefined;
let ngrokInstance: typeof import('@ngrok/ngrok') | undefined;

let cronTask: cron.ScheduledTask | undefined;
let cronRunning = false;

async function main() {
  server = app.listen(appPort, () => {
    logger.info(`[server] Server started on port ${appPort} in ${appEnv} mode`);
    sendTelegramAlert({
      text: `[server] Server started on port ${appPort} in ${appEnv} mode`,
      disableNotification: true,
    });
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
    logger.info(`[server/main] Ngrok started on url ${ngrokUrl}`);
  }

  cronTask = cron.schedule(CHECK_TICK_CRON_EXPRESSION, async () => {
    if (cronRunning) return;
    cronRunning = true;
    try {
      await checkCertificates();
    } catch (error) {
      logger.error(`[server/cronTick] Check certificates failed, error=${String(error)}`);
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
    logger.error(`[server] Cron stop failed, error=${String(error)}`);
  }

  if (ngrokInstance) {
    try {
      await ngrokInstance.kill();
    } catch (error) {
      logger.error(`[server] Ngrok kill failed, error=${String(error)}`);
    }
  }

  try {
    await prisma.$disconnect();
  } catch (error) {
    logger.error(`[server] Prisma disconnect failed, error=${String(error)}`);
  }

  server?.close((error) => {
  if (error) {
    logger.error(`[server] Server close failed, error=${String(error)}`);

    process.exit(1);
  }
  process.exit(0);
});
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

main().catch(async (error) => {
  try {
    logger.error(`[server] startup failed, error=${String(error)}`);
    await sendTelegramAlert({
      text: `[server] startup failed in ${appEnv} mode, error=${String(error)}`,
      disableNotification: false,
    });
  } 
  catch {}
  finally {
    process.exit(1);
  }
});
