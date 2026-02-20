import { Router } from 'express';

export const routerIndex = Router();

routerIndex.get('/', (_req, res) => {
  res.render('index', {
    errors: {},
    values: {},
  });
});

