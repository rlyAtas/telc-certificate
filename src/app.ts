import express from 'express';
import path from 'path';
import { routerIndex } from './routes/index.js';
import { routerSubscribe } from './routes/subscribe.js';
import { routerConfirm } from './routes/confirm.js';
import { router404 } from './routes/404.js';
import { routerStatus } from './routes/status.js';

export const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(process.cwd(), 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use('/', routerIndex);
app.use('/subscribe', routerSubscribe);
app.use('/confirm', routerConfirm);
app.use('/status', routerStatus);

app.use(router404);