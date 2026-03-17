import { Resend } from 'resend';
import { logger } from '../services/logger.js';
import { getMessages } from '../i18n/messages.js';
import type { UiLanguage } from '../i18n/languages.js';
import {
  certificateFoundStatusEmailHtml,
  confirmEmailHtml,
  confirmedStatusEmailHtml,
} from './templates.js';

const resend = new Resend(process.env.RESEND_API_KEY!);
const fallbackFromEmail = 'telc Zertifikatsprüfung <something@resend.dev>';

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
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
      logger.error(`[email/send/sendEmail] Email provider error, error=${String(error)}`);
    }
  } catch (error) {
    logger.error(`[email/send/sendEmail] Request failed, error=${String(error)}`);
  }
}

export async function sendConfirmLinkEmail(params: {
  to: string;
  confirmUrl: string;
  language: UiLanguage;
}) {
  const messages = getMessages(params.language);

  await sendEmail({
    to: params.to,
    subject: messages.emails.confirm.subject,
    html: confirmEmailHtml({
      confirmUrl: params.confirmUrl,
      language: params.language,
    }),
  });
}

/**
 * Отправляет письмо после первого подтверждения e-mail
 * со ссылкой на страницу статуса заявки.
 */
export async function sendConfirmedStatusEmail(params: {
  to: string;
  statusUrl: string;
  language: UiLanguage;
}) {
  const messages = getMessages(params.language);

  await sendEmail({
    to: params.to,
    subject: messages.emails.confirmedStatus.subject,
    html: confirmedStatusEmailHtml({
      statusUrl: params.statusUrl,
      language: params.language,
    }),
  });
}

/**
 * Отправляет письмо, когда сертификат найден,
 * со ссылкой на страницу статуса заявки.
 */
export async function sendCertificateFoundStatusEmail(params: {
  to: string;
  statusUrl: string;
  language: UiLanguage;
}) {
  const messages = getMessages(params.language);

  await sendEmail({
    to: params.to,
    subject: messages.emails.certificateFound.subject,
    html: certificateFoundStatusEmailHtml({
      statusUrl: params.statusUrl,
      language: params.language,
    }),
  });
}
