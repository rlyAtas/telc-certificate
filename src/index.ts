import dotenv from 'dotenv';
import ngrok from '@ngrok/ngrok';
import express from 'express';
import path from 'path';
import { validateSubscribe } from './validators/subscribeValidator.js';

dotenv.config();
const port = Number(process.env.PORT) || 3000;
const app = express();
let server;

app.get('/test', (_req, res) => {
  res.send('test -> ok');
  console.log('test -> ok');
});

// чтобы читать form-data (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: false }));

// шаблоны
app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/', (_req, res) => {
  res.render('index', { errors: {}, values: {} });
});

app.post('/subscribe', (req, res) => {
  const { userNumber, birthDate, examDate, email } = req.body as Record<string, string>;

  const { values, errors } = validateSubscribe(req.body);

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('index', {
      errors,
      values: { userNumber, birthDate, examDate, email }
    });
  }

  // пока просто показываем .принято. (на этапе 2 сохраним в БД)
  // res.send(`
  //   <h1>Принято ✅</h1>
  //   <p>Номер: ${escapeHtml(userNumber)}</p>
  //   <p>Дата рождения: ${escapeHtml(birthDate)}</p>
  //   <p>Дата экзамена: ${escapeHtml(examDate)}</p>
  //   <p>Email: ${escapeHtml(email)}</p>
  //   <p><a href=./.>Назад</a></p>
  // `);
});

if (process.env.NODE_ENV === 'development') {
  server = app.listen(port, () => {
    console.log(`Server started on port ${port} in development mode`);
  });
  const listener = await ngrok.forward({
    addr: port,
    authtoken_from_env: true,
  });
  const ngrokWebhook = listener.url();
  if (!ngrokWebhook) throw new Error('Ngrok failed to provide a valid URL');
  console.log(`Ngrok URL: ${ngrokWebhook}`);
}

if (process.env.NODE_ENV === 'production') {
  server = app.listen(port, () => {
    console.log(`Server started on port ${port} in production mode`);
  });
}

// простая защита от XSS в этом демо
// function escapeHtml(s: string) {
//   return s
//     .replaceAll(.&., .&amp;.)
//     .replaceAll(.<., .&lt;.)
//     .replaceAll(.>., .&gt;.)
//     .replaceAll('.', .&quot;.)
//     .replaceAll(.'., .&#039;.);
// }