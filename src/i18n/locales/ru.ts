import type { UiMessagesContent } from '../types.js';

const ru: UiMessagesContent = {
    languageLabel: 'Язык',
    common: {
      pageTitle: 'telc – Проверка сертификата',
      pageHeaderTitle: 'Проверка сертификата telc',
    },
    index: {
      introLabel: 'Проверка сертификата',
      introParagraph:
        'Этот сервис выполняет автоматический поиск вашего сертификата telc. Мы регулярно проверяем возможные даты и сразу уведомим вас, как только сертификат будет найден.',
      formHeading: 'Создать заявку',
      userNumberLabel: 'Номер участника',
      birthDateLabel: 'Дата рождения',
      examDateLabel: 'Дата экзамена',
      emailLabel: 'E-mail',
      submitButton: 'Начать проверку',
    },
    subscribe: {
      introLabel: 'Почти готово',
      introParagraph:
        'Следующий шаг — подтверждение e-mail. Откройте ссылку из письма, чтобы запустить проверку. Проверьте также папку спам.',
    },
    confirm: {
      introLabel: 'E-mail подтверждён',
      introParagraphs: [
        'Спасибо! Ваш e-mail успешно подтверждён. Автоматическая проверка сертификата запущена.',
        'Как только сертификат будет найден, мы отправим ещё одно письмо. Текущий статус всегда доступен по вашей персональной ссылке.',
      ],
      statusButton: 'Открыть статус',
    },
    status: {
      badges: {
        active: 'Активно',
        found: 'Найдено',
        completed: 'Завершено',
        unknown: 'Неизвестно',
      },
      messages: {
        active: 'Проверка сертификата выполняется.',
        found: 'Сертификат найден.',
        completed: 'Проверка завершена. В период проверки сертификат не найден.',
        unknown: 'Текущий статус не удалось определить.',
      },
      participantNumberLabel: 'Номер участника',
      examDateLabel: 'Дата экзамена',
      certificateButton: 'Открыть сертификат',
      supportLabel: 'Поддержать сервис',
      supportMessage: 'Поддержите проект — угостите меня кофе.',
      supportButton: 'Поддержать',
    },
    progress: {
      heading: 'Текущий статус',
      step1: {
        todo: 'Отправить заявку',
        active: 'Отправить заявку',
        done: 'Заявка отправлена',
      },
      step2: {
        todo: 'Подтвердить e-mail',
        active: 'Подтвердить e-mail',
        done: 'E-mail подтверждён',
      },
      step3: {
        todo: 'Автоматическая проверка',
        active: 'Автоматическая проверка выполняется',
        done: 'Автоматическая проверка завершена',
      },
      step4: {
        todo: 'Получить результат',
        active: 'Получить результат',
        done: 'Результат получен',
      },
    },
    hint: {
      label: 'Сообщение',
      backToHome: 'На главную',
    },
    contact: {
      ariaLabel: 'Контакты',
      authorLine: '© Stanislav Shevchenko',
      emailTitle: 'E-mail',
      emailAriaLabel: 'E-mail',
      telegramTitle: 'Telegram',
      telegramAriaLabel: 'Telegram',
    },
    routes: {
      statusInvalidLink: 'Ссылка на статус недействительна.',
      statusInvalidOrExpired: 'Ссылка на статус недействительна или устарела.',
      statusLoadError: 'При загрузке статуса произошла ошибка.',
      confirmInvalidLink: 'Ссылка подтверждения недействительна.',
      confirmInvalidOrExpired: 'Ссылка подтверждения недействительна или устарела.',
      confirmProcessError: 'При подтверждении заявки произошла ошибка.',
      subscribeAlreadyExistsByEmail:
        'Для этого e-mail уже есть активная заявка. Проверьте почту (включая спам) и используйте последнюю полученную ссылку.',
      subscribeProcessError: 'Возникла проблема с вашей заявкой. Попробуйте позже.',
      pageNotFound: 'Запрошенная страница не найдена.',
      subscribeValidation: {
        userNumberRequired: 'Введите номер участника.',
        birthDateRequired: 'Введите дату рождения.',
        examDateRequired: 'Введите дату экзамена.',
        emailRequired: 'Введите e-mail.',
      },
    },
    emails: {
      confirm: {
        subject: 'telc – Подтвердите e-mail',
        title: 'Требуется подтверждение',
        paragraph: 'Подтвердите ваш e-mail, чтобы мы могли начать проверку.',
        cta: 'Подтвердить e-mail',
        footer: 'Если вы не отправляли эту заявку, просто проигнорируйте письмо.',
      },
      confirmedStatus: {
        subject: 'telc – E-mail подтверждён, ссылка на статус',
        title: 'E-mail успешно подтверждён',
        paragraph: 'Ваша заявка активирована. Поиск сертификата выполняется автоматически в фоновом режиме. Как только появится результат, вы получите дополнительное письмо.',
        cta: 'Открыть статус заявки',
        footer: 'Вы можете проверять статус в любое время по ссылке выше.',
      },
      certificateFound: {
        subject: 'telc – Сертификат найден',
        title: 'Сертификат найден',
        paragraph: 'Хорошая новость: ваш сертификат найден.',
        cta: 'Открыть статус заявки',
        footer: 'На странице статуса вы сможете перейти к сертификату.',
      },
    },
};

export default ru;
