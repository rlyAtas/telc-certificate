import { Router } from 'express';
import { validateSubscribe } from '../validators/subscribeValidator.js';
import { normalizeSubscribe } from '../utils/normalizeSubscribe.js';
import { CertificateCheckService } from '../services/certificateCheckService.js';

export const subscribeRouter = Router();

subscribeRouter.post('/', async (req, res) => {
  console.log('POST /subscribe');

  const { values, errors } = validateSubscribe(req.body);
  console.log('Validation result:', { values, errors });

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('index', {
      errors,
      values,
    });
  }

  const data = normalizeSubscribe(values);
  try {
    await CertificateCheckService.create(data);
  } catch (error: unknown) {
    return res.render('hinweis', {
      message:
        'Es gab ein Problem mit Ihrer Anfrage. Bitte versuchen Sie es später erneut.',
      supportEmail: process.env.SUPPORT_EMAIL || 'stas.s.shevchenko@gmail.com',
    });
  }

  return res.render('success');
});
