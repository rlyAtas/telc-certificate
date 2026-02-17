import express from 'express';
import path from 'path';
import { indexRouter } from './routes/index.js';
import { testRouter } from './routes/test.js';
import { subscribeRouter } from './routes/subscribe.js';

export const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use('/', indexRouter);
app.use('/subscribe', subscribeRouter);

app.use((_req, res) => {
  res.status(404).send('Not found');
});