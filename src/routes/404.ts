import { Router } from 'express';

export const router404 = Router();

router404.use((_req, res) => {
  res.status(404).render('hint', {
    message: 'Die angeforderte Seite wurde nicht gefunden.',
    supportEmail: process.env.SUPPORT_EMAIL,
  });
});
