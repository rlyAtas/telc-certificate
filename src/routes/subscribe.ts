import { Router } from 'express';
import { validateSubscribe } from '../validators/subscribeValidator.js';

export const subscribeRouter = Router();

subscribeRouter.post('/', (req, res) => {
  console.log('POST /subscribe');

  const {
    userNumber,
    birthDate,
    examDate,
    email,
  } = req.body as Record<string, string>;

  const { values, errors } = validateSubscribe(req.body);
  console.log('values', values);
  console.log('errors', errors);

  if (Object.keys(errors).length > 0) {
    return res.status(400).render('index', {
      errors,
      values: {
        userNumber,
        birthDate,
        examDate,
        email,
      },
    });
  }

  /**
   * TODO:
   *  - сохранить в БД (Prisma)
   *  - сгенерировать confirmToken / publicToken
   *  - отправить email
   */

  // временный успех
  res.render('message', {
    title: 'Anfrage erhalten',
    message:
      'Vielen Dank! Bitte bestätigen Sie Ihre E-Mail-Adresse über den Link, den wir Ihnen geschickt haben.',
  });
});
