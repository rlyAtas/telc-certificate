import { Router } from 'express';
import { validateSubscribe } from '../validators/subscribeValidator.js';
import { normalizeSubscribe } from '../utils/normalizeSubscribe.js';
import { CertificateCheckService } from '../services/certificateCheckService.js';
import { sendConfirmLinkEmail } from '../email/send.js';
import { logger } from '../services/logger.js';

export const routerSubscribe = Router();

routerSubscribe.post('/', async (req, res) => {
  const { values, errors } = validateSubscribe(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('index', {
      errors,
      values,
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

    return res.render('subscribe');

  } catch (error: unknown) {
    logger.error(`[routes/subscribe] ${error instanceof Error ? error.stack || error.message : String(error)}`);
    return res.status(500).render('hint', {
      message:
        'Es gab ein Problem mit Ihrer Anfrage. Bitte versuchen Sie es später erneut.',
        supportEmail: process.env.SUPPORT_EMAIL || 'stas.s.shevchenko@gmail.com',
    });
  }
});
