# telc-certificate: Документация для разработчиков

## 1. Назначение проекта
`telc-certificate` — веб-приложение на `Node.js + Express`, которое:
- принимает заявку на проверку наличия сертификата telc;
- отправляет подтверждение e-mail;
- после подтверждения периодически опрашивает внешний API telc;
- показывает пользователю публичную страницу со статусом заявки.

Основной сценарий: пользователь оставляет данные экзамена, подтверждает e-mail по ссылке, затем отслеживает статус по `publicToken`.

## 2. Технологический стек
- `Node.js` (ESM, TypeScript)
- `Express 5`
- `EJS` (SSR-шаблоны)
- `Prisma + SQLite` (`@prisma/adapter-better-sqlite3`)
- `node-cron` (фоновые проверки)
- `Resend` (отправка e-mail)
- `pino` (логирование)
- `ngrok` (dev-режим, публичный URL)

## 3. Структура проекта
```text
src/
  app.ts                         # настройка express-приложения
  server.ts                      # запуск HTTP, cron, ngrok, graceful shutdown
  db.ts                          # prisma client
  routes/
    index.ts                     # GET /
    subscribe.ts                 # POST /subscribe
    confirm.ts                   # GET /confirm/:token
    status.ts                    # GET /status/:publicToken
    404.ts                       # fallback
  services/
    certificateCheckService.ts   # работа с сущностью CertificateCheck
    logger.ts                    # pino logger
  cron/
    checkCertificates.ts         # планировщик обработки записей
    telcCheck.ts                 # вызов внешнего API telc
  email/
    send.ts                      # отправка письма подтверждения
    templates.ts                 # HTML-шаблон письма
  validators/
    subscribeValidator.ts        # базовая валидация формы
  utils/
    normalizeSubscribe.ts        # нормализация входных данных
    addDays.ts                   # утилита дат
  types/
    subscribe.ts                 # типы домена подписки
prisma/
  schema.prisma                  # модель БД
  migrations/                    # SQL-миграции
public/
  styles.css                     # стили UI
views/
  *.ejs                          # серверные шаблоны страниц
```

## 4. Быстрый старт (локально)
### 4.1 Установка
```bash
npm install
```

### 4.2 Настройка окружения
Создать `.env` на основе `.env.example` и заполнить:
- `PORT` — порт приложения (например, `3000`);
- `PUBLIC_BASE_URL` — базовый URL приложения (для ссылок в e-mail);
- `DATABASE_URL` — строка подключения SQLite (например, `file:./prisma/dev.db`);
- `SUPPORT_EMAIL` — контакт для страницы ошибок;
- `RESEND_API_KEY` — ключ Resend;
- `SMTP_FROM` — отправитель письма;
- `LOG_LEVEL` — уровень логирования (`debug|info|warn|error`).

### 4.3 Применение миграций
```bash
npm run migrate
```

### 4.4 Запуск
```bash
npm run dev
```

Что происходит в `development`:
- стартует Express;
- поднимается `ngrok` (если есть `NGROK_AUTHTOKEN` в окружении);
- запускается cron-задача проверки сертификатов.

## 5. Скрипты npm
- `npm run dev` — запуск в режиме разработки (`nodemon + tsx`);
- `npm run build` — `prisma generate` + компиляция TypeScript в `dist/`;
- `npm run start` — запуск собранного приложения (`dist/server.js`);
- `npm run migrate` — применение миграций Prisma.

## 6. Основные пользовательские маршруты
- `GET /` — форма создания заявки;
- `POST /subscribe` — валидация, создание записи, отправка e-mail с токеном подтверждения;
- `GET /confirm/:token` — подтверждение e-mail и активация проверки;
- `GET /status/:publicToken` — просмотр текущего статуса;
- `*` — fallback-страница с подсказкой.

## 7. Модель данных и статусы
Ключевая сущность: `CertificateCheck`.

