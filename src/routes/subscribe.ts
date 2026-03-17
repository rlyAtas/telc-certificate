import { Router } from 'express';
import { MIN_FORM_FILL_TIME_MS } from '../config.js';
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
  const honeypot = req.body.website;
  const elapsedMs = getElapsedFromFormStart(req.body.formStartedAt);

  if (typeof honeypot !== 'string' || honeypot !== '') {
    logger.warn(
      `[routes/subscribe] honeypot triggered: ip=${req.ip}, ua=${req.get('user-agent') ?? 'unknown'}`
    );

    return res.render('subscribe', {
      messages,
      language,
    });
  }

  if (elapsedMs < MIN_FORM_FILL_TIME_MS) {
    logger.warn(
      `[routes/subscribe] speed-check triggered: elapsedMs=${elapsedMs}, ip=${req.ip}, ua=${req.get('user-agent') ?? 'unknown'}`
    );

    return res.render('subscribe', {
      messages,
      language,
    });
  }

  const { values, errors } = validateSubscribe(req.body, messages.routes.subscribeValidation);

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('index', {
      errors,
      values,
      formStartedAt: req.body.formStartedAt,
      language,
      messages,
      supportedLanguages: SUPPORTED_LANGUAGES,
    });
  }

  try {
    const data = normalizeSubscribe(values);
    const hasOpenRequest = await CertificateCheckService.hasOpenRequestByEmailLower(data.emailLower);
    if (hasOpenRequest) {
      logger.info(
        `[routes/subscribe] open request already exists for emailLower=${data.emailLower}, ip=${req.ip}`
      );

      return res.render('hint', {
        message: messages.routes.subscribeAlreadyExistsByEmail,
        messages,
        homeUrl: `/?lang=${encodeURIComponent(language)}`,
      });
    }

    const created = await CertificateCheckService.create(data);
    
    const confirmUrl = `${process.env.PUBLIC_BASE_URL}/confirm/${created.confirmToken}`;
    await sendConfirmLinkEmail({
      to: created.email,
      confirmUrl,
      language: created.language,
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

function getElapsedFromFormStart(value: unknown): number {
  if (typeof value !== 'string') return 0;

  const startedAtMs = Number.parseInt(value, 10);
  if (!Number.isFinite(startedAtMs) || startedAtMs <= 0) return 0;

  return Date.now() - startedAtMs;
}
