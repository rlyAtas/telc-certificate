import { Router } from 'express';
import { validateSubscribe } from '../validators/subscribeValidator.js';
import { normalizeSubscribe } from '../utils/normalizeSubscribe.js';
import { CertificateCheckService } from '../services/certificateCheckService.js';
import { sendConfirmLinkEmail } from '../email/send.js';

export const routerSubscribe = Router();

routerSubscribe.post('/', async (req, res) => {
  console.log('POST /subscribe');

  const { values, errors } = validateSubscribe(req.body);
  console.log('Validation result:', { values, errors });

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
    return res.status(500).render('hint', {
      message:
        'Es gab ein Problem mit Ihrer Anfrage. Bitte versuchen Sie es später erneut.',
        supportEmail: process.env.SUPPORT_EMAIL || 'stas.s.shevchenko@gmail.com',
    });
  }
});
