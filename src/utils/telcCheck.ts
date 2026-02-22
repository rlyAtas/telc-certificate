import { logger } from '../services/logger.js';
import type { Prisma } from '../generated/prisma/client.js';

export type TelcCheckParams = {
  userNumber: string; // Teilnehmernummer
  birthDate: Date;    // Geburtsdatum
  examDate: Date;     // Prüfungsdatum (в твоей терминологии)
  evalDate: Date;     // дата проверки/выдачи (pruefung в URL из твоего примера)
  type?: 'paper' | 'digital';
};

export type TelcSuccessResponse = {
  examId: string;
  attendeeId: string;
  examinationInstituteId: string;
  isVirtualBadge?: boolean;
  virtualBadgeCredential?: string;
} & Prisma.InputJsonObject;

/**
 * TelcSuccessResponse -> найден сертификат
 * false -> не найден (certificate not found)
 * null  -> ошибка (сеть/5xx/неожиданный ответ)
 * пример правильного запроса: https://results.telc.net/api/results/loopkup/12345678/pruefung/2024-06-01/birthdate/1990-01-01?type=paper
 * пример ответа при найденном сертификате: {""examinationInstituteId": "69e...", "examId": "abc123...", "attendeeId": "def456", ... }
 * пример ответа при не найденном сертификате: 404 Not Found или { "code": 404, "message": "certificate not found" }
 */
export async function telcCheck(params: TelcCheckParams): Promise<TelcSuccessResponse | false | null> {
  logger.debug(`[cron/telcCheck/telcCheck] params=${JSON.stringify(params)}`);

  const type = params.type ?? 'paper';

  // telc ожидает YYYY-MM-DD
  const birthdate = toYmd(params.birthDate);
  const pruefung = toYmd(params.evalDate);

  // в будущем воможно делать два запроса, на бумажный и цифровой сертификат
  const url =
    `https://results.telc.net/api/results/loopkup/${encodeURIComponent(params.userNumber)}` +
    `/pruefung/${encodeURIComponent(pruefung)}` +
    `/birthdate/${encodeURIComponent(birthdate)}` +
    `?type=${encodeURIComponent(type)}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      signal: AbortSignal.timeout(5_000),
    });

    const data: unknown = await res.json();

    if (isTelcSuccessResponse(data)) return data;

    return false;
  } catch (error) {
    // сеть / таймаут / JSON parse error
    logger.error(`[cron/telcCheck/telcCheck] ${error}`);
    return null;
  }
}

function toYmd(d: Date): string {
  // Важно: берём календарную дату (UTC), чтобы не получить смещение из-за timezone/DST
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isTelcSuccessResponse(data: unknown): data is TelcSuccessResponse {
  if (typeof data !== 'object' || data === null) return false;

  const obj = data as Record<string, unknown>;

  return (
    typeof obj.examId === 'string' &&
    typeof obj.attendeeId === 'string'
  );
}
