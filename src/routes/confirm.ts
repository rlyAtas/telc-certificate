import { Router } from 'express';
import { CertificateCheckService } from '../services/certificateCheckService.js';
import { sendConfirmedStatusEmail } from '../email/send.js';
import { getMessages } from '../i18n/messages.js';
import { resolveLanguage } from '../i18n/languages.js';
import { logger } from '../services/logger.js';

export const routerConfirm = Router();

routerConfirm.get('/:token', async (req, res) => {
  const fallbackMessages = getMessages('de');

  try {
    const token = String(req.params.token);

    const confirmed = await CertificateCheckService.confirmByToken(token);

    if (!confirmed) {
      logger.warn(`[routes/confirm] No record found for token: ${token}`);
      return res.status(404).render('hint', {
        message: fallbackMessages.routes.confirmInvalidOrExpired,
        messages: fallbackMessages,
      });
    }

    const { record, justConfirmed } = confirmed;
    const language = resolveLanguage(record.language);
    const messages = getMessages(language);
    const urlStatus = `${process.env.PUBLIC_BASE_URL}/status/${record.publicToken}`;

    if (justConfirmed) {
      await sendConfirmedStatusEmail({
        to: record.email,
        statusUrl: urlStatus,
        language,
      });
    }

    return res.render('confirm', {
      urlStatus,
      language,
      messages,
    });

  } catch (err) {
    logger.error(`[routes/confirm] error: ${err}`);

    return res.status(500).render('hint', {
      message: fallbackMessages.routes.confirmProcessError,
      messages: fallbackMessages,
    });
  }
});
