import { Router } from 'express';

export const routerIndex = Router();

const isDev = process.env.NODE_ENV === 'development';

routerIndex.get('/', (_req, res) => {

  let values = {};

  if (isDev) {
    values = {
      userNumber: '0382586',
      birthDate: '1974-08-22',
      examDate: '2026-02-09',
      email: 'stas.s.shevchenko@gmail.com',
    }
  }

  res.render('index', {
    errors: {},
    values,
  });
});