Важные поля:
- идентификаторы: `id`, `publicToken`, `confirmToken`;
- пользовательские данные: `email`, `emailLower`, `userNumber`, `birthDate`, `examDate`;
- состояние: `status`, `createdAt`, `confirmedAt`, `finishedAt`;
- планирование фоновой проверки: `nextRunAt`, `cursorOffset`, `activeUntil`.

### 7.1 Статусы в схеме
- `EMAIL_UNCONFIRMED` — заявка создана, e-mail не подтверждён;
- `EMAIL_EXPIRED` — предусмотрен в enum, но в текущей логике не выставляется;
- `ACTIVE` — заявка подтверждена и проверяется;
- `CHECKING_EXPIRED` — срок проверки истёк;
- `CERTIFICATE_FOUND` — сертификат найден;
- `CERTIFICATE_FAILED` — есть в enum/шаблоне, но в текущей логике не выставляется.

### 7.2 Фактический переход состояний
`EMAIL_UNCONFIRMED -> ACTIVE -> (CERTIFICATE_FOUND | CHECKING_EXPIRED)`

## 8. Фоновая проверка сертификатов (cron)
Точка входа: `src/cron/checkCertificates.ts`.

Текущее поведение:
- cron запускается каждые `5` секунд;
- за один тик обрабатывается только одна заявка;
- выбирается запись `ACTIVE`, у которой `nextRunAt <= now`;
- проверяется лимит окна: максимум `28` дней относительно `examDate`;
- при полном проходе окна поиск откладывается на `4` часа;
- при сетевой ошибке внешнего API повтор через `10` секунд;
- при успехе статус меняется на `CERTIFICATE_FOUND`, заявка завершается.

## 9. Интеграции
### 9.1 Resend (e-mail)
- используется в `src/email/send.ts`;
- отправляется письмо со ссылкой `${PUBLIC_BASE_URL}/confirm/:token`.

### 9.2 telc results API
- используется в `src/cron/telcCheck.ts`;
- приложение считает сертификат найденным, если ответ содержит `examId` и `attendeeId`.

## 10. Логирование и наблюдаемость
- единый логгер: `src/services/logger.ts` (`pino`);
- в `development` включён `pino-pretty`;
- часть модулей всё ещё использует `console.*` напрямую, что мешает единообразию логов.

## 11. Анализ текущего состояния проекта
### 11.1 Сильные стороны
- простая и понятная архитектура без избыточных слоёв;
- чёткое разделение маршрутов, сервисов, cron-логики и шаблонов;
- присутствуют базовые индексы/уникальные ограничения в БД;
- реализован graceful shutdown для сервера, cron и Prisma.

### 11.2 Риски и технический долг
1. Не проверяется срок жизни `confirmToken` в `confirmByToken`, хотя поле `confirmTokenExpiresAt` есть.
2. Статусы `EMAIL_EXPIRED` и `CERTIFICATE_FAILED` описаны в схеме/шаблонах, но не используются в логике.
3. В `src/email/send.ts` используется non-null assertion (`process.env.RESEND_API_KEY!`), что опасно при пустом env.
4. В части модулей используются `console.log/error` вместо централизованного `logger`.
5. Нет автотестов (ни unit, ни интеграционных), поэтому регрессии возможны даже при небольших изменениях.
6. Cron обрабатывает только одну запись за тик, что ограничивает пропускную способность при росте нагрузки.

## 12. Приоритетные улучшения
1. Добавить проверку срока действия `confirmToken` и явный переход в `EMAIL_EXPIRED`.
2. Привести жизненный цикл статусов к единому состоянию модели и UI.
3. Убрать `process.env.*!`, добавить fail-fast валидацию env при старте.
4. Унифицировать логирование через `pino`.
5. Добавить минимум интеграционных тестов для:
   - `POST /subscribe`;
   - `GET /confirm/:token`;
   - `checkCertificates()` с моками telc API.
