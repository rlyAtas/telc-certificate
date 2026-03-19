import { getMessages } from '../i18n/messages.js';
import type { UiLanguage } from '../i18n/languages.js';
import type { EmailMessageContent, EmailSupportContent } from '../i18n/types.js';
import { DONATION_URL } from '../config.js';

type EmailLayoutParams = {
  title: string;
  paragraphs: string[];
  ctaText: string;
  ctaUrl: string;
  note: string;
  support?: EmailSupportContent;
  supportUrl?: string;
};

function getEmailParagraphs(content: EmailMessageContent): string[] {
  if (Array.isArray(content.paragraphs) && content.paragraphs.length > 0) {
    return content.paragraphs;
  }

  if (typeof content.paragraph === 'string' && content.paragraph.trim()) {
    return [content.paragraph];
  }

  return [];
}

function getEmailNote(content: EmailMessageContent): string {
  if (typeof content.note === 'string' && content.note.trim()) {
    return content.note;
  }

  if (typeof content.footer === 'string' && content.footer.trim()) {
    return content.footer;
  }

  return '';
}

function renderEmailHtml(params: EmailLayoutParams): string {
  const paragraphsHtml = params.paragraphs
    .map(
      (paragraph) => `
        <p style="margin:0 0 14px;color:#475467;font-size:16px;line-height:1.6;">
          ${paragraph}
        </p>
      `
    )
    .join('');

  const noteHtml = params.note
    ? `
        <div style="margin-top:24px;padding-top:18px;border-top:1px solid #eaecf0;">
          <p style="margin:0;color:#667085;font-size:14px;line-height:1.6;">
            ${params.note}
          </p>
        </div>
      `
    : '';

  const supportHtml = params.support && params.supportUrl
    ? `
        <div style="margin-top:24px;padding:16px;border:1px solid #e4e7ec;border-radius:16px;background:#f8fafc;">
          <p style="margin:0 0 8px;color:#98a2b3;font-size:12px;font-weight:700;line-height:1.4;letter-spacing:0.08em;text-transform:uppercase;">
            ${params.support.label}
          </p>
          <p style="margin:0 0 14px;color:#475467;font-size:14px;line-height:1.6;">
            ${params.support.message}
          </p>
          <a
            href="${params.supportUrl}"
            style="display:inline-block;padding:10px 16px;border-radius:999px;border:1px solid #d0d5dd;color:#344054;font-size:13px;font-weight:600;line-height:1;text-decoration:none;background:#ffffff;"
          >
            ${params.support.button}
          </a>
        </div>
      `
    : '';

  return `
    <div style="margin:0;padding:32px 16px;background:#f5f7fb;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <div style="max-width:560px;margin:0 auto;">
        <div style="padding:32px 28px;border:1px solid #e4e7ec;border-radius:24px;background:#ffffff;box-shadow:0 12px 30px rgba(16,24,40,0.06);">
          <p style="margin:0 0 10px;color:#98a2b3;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
            results.telc
          </p>
          <h1 style="margin:0 0 18px;color:#101828;font-size:28px;line-height:1.2;font-weight:800;">
            ${params.title}
          </h1>
          ${paragraphsHtml}
          <div style="margin-top:24px;">
            <a
              href="${params.ctaUrl}"
              style="display:inline-block;padding:14px 22px;border-radius:14px;background:#111827;color:#ffffff;font-size:15px;font-weight:700;line-height:1;text-decoration:none;"
            >
              ${params.ctaText}
            </a>
          </div>
          ${noteHtml}
          ${supportHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * Шаблон письма с подтверждением e-mail.
 */
export function confirmEmailHtml(params: { confirmUrl: string; language: UiLanguage }) {
  const messages = getMessages(params.language);
  const emailMessages = messages.emails.confirm;

  return renderEmailHtml({
    title: emailMessages.title,
    paragraphs: getEmailParagraphs(emailMessages),
    ctaText: emailMessages.cta,
    ctaUrl: params.confirmUrl,
    note: getEmailNote(emailMessages),
  });
}

/**
 * Шаблон письма после успешного подтверждения e-mail.
 */
export function confirmedStatusEmailHtml(params: { statusUrl: string; language: UiLanguage }) {
  const messages = getMessages(params.language);
  const emailMessages = messages.emails.confirmedStatus;

  return renderEmailHtml({
    title: emailMessages.title,
    paragraphs: getEmailParagraphs(emailMessages),
    ctaText: emailMessages.cta,
    ctaUrl: params.statusUrl,
    note: getEmailNote(emailMessages),
    support: emailMessages.support,
    supportUrl: DONATION_URL,
  });
}

/**
 * Шаблон письма при найденном сертификате.
 */
export function certificateFoundStatusEmailHtml(params: { statusUrl: string; language: UiLanguage }) {
  const messages = getMessages(params.language);
  const emailMessages = messages.emails.certificateFound;

  return renderEmailHtml({
    title: emailMessages.title,
    paragraphs: getEmailParagraphs(emailMessages),
    ctaText: emailMessages.cta,
    ctaUrl: params.statusUrl,
    note: getEmailNote(emailMessages),
    support: emailMessages.support,
    supportUrl: DONATION_URL,
  });
}
