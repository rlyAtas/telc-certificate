import type { SubscribeValues } from '../validators/subscribeValidator.js';
import type { UiLanguage } from '../i18n/languages.js';

/**
 * Нормализованные данные заявки, готовые к сохранению в БД.
 */
export type NormalizedSubscribeData = {
  userNumber: string;
  birthDate: Date;
  examDate: Date;
  email: string;
  emailLower: string;
  language: UiLanguage;
};

function toUtcDateOnly(s: string): Date {
  // s ожидается в формате YYYY-MM-DD
  return new Date(`${s}T00:00:00.000Z`);
}

export function normalizeSubscribe(values: SubscribeValues): NormalizedSubscribeData {
  const userNumber = values.userNumber.trim();
  const email = values.email.trim();
  const emailLower = email.toLowerCase();
  const birthDate = toUtcDateOnly(values.birthDate);
  const examDate = toUtcDateOnly(values.examDate);
  const language = values.language;

  return {
    userNumber,
    email,
    emailLower,
    birthDate,
    examDate,
    language,
  };
}
