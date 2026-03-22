import { prisma } from '../db.js';
import {
  CHECK_ACTIVE_DAYS,
  CHECK_RETRY_DELAY_MS,
  CHECK_TICK_MS,
  FULL_SCAN_INTERVAL_MS,
} from '../config.js';
import { sendCertificateFoundStatusEmail } from '../email/send.js';
import type { UiLanguage } from '../i18n/languages.js';
import { logger } from '../services/logger.js';
import { telcCheckPaper, telcCheckDigital } from '../utils/telcCheck.js';
import { sendTelegramAlert } from '../services/alertService.js';

export async function checkCertificates(): Promise<void> {
  const now = new Date();

  // берём одну запись, которую пора обработать
  const record = await prisma.certificateCheck.findFirst({
    where: {
      status: 'ACTIVE',
      confirmedAt: { not: null },
      nextRunAt: { lte: now },
    },
    orderBy: [{ nextRunAt: 'asc' }, { id: 'asc' }],
  });
  if (!record || !record.activeUntil) return;

  // определим дату проверки экзамена
  const checkDate = addDaysUTC(record.examDate, record.cursorOffset);
  if (isAfterDayUTC(checkDate, now)) {
    await prisma.certificateCheck.update({
      where: { id: record.id },
      data: {
        cursorOffset: 0,
        lastCheckedAt: now,
        nextRunAt: new Date(now.getTime() + FULL_SCAN_INTERVAL_MS),
      },
    });
    return;
  }

  // выполнить проверку наличия цифрового сертификата
  const telcDigital = await telcCheckDigital({
    userNumber: record.userNumber,
    birthDate: record.birthDate,
    evalDate: checkDate,
  });
  // если что-то обноружено, то оповещение в телеграм
  if (telcDigital) {
    const digitalData = typeof telcDigital === 'string'
      ? telcDigital
      : JSON.stringify(telcDigital);
    const alert = `[cron/checkCertificates] Digital certificate possible found, userNumber=${record.userNumber}, birthDate=${record.birthDate}, checkDate=${checkDate}, email=${record.email}, data=${digitalData}`;
    await sendTelegramAlert({
      text: alert,
      disableNotification: false,
    });
  }

  // выполнить проверку наличия бумажного сертификата
  const telcPaper = await telcCheckPaper({
    userNumber: record.userNumber,
    birthDate: record.birthDate,
    evalDate: checkDate,
  });

  // если сертификат не найден из-за технических проблем (например, telc недоступен) -> выполним повторную проверку чуть позже
  if (telcPaper === null) {
    await prisma.certificateCheck.update({
      where: { id: record.id },
      data: {
        nextRunAt: new Date(now.getTime() + CHECK_RETRY_DELAY_MS),
      },
    });
    return;
  }

  // сертификат найден -> CERTIFICATE_FOUND + finishedAt + сохранение payload сертификата и оповещение пользователя
  if (telcPaper) {
    await prisma.certificateCheck.update({
      where: { id: record.id },
      data: {
        status: 'CERTIFICATE_FOUND',
        finishedAt: now,
        lastCheckedAt: now,
        certificatePayloadJson: telcPaper,
        nextRunAt: null,
      },
    });

    await notifyCertificateFound({
      email: record.email,
      publicToken: record.publicToken,
      language: record.language,
    });

      await sendTelegramAlert({
        text: `[cron/checkCertificates/notifyCertificateFound] Cretificate found for email=${record.email}`,
        disableNotification: true,
      });

    return;
  }

  // если проверили все дни и дата последней проверки (activeUntil) превышена, то CHECKING_EXPIRED
  if (record.cursorOffset >= CHECK_ACTIVE_DAYS && isAfterDayUTC(now, record.activeUntil)) {
    await prisma.certificateCheck.update({
      where: { id: record.id },
      data: {
        status: 'CHECKING_EXPIRED',
        cursorOffset: 0,
        finishedAt: now,
        lastCheckedAt: now,
        nextRunAt: null,
      },
    });
    return;
  }

  // если проверили все дни и дата последней проверки (activeUntil) еще не превышена, то назначаем новую проверку через четыре часа
  if (record.cursorOffset >= CHECK_ACTIVE_DAYS && !isAfterDayUTC(now, record.activeUntil)) {
    await prisma.certificateCheck.update({
      where: { id: record.id },
      data: {
        cursorOffset: 0,
        lastCheckedAt: now,
        nextRunAt: new Date(now.getTime() + FULL_SCAN_INTERVAL_MS),
      },
    });
    return;
  }

  // сертификат пока не найден, продолжим поиск через 5 секунд -> cursorOffset + 1, nextRunAt + 5s
  await prisma.certificateCheck.update({
    where: { id: record.id },
    data: {
      cursorOffset: record.cursorOffset + 1,
      nextRunAt: new Date(now.getTime() + CHECK_TICK_MS),
    },
  });
}

// Добавим дни к дате (используем без UTC).
function addDaysUTC(date: Date, days: number): Date {
  const d = toUtcDateOnly(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

// сравним две даты
function isAfterDayUTC(left: Date, right: Date): boolean {
  return toUtcDateOnly(left).getTime() > toUtcDateOnly(right).getTime();
}

// перевод даты в UTC
function toUtcDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

type NotifyCertificateFoundParams = {
  email: string;
  publicToken: string;
  language: UiLanguage;
};

/**
 * Отправляет письмо о найденном сертификате.
 * Ошибки доставки только логируются и не влияют на процесс проверки.
 */
async function notifyCertificateFound(params: NotifyCertificateFoundParams): Promise<void> {

  try {
    const publicBaseUrl = process.env.PUBLIC_BASE_URL;

    if (!publicBaseUrl) {
      logger.warn('[cron/checkCertificates/notifyCertificateFound] Config missing, variable=PUBLIC_BASE_URL');
      return;
    }

    const statusUrl = `${publicBaseUrl}/status/${params.publicToken}`;

    await sendCertificateFoundStatusEmail({
      to: params.email,
      statusUrl,
      language: params.language,
    });
  }
  catch(error) {
    logger.error(`[cron/checkCertificates/notifyCertificateFound] Request failed, error=${String(error)}`);
  }
}
