import { prisma } from '../db.js';
import { telcCheck } from '../utils/telcCheck.js';

const MAX_WINDOW_DAYS = 28;           // 0..27
const NEXT_TICK_MS = 5_000;           // 5 seconds
const AFTER_FULL_SCAN_MS = 4 * 60 * 60 * 1000; // 4 hours

type TelcCheckParams = {
  userNumber: string;
  birthDate: Date;
  examDate: Date;
  evalDate: Date; // examDate + cursorOffset
};

export async function checkCertificates(): Promise<void> {
  const now = new Date();

  // 1) берём одну запись, которую пора обработать
  const record = await prisma.certificateCheck.findFirst({
    where: {
      status: 'ACTIVE',
      confirmedAt: { not: null },
      nextRunAt: { lte: now },
    },
    orderBy: [{ nextRunAt: 'asc' }, { id: 'asc' }],
  });

  if (!record) return;

  // 2) если activeUntil меньше текущей даты -> CHECKING_EXPIRED
  if (record.activeUntil && record.activeUntil < now) {
    await prisma.certificateCheck.update({
      where: { id: record.id },
      data: {
        status: 'CHECKING_EXPIRED',
        finishedAt: now,
        nextRunAt: null,
      },
    });
    return;
  }

  // 3) если cursorOffset >= 28 -> nextRunAt + 4h, cursorOffset = 0
  // 4) если examDate + cursorOffset > today -> анаологично, откладываем на 4 часа и обнуляем курсор (на всякий случай, если что-то пошло не так с датами)
  const checkDate = addDaysUTC(record.examDate, record.cursorOffset);
  if (record.cursorOffset >= MAX_WINDOW_DAYS || isAfterTodayUTC(checkDate, now)) {
    await prisma.certificateCheck.update({
      where: { id: record.id },
      data: {
        cursorOffset: 0,
        nextRunAt: new Date(now.getTime() + AFTER_FULL_SCAN_MS),
        lastCheckedAt: now,
      },
    });
    return;
  }

  // 5) проверяем наличие сертификата на дату examDate + cursorOffset
  const telc = await telcCheck({
    userNumber: record.userNumber,
    birthDate: record.birthDate,
    examDate: record.examDate,
    evalDate: checkDate,
  });

  // если сертификат не найден из-за технических проблем (например, telc недоступен) -> nextRunAt + 10s
  if (telc === null) {
    await prisma.certificateCheck.update({
      where: { id: record.id },
      data: {
        nextRunAt: new Date(now.getTime() + 2 * NEXT_TICK_MS),
      },
    });
    return;
  }

  // 6) если найден -> CERTIFICATE_FOUND + finishedAt
  if (telc === true) {
    await prisma.certificateCheck.update({
      where: { id: record.id },
      data: {
        status: 'CERTIFICATE_FOUND',
        finishedAt: now,
        lastCheckedAt: now,
        nextRunAt: null,
      },
    });
    return;
  }

  // 7) не найден -> cursorOffset + 1, nextRunAt + 5s
  await prisma.certificateCheck.update({
    where: { id: record.id },
    data: {
      cursorOffset: record.cursorOffset + 1,
      nextRunAt: new Date(now.getTime() + NEXT_TICK_MS),
    },
  });
}

/* ----------------- helpers ----------------- */

/**
 * Стабильное прибавление дней в UTC (без сюрпризов из-за DST).
 */
function addDaysUTC(date: Date, days: number): Date {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

/**
 * true, если date лежит "после сегодняшнего дня" (сравнение по дню в UTC).
 * То есть: date > today (не время, а именно день).
 */
function isAfterTodayUTC(date: Date, now: Date): boolean {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const d0 = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  return d0.getTime() > today.getTime();
}
