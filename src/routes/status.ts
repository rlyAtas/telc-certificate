import { Router } from 'express';
import { CertificateCheckService } from '../services/certificateCheckService.js';
import { getMessages } from '../i18n/messages.js';
import { type UiLanguage } from '../i18n/languages.js';

export const routerStatus = Router();
const TELC_CERTIFICATE_BASE_URL = 'https://results.telc.net/certificate';

/**
 * GET /status/:publicToken
 */
routerStatus.get('/:publicToken', async (req, res) => {
  const fallbackMessages = getMessages('de');
  
  try {
    const publicToken = String(req.params.publicToken);

    const record = await CertificateCheckService.getByPublicToken(publicToken);
    if (!record) {
      return res.status(404).render('hint', {
        message: fallbackMessages.routes.statusInvalidOrExpired,
        messages: fallbackMessages,
      });
    }

    const language: UiLanguage = record.language;
    const messages = getMessages(language);
    const certificateUrl = buildCertificateUrl(record.status, record.certificatePayloadJson);

    return res.render('status', {
      status: record.status,
      certificateUrl,
      language,
      messages,
      userNumber: record.userNumber,
      examDateText: formatDateByLanguage(record.examDate, language),
    });
  } catch (error) {
    console.error('[routes/status] error:', error);

    return res.status(500).render('hint', {
      message: fallbackMessages.routes.statusLoadError,
      messages: fallbackMessages,
    });
  }
});

type CertificateIds = {
  examinationInstituteId: string;
  examId: string;
  attendeeId: string;
};

/**
 * Собирает публичную ссылку на сертификат только для статуса CERTIFICATE_FOUND.
 */
function buildCertificateUrl(status: string, payload: unknown): string | null {
  if (status !== 'CERTIFICATE_FOUND') {
    return null;
  }

  const ids = extractCertificateIds(payload);
  if (!ids) {
    return null;
  }

  return (
    `${TELC_CERTIFICATE_BASE_URL}/${encodeURIComponent(ids.examinationInstituteId)}` +
    `/${encodeURIComponent(ids.examId)}` +
    `/${encodeURIComponent(ids.attendeeId)}`
  );
}

/**
 * Проверяет структуру payload и достаёт идентификаторы сертификата.
 */
function extractCertificateIds(payload: unknown): CertificateIds | null {
  if (!isObject(payload)) {
    return null;
  }

  const examinationInstituteId = payload.examinationInstituteId;
  const examId = payload.examId;
  const attendeeId = payload.attendeeId;

  if (
    typeof examinationInstituteId !== 'string' ||
    typeof examId !== 'string' ||
    typeof attendeeId !== 'string'
  ) {
    return null;
  }

  return {
    examinationInstituteId,
    examId,
    attendeeId,
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Форматирует дату по языку интерфейса без влияния локального часового пояса сервера.
 */
function formatDateByLanguage(value: Date, language: UiLanguage): string {
  return new Intl.DateTimeFormat(language, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(value);
}
