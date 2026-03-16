import { isUiLanguage, type UiLanguage } from '../i18n/languages.js';
import type { UiMessages } from '../i18n/types.js';

export type SubscribeValues = {
  userNumber: string;
  birthDate: string;
  examDate: string;
  email: string;
  language: UiLanguage;
};

export type SubscribeErrors = Partial<Record<keyof SubscribeValues, string>>;

type SubscribeValidationMessages = UiMessages['routes']['subscribeValidation'];

/**
 * Валидирует входные данные формы подписки и возвращает нормализованные значения.
 * Для языка используется fallback `de`, если пришло невалидное значение.
 */
export function validateSubscribe(
  body: Record<string, unknown>,
  messages: SubscribeValidationMessages,
) {
  const userNumber = String(body.userNumber ?? '').trim();
  const birthDate = String(body.birthDate ?? '');
  const examDate = String(body.examDate ?? '');
  const email = String(body.email ?? '').trim();
  const rawLanguage = String(body.language ?? '').trim().toLowerCase();
  const language = isUiLanguage(rawLanguage) ? rawLanguage : 'de';

  const errors: SubscribeErrors = {};

  if (!userNumber) errors.userNumber = messages.userNumberRequired;
  if (!birthDate) errors.birthDate = messages.birthDateRequired;
  if (!examDate) errors.examDate = messages.examDateRequired;
  if (!email) errors.email = messages.emailRequired;

  const values: SubscribeValues = {
    userNumber,
    birthDate,
    examDate,
    email,
    language,
  };

  return { values, errors };
}
