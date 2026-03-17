import { Router } from 'express';
import { getMessages } from '../i18n/messages.js';
import { resolveLanguage, SUPPORTED_LANGUAGES } from '../i18n/languages.js';

export const routerIndex = Router();

const isDev = process.env.NODE_ENV === 'development';

routerIndex.get('/', (req, res) => {
  const language = resolveLanguage(req.query.lang);
  const messages = getMessages(language);

  const values: Record<string, string> = {};

  if (isDev) {
    values.userNumber = '0382586';
    values.birthDate = '1974-08-22';
    values.examDate = '2026-02-09';
    values.email = 'stas.s.shevchenko@gmail.com';
  }

  res.render('index', {
    errors: {},
    values,
    formStartedAt: String(Date.now()),
    language,
    messages,
    supportedLanguages: SUPPORTED_LANGUAGES,
  });
});
