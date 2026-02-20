import { Router } from 'express';
import { CertificateCheckService } from '../services/certificateCheckService.js';

export const routerConfirm = Router();

routerConfirm.get('/:token', async (req, res) => {

  const token = String(req.params.token ?? '');

  if (!token) {
    console.warn('[routes/confirm] No token provided in request');
    return res.status(400).render('hint', {
      message: 'Der Bestätigungslink ist ungültig.',
      supportEmail: process.env.SUPPORT_EMAIL,
    });
  }

  try {
    const record = await CertificateCheckService.confirmByToken(token);

    if (!record) {
      console.warn(`[routes/confirm] No record found for token: ${token}`);
      return res.status(404).render('hint', {
        message: 'Der Bestätigungslink ist ungültig oder abgelaufen.',
        supportEmail: process.env.SUPPORT_EMAIL,
      });
    }

    const urlStatus = `${process.env.PUBLIC_BASE_URL}/status/${record.publicToken}`;
    return res.render('confirm', { urlStatus });

  } catch (err) {
    console.error('[confirm] error:', err);

    return res.status(500).render('hint', {
      message: 'Beim Bestätigen Ihrer Anfrage ist ein Fehler aufgetreten.',
      supportEmail: process.env.SUPPORT_EMAIL,
    });
  }
});