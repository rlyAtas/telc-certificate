import type { UiMessagesContent } from '../types.js';

const uk: UiMessagesContent = {
    languageLabel: 'Мова',
    common: {
      pageTitle: 'telc – Перевірка сертифіката',
      pageHeaderTitle: 'Перевірка сертифіката telc',
    },
    index: {
      introLabel: 'Перевірка сертифіката',
      introParagraph:
        'Сервіс автоматично шукає ваш сертифікат telc: перевіряє можливі дати протягом 35 днів і одразу повідомляє, коли сертифікат знайдено.',
      formHeading: 'Створити заявку',
      userNumberLabel: 'Номер учасника',
      birthDateLabel: 'Дата народження',
      examDateLabel: 'Дата іспиту',
      emailLabel: 'E-mail',
      submitButton: 'Почати перевірку',
    },
    subscribe: {
      introLabel: 'Майже готово',
      introParagraph:
        'Наступний крок — підтвердження e-mail. Відкрийте посилання з листа, щоб запустити перевірку. Також перевірте теку спам.',
    },
    confirm: {
      introLabel: 'E-mail підтверджено',
      introParagraphs: [
        'Дякуємо! Ваш e-mail успішно підтверджено. Автоматичну перевірку сертифіката запущено.',
        'Щойно сертифікат буде знайдено, ми надішлемо ще один лист. Поточний стан завжди доступний за персональним посиланням.',
      ],
      statusButton: 'Відкрити статус',
    },
    status: {
      badges: {
        active: 'Активно',
        found: 'Знайдено',
        completed: 'Завершено',
        unknown: 'Невідомо',
      },
      messages: {
        active: 'Перевірка сертифіката триває.',
        found: 'Сертифікат знайдено.',
        completed: 'Перевірку завершено. У період перевірки сертифікат не знайдено.',
        unknown: 'Поточний статус не вдалося однозначно визначити.',
      },
      participantNumberLabel: 'Номер учасника',
      examDateLabel: 'Дата іспиту',
      certificateButton: 'Відкрити сертифікат',
      supportLabel: 'Підтримати сервіс',
      supportMessage: 'Підтримайте проєкт — пригостіть мене кавою.',
      supportButton: 'Підтримати',
    },
    progress: {
      heading: 'Поточний стан',
      step1: {
        todo: 'Надіслати заявку',
        active: 'Надіслати заявку',
        done: 'Заявку надіслано',
      },
      step2: {
        todo: 'Підтвердити e-mail',
        active: 'Підтвердити e-mail',
        done: 'E-mail підтверджено',
      },
      step3: {
        todo: 'Автоматична перевірка',
        active: 'Автоматична перевірка виконується',
        done: 'Автоматичну перевірку завершено',
      },
      step4: {
        todo: 'Отримати результат',
        active: 'Отримати результат',
        done: 'Результат отримано',
      },
    },
    hint: {
      label: 'Повідомлення',
      backToHome: 'На головну',
    },
    contact: {
      ariaLabel: 'Контакти',
      authorLine: '© Stanislav Shevchenko',
      emailTitle: 'E-mail',
      emailAriaLabel: 'E-mail',
      telegramTitle: 'Telegram',
      telegramAriaLabel: 'Telegram',
    },
    routes: {
      statusInvalidLink: 'Посилання на статус недійсне.',
      statusInvalidOrExpired: 'Посилання на статус недійсне або прострочене.',
      statusLoadError: 'Під час завантаження статусу сталася помилка.',
      confirmInvalidLink: 'Посилання підтвердження недійсне.',
      confirmInvalidOrExpired: 'Посилання підтвердження недійсне або прострочене.',
      confirmProcessError: 'Під час підтвердження заявки сталася помилка.',
      subscribeProcessError: 'Виникла проблема з вашою заявкою. Спробуйте пізніше.',
      pageNotFound: 'Запитану сторінку не знайдено.',
      subscribeValidation: {
        userNumberRequired: 'Вкажіть номер учасника.',
        birthDateRequired: 'Вкажіть дату народження.',
        examDateRequired: 'Вкажіть дату іспиту.',
        emailRequired: 'Вкажіть e-mail.',
      },
    },
    emails: {
      confirm: {
        subject: 'telc – Підтвердіть e-mail',
        title: 'Потрібне підтвердження',
        paragraph: 'Підтвердьте ваш e-mail, щоб ми могли почати перевірку.',
        cta: 'Підтвердити e-mail',
        footer: 'Якщо ви не створювали цю заявку, просто проігноруйте лист.',
      },
      confirmedStatus: {
        subject: 'telc – E-mail підтверджено, посилання на статус',
        title: 'E-mail успішно підтверджено',
        paragraph: 'Вашу заявку активовано. Пошук сертифіката виконується кожні 4 години.',
        cta: 'Відкрити статус заявки',
        footer: 'Ви можете перевіряти статус у будь-який час за посиланням вище.',
      },
      certificateFound: {
        subject: 'telc – Сертифікат знайдено',
        title: 'Сертифікат знайдено',
        paragraph: 'Гарна новина: ваш сертифікат знайдено.',
        cta: 'Відкрити статус заявки',
        footer: 'На сторінці статусу ви зможете перейти до сертифіката.',
      },
    },
};

export default uk;
