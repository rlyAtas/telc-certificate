import { Router } from 'express';

export const indexRouter = Router();

indexRouter.get('/', (_req, res) => {
  console.log('GET /');
  res.render('index', {
    errors: {},
    values: {},
  });
});

