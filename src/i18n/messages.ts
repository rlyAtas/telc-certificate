import {
  getLanguageDirection,
  LANGUAGE_OPTION_LABELS,
  resolveLanguage,
  type UiLanguage,
} from './languages.js';
import type { UiMessages, UiMessagesContent } from './types.js';
import ar from './locales/ar.js';
import de from './locales/de.js';
import en from './locales/en.js';
import es from './locales/es.js';
import fr from './locales/fr.js';
import ru from './locales/ru.js';
import uk from './locales/uk.js';

function buildMessages(language: UiLanguage, content: UiMessagesContent): UiMessages {
  return {
    meta: {
      htmlLang: language,
      dir: getLanguageDirection(language),
    },
    language: {
      label: content.languageLabel,
      options: LANGUAGE_OPTION_LABELS,
    },
    common: content.common,
    index: content.index,
    subscribe: content.subscribe,
    confirm: content.confirm,
    status: content.status,
    progress: content.progress,
    hint: content.hint,
    contact: content.contact,
    routes: content.routes,
    emails: content.emails,
  };
}

const MESSAGES_BY_LANGUAGE: Record<UiLanguage, UiMessages> = {
  de: buildMessages('de', de),
  en: buildMessages('en', en),
  fr: buildMessages('fr', fr),
  es: buildMessages('es', es),
  ru: buildMessages('ru', ru),
  uk: buildMessages('uk', uk),
  ar: buildMessages('ar', ar),
};

/**
 * Возвращает словарь сообщений для языка интерфейса.
 * Если язык невалиден, используется fallback (`de` по умолчанию).
 */
export function getMessages(language: unknown, fallback: UiLanguage = 'de'): UiMessages {
  const resolvedLanguage = resolveLanguage(language, fallback);
  return MESSAGES_BY_LANGUAGE[resolvedLanguage];
}
