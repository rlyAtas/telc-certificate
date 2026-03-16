import { Router } from 'express';
import { validateSubscribe } from '../validators/subscribeValidator.js';
import { normalizeSubscribe } from '../utils/normalizeSubscribe.js';
import { CertificateCheckService } from '../services/certificateCheckService.js';
import { sendConfirmLinkEmail } from '../email/send.js';
import { logger } from '../services/logger.js';
import { getMessages } from '../i18n/messages.js';
import { resolveLanguage, SUPPORTED_LANGUAGES } from '../i18n/languages.js';

export const routerSubscribe = Router();

routerSubscribe.post('/', async (req, res) => {
  const language = resolveLanguage(req.body.language);
  const messages = getMessages(language);
  const { values, errors } = validateSubscribe(req.body, messages.routes.subscribeValidation);

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('index', {
      errors,
      values,
      language,
      messages,
      supportedLanguages: SUPPORTED_LANGUAGES,
    });
  }

  try {
    const data = normalizeSubscribe(values);
    const created = await CertificateCheckService.create(data);
    
    const confirmUrl = `${process.env.PUBLIC_BASE_URL}/confirm/${created.confirmToken}`;
    await sendConfirmLinkEmail({
      to: created.email,
      confirmUrl,
    });

    return res.render('subscribe', {
      messages,
      language,
    });

  } catch (error: unknown) {
    logger.error(`[routes/subscribe] ${error instanceof Error ? error.stack || error.message : String(error)}`);
    return res.status(500).render('hint', {
      message: messages.routes.subscribeProcessError,
      messages,
      homeUrl: `/?lang=${encodeURIComponent(language)}`,
    });
  }
});
