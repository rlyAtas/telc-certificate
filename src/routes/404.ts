import { Router } from 'express';
import { getMessages } from '../i18n/messages.js';

export const router404 = Router();

router404.use((req, res) => {
  const messages = getMessages('de');

  res.status(404).render('hint', {
    message: messages.routes.pageNotFound,
    messages,
  });
});
