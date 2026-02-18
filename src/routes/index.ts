import { Router } from 'express';

export const routerIndex = Router();

routerIndex.get('/', (_req, res) => {
  console.log('GET /');
  res.render('index', {
    errors: {},
    values: {},
  });
});

