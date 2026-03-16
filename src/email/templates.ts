import { getMessages } from '../i18n/messages.js';
import type { UiLanguage } from '../i18n/languages.js';

/**
 * Шаблон письма с подтверждением e-mail.
 */
export function confirmEmailHtml(params: { confirmUrl: string; language: UiLanguage }) {
  const messages = getMessages(params.language);
  const emailMessages = messages.emails.confirm;

  return `
    <div style="font-family: system-ui, sans-serif; line-height: 1.4">
      <h2>${emailMessages.title}</h2>
      <p>${emailMessages.paragraph}</p>
      <p><a href="${params.confirmUrl}">${emailMessages.cta}</a></p>
      <p style="color:#667085;font-size:14px">
        ${emailMessages.footer}
      </p>
    </div>
  `;
}

/**
 * Шаблон письма после успешного подтверждения e-mail.
 */
export function confirmedStatusEmailHtml(params: { statusUrl: string; language: UiLanguage }) {
  const messages = getMessages(params.language);
  const emailMessages = messages.emails.confirmedStatus;

  return `
    <div style="font-family: system-ui, sans-serif; line-height: 1.4">
      <h2>${emailMessages.title}</h2>
      <p>${emailMessages.paragraph}</p>
      <p><a href="${params.statusUrl}">${emailMessages.cta}</a></p>
      <p style="color:#667085;font-size:14px">
        ${emailMessages.footer}
      </p>
    </div>
  `;
}

/**
 * Шаблон письма при найденном сертификате.
 */
export function certificateFoundStatusEmailHtml(params: { statusUrl: string; language: UiLanguage }) {
  const messages = getMessages(params.language);
  const emailMessages = messages.emails.certificateFound;

  return `
    <div style="font-family: system-ui, sans-serif; line-height: 1.4">
      <h2>${emailMessages.title}</h2>
      <p>${emailMessages.paragraph}</p>
      <p><a href="${params.statusUrl}">${emailMessages.cta}</a></p>
      <p style="color:#667085;font-size:14px">
        ${emailMessages.footer}
      </p>
    </div>
  `;
}
