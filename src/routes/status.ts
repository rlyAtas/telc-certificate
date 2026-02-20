import { Router } from 'express';
import { CertificateCheckService } from '../services/certificateCheckService.js';

export const routerStatus = Router();

/**
 * GET /status/:publicToken
 */
routerStatus.get('/:publicToken', async (req, res) => {
  const publicToken = String(req.params.publicToken ?? '');

  if (!publicToken) {
    return res.status(400).render('hint', {
      message: 'Der Status-Link ist ungültig.',
      supportEmail: process.env.SUPPORT_EMAIL,
    });
  }

  try {
    const record = await CertificateCheckService.getByPublicToken(publicToken);

    if (!record) {
      return res.status(404).render('hint', {
        message: 'Der Status-Link ist ungültig oder abgelaufen.',
        supportEmail: process.env.SUPPORT_EMAIL,
      });
    }

    return res.render('status', {
      status: record.status,
      examDate: record.examDate,
      createdAt: record.createdAt,
      finishedAt: record.finishedAt,
    });
  } catch (error) {
    console.error('[routes/status] error:', error);

    return res.status(500).render('hint', {
      message: 'Beim Laden des Status ist ein Fehler aufgetreten.',
      supportEmail: process.env.SUPPORT_EMAIL,
    });
  }
});