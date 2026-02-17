import 'dotenv/config';
import { app } from './app.js';
import http from 'http';
import { prisma } from './db.js';

let server: http.Server | undefined;

const appPort = Number(process.env.PORT ?? 3000);
const appEnv = process.env.NODE_ENV ?? 'development';

let ngrokUrl: string | undefined;
let ngrokInstance: typeof import('@ngrok/ngrok') | undefined;

async function main() {
  server = app.listen(appPort, () => {
    console.log(`[server] Server started on port ${appPort} in ${appEnv} mode`);
  });

  if (appEnv === 'development') {
    const { default: ngrok } = await import('@ngrok/ngrok');
    ngrokInstance = ngrok;

    const listener = await ngrok.forward({
      addr: appPort,
      authtoken_from_env: true,
    });

    const url = listener.url();
    if (!url) throw new Error('Ngrok failed to provide a URL');

    ngrokUrl = url;
    console.log(`[server] Ngrok URL: ${ngrokUrl}`);
  }
}

let shuttingDown = false;
async function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`[server] received ${signal}, shutting down...`);

  if (ngrokInstance) {
    try {
      await ngrokInstance.kill();
    } catch (error) {
      console.warn(`[server] ngrok shutdown failed: ${error}`);
    }
  }

  try {
    await prisma.$disconnect();
  } catch (error) {
    console.warn('[server] prisma disconnect failed:', error);
  }

  server?.close((error) => {
  if (error) {
    console.error('[server] error while closing server:', error);
    process.exit(1);
  }
  process.exit(0);
});
}

process.on('SIGINT', () => void shutdown('SIGINT'));
process.on('SIGTERM', () => void shutdown('SIGTERM'));

main().catch((error) => {
  console.error(`[server] failed to start: ${error}`);
  process.exit(1);
});
