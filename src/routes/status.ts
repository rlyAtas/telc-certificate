import { Router } from 'express';
import { CertificateCheckService } from '../services/certificateCheckService.js';

export const routerStatus = Router();
const TELC_CERTIFICATE_BASE_URL = 'https://results.telc.net/certificate';

/**
 * GET /status/:publicToken
 */
routerStatus.get('/:publicToken', async (req, res) => {
  const publicToken = String(req.params.publicToken ?? '');

  if (!publicToken) {
    return res.status(400).render('hint', {
      message: 'Der Status-Link ist ungültig.',
      supportEmail: process.env.SUPPORT_EMAIL,
    });
  }

  try {
    const record = await CertificateCheckService.getByPublicToken(publicToken);

    if (!record) {
      return res.status(404).render('hint', {
        message: 'Der Status-Link ist ungültig oder abgelaufen.',
        supportEmail: process.env.SUPPORT_EMAIL,
      });
    }

    const certificateUrl = buildCertificateUrl(record.status, record.certificatePayloadJson);

    return res.render('status', {
      status: record.status,
      examDate: record.examDate,
      finishedAt: record.finishedAt,
      lastCheckedAt: record.lastCheckedAt,
      nextRunAt: record.nextRunAt,
      certificateUrl,
    });
  } catch (error) {
    console.error('[routes/status] error:', error);

    return res.status(500).render('hint', {
      message: 'Beim Laden des Status ist ein Fehler aufgetreten.',
      supportEmail: process.env.SUPPORT_EMAIL,
    });
  }
});

/**
 * Формирует ссылку на найденный сертификат только для завершенной заявки.
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

type CertificateIds = {
  examinationInstituteId: string;
  examId: string;
  attendeeId: string;
};

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
