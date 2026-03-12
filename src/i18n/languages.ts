/**
 * Поддерживаемые языки интерфейса.
 */
export const SUPPORTED_LANGUAGES = ['de', 'en', 'fr', 'es', 'ru', 'uk', 'ar'] as const;

/**
 * Код языка интерфейса.
 */
export type UiLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Направление письма в интерфейсе.
 */
export type UiDirection = 'ltr' | 'rtl';

const SUPPORTED_LANGUAGE_SET = new Set<string>(SUPPORTED_LANGUAGES);
const RTL_LANGUAGES_SET = new Set<UiLanguage>(['ar']);

/**
 * Названия языков в их собственном написании.
 * Используются в селекторе языка.
 */
export const LANGUAGE_OPTION_LABELS: Record<UiLanguage, string> = {
  de: 'Deutsch',
  en: 'English',
  fr: 'Français',
  es: 'Español',
  ru: 'Русский',
  uk: 'Українська',
  ar: 'العربية',
};

/**
 * Проверяет, что значение является валидным кодом языка интерфейса.
 */
export function isUiLanguage(value: unknown): value is UiLanguage {
  return typeof value === 'string' && SUPPORTED_LANGUAGE_SET.has(value);
}

/**
 * Нормализует входной язык и возвращает гарантированно поддерживаемый код.
 * Если язык невалиден, возвращается fallback (по умолчанию `de`).
 */
export function resolveLanguage(input: unknown, fallback: UiLanguage = 'de'): UiLanguage {
  if (typeof input !== 'string') {
    return fallback;
  }

  const normalized = input.trim().toLowerCase();
  if (isUiLanguage(normalized)) {
    return normalized;
  }

  const shortCode = normalized.split(/[-_]/)[0];
  if (isUiLanguage(shortCode)) {
    return shortCode;
  }

  return fallback;
}

/**
 * Возвращает направление письма для языка.
 */
export function getLanguageDirection(language: UiLanguage): UiDirection {
  return RTL_LANGUAGES_SET.has(language) ? 'rtl' : 'ltr';
}
