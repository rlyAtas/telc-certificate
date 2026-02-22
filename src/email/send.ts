import { Resend } from 'resend';
import { logger } from '../services/logger.js';
import {
  certificateFoundStatusEmailHtml,
  confirmEmailHtml,
  confirmedStatusEmailHtml,
} from './templates.js';

const resend = new Resend(process.env.RESEND_API_KEY!);
const fallbackFromEmail = 'telc Zertifikatsprüfung <something@resend.dev>';

function formatEmailError(error: unknown): string {
  if (error instanceof Error) return error.stack || error.message;
  return String(error);
}

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  context: string;
}) {
  const from = process.env.SMTP_FROM || fallbackFromEmail;

  try {
    const { error } = await resend.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      logger.error(`[email/send/sendEmail] ${error}`);
    }
  } catch (error) {
    logger.error(`[email/send/sendEmail}] ${error}`);
  }
}

export async function sendConfirmLinkEmail(params: {
  to: string;
  confirmUrl: string;
}) {
  await sendEmail({
    to: params.to,
    subject: 'telc – Bitte E-Mail bestätigen',
    html: confirmEmailHtml({ confirmUrl: params.confirmUrl }),
    context: 'sendConfirmLinkEmail',
  });
}

/**
 * Отправляет письмо после первого подтверждения e-mail
 * со ссылкой на страницу статуса заявки.
 */
export async function sendConfirmedStatusEmail(params: {
  to: string;
  statusUrl: string;
}) {
  await sendEmail({
    to: params.to,
    subject: 'telc – E-Mail bestätigt, Status-Link',
    html: confirmedStatusEmailHtml({ statusUrl: params.statusUrl }),
    context: 'sendConfirmedStatusEmail',
  });
}

/**
 * Отправляет письмо, когда сертификат найден,
 * со ссылкой на страницу статуса заявки.
 */
export async function sendCertificateFoundStatusEmail(params: {
  to: string;
  statusUrl: string;
}) {
  await sendEmail({
    to: params.to,
    subject: 'telc – Zertifikat gefunden',
    html: certificateFoundStatusEmailHtml({ statusUrl: params.statusUrl }),
    context: 'sendCertificateFoundStatusEmail',
  });
}
