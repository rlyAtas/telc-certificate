import { Router } from 'express';
import { MIN_FORM_FILL_TIME_MS } from '../config.js';
import { validateSubscribe } from '../validators/subscribeValidator.js';
import { normalizeSubscribe } from '../utils/normalizeSubscribe.js';
import { CertificateCheckService } from '../services/certificateCheckService.js';
import { isSubscribeAllowedByIp } from '../services/subscribeRateLimitService.js';
import { sendConfirmLinkEmail } from '../email/send.js';
import { logger } from '../services/logger.js';
import { getMessages } from '../i18n/messages.js';
import { resolveLanguage, SUPPORTED_LANGUAGES } from '../i18n/languages.js';
import { sendTelegramAlert } from '../services/alertService.js';

export const routerSubscribe = Router();

routerSubscribe.post('/', async (req, res) => {
  
  await sendTelegramAlert({
    text: `[routes/subscribe] New request, userNumber=${req.body.userNumber}, birthDate=${req.body.birthDate}, examDate=${req.body.examDate}, email=${req.body.email}`,
    disableNotification: true,
  });

  const language = resolveLanguage(req.body.language);
  const messages = getMessages(language);

  try {
    const honeypot = req.body.website;
    const elapsedMs = getElapsedFromFormStart(req.body.formStartedAt);

    if (typeof honeypot !== 'string' || honeypot !== '') {
      logger.warn(
        `[routes/subscribe] Honeypot triggered, ip=${req.ip ?? 'unknown'}, ua=${req.get('user-agent') ?? 'unknown'}`
      );

      await sendTelegramAlert({
        text: `[routes/subscribe] Honeypot triggered, ip=${req.ip ?? 'unknown'}, ua=${req.get('user-agent') ?? 'unknown'}`,
        disableNotification: false,
      });

      return res.render('subscribe', {
        messages,
        language,
      });
    }

    if (elapsedMs < MIN_FORM_FILL_TIME_MS) {
      logger.warn(
        `[routes/subscribe] Speed check triggered, elapsedMs=${elapsedMs}, ip=${req.ip ?? 'unknown'}, ua=${req.get('user-agent') ?? 'unknown'}`
      );

      await sendTelegramAlert({
        text: `[routes/subscribe] Speed check triggered, elapsedMs=${elapsedMs}, ip=${req.ip ?? 'unknown'}, ua=${req.get('user-agent') ?? 'unknown'}`,
        disableNotification: false,
      });

      return res.render('subscribe', {
        messages,
        language,
      });
    }

    const requestIp = req.ip ?? 'unknown';
    if (!isSubscribeAllowedByIp(requestIp)) {
      logger.warn(
        `[routes/subscribe] Rate limit triggered, ip=${requestIp}, ua=${req.get('user-agent') ?? 'unknown'}`
      );

      await sendTelegramAlert({
        text: `[routes/subscribe] Rate limit triggered, ip=${requestIp}, ua=${req.get('user-agent') ?? 'unknown'}`,
        disableNotification: false,
      });

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

    const data = normalizeSubscribe(values);
    const hasOpenRequest = await CertificateCheckService.hasOpenRequestByEmailLower(data.emailLower);
    if (hasOpenRequest) {
      logger.info(
        `[routes/subscribe] Open request exists, emailLower=${data.emailLower} ip=${req.ip ?? 'unknown'}`
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
    logger.error(`[routes/subscribe] Request failed, error=${String(error)}`);

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
