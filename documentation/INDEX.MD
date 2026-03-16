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
  i18n/
    languages.ts                 # поддерживаемые языки и направление текста
    messages.ts                  # входная точка локализации
    types.ts                     # типы словаря переводов
    locales/
      *.ts                       # переводы по языкам (de/en/fr/es/ru/uk/ar)
  routes/
    index.ts                     # GET /
    subscribe.ts                 # POST /subscribe
    confirm.ts                   # GET /confirm/:token
    status.ts                    # GET /status/:publicToken
    adminDbDownload.ts           # GET /admin/db/download (закрытый эндпоинт)
    404.ts                       # fallback
  services/
    certificateCheckService.ts   # работа с сущностью CertificateCheck
    dbBackupService.ts           # создание и удаление snapshot SQLite
    logger.ts                    # pino logger
  cron/
    checkCertificates.ts         # планировщик обработки записей
  email/
    send.ts                      # отправка e-mail уведомлений
    templates.ts                 # HTML-шаблоны писем
  validators/
    subscribeValidator.ts        # базовая валидация формы
  utils/
    normalizeSubscribe.ts        # нормализация входных данных
    addDays.ts                   # утилита дат
    telcCheck.ts                 # вызов внешнего API telc
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
- `RESEND_API_KEY` — ключ Resend;
- `SMTP_FROM` — отправитель письма;
- `ADMIN_EXPORT_TOKEN` — токен для закрытого эндпоинта выгрузки БД (`/admin/db/download`);
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

## 6.1 Служебные маршруты
- `GET /admin/db/download` — скачивание snapshot SQLite (заголовок `X-Admin-Token` обязателен, токен берётся из `ADMIN_EXPORT_TOKEN`).

## 7. Модель данных и статусы
Ключевая сущность: `CertificateCheck`.

Важные поля:
- идентификаторы: `id`, `publicToken`, `confirmToken`;
- пользовательские данные: `email`, `emailLower`, `userNumber`, `birthDate`, `examDate`;
- язык интерфейса: `language`;
- состояние: `status`, `createdAt`, `confirmedAt`, `finishedAt`;
- результат поиска сертификата: `certificatePayloadJson`;
- планирование фоновой проверки: `lastCheckedAt`, `nextRunAt`, `cursorOffset`, `activeUntil`.

### 7.1 Статусы в схеме
- `EMAIL_UNCONFIRMED` — заявка создана, e-mail не подтверждён;
- `EMAIL_EXPIRED` — предусмотрен в enum, но в текущей логике не выставляется;
- `ACTIVE` — заявка подтверждена и проверяется;
- `CHECKING_EXPIRED` — срок проверки истёк;
- `CERTIFICATE_FOUND` — сертификат найден;

### 7.2 Фактический переход состояний
`EMAIL_UNCONFIRMED -> ACTIVE -> (CERTIFICATE_FOUND | CHECKING_EXPIRED)`

## 8. Фоновая проверка сертификатов (cron)
Точка входа: `src/cron/checkCertificates.ts`.

Текущее поведение:
- cron запускается каждые `5` секунд;
- за один тик обрабатывается только одна заявка;
- выбирается запись `ACTIVE`, у которой `nextRunAt <= now`;
- проверяется окно поиска: `35` дней относительно `examDate`;
- при полном проходе окна поиск откладывается на `4` часа;
- при сетевой ошибке внешнего API повтор через `10` секунд;
- при успехе статус меняется на `CERTIFICATE_FOUND`, сохраняется payload сертификата и отправляется e-mail;
- при завершении окна поиска и достижении `activeUntil` статус меняется на `CHECKING_EXPIRED`.

## 9. Интеграции
### 9.1 Resend (e-mail)
- используется в `src/email/send.ts`;
- отправляется письмо подтверждения со ссылкой `${PUBLIC_BASE_URL}/confirm/:token`;
- после подтверждения e-mail отправляется письмо со ссылкой на статус;
- при найденном сертификате отправляется письмо со ссылкой на страницу статуса.

### 9.2 telc results API
- используется в `src/utils/telcCheck.ts`;
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
2. Статус `EMAIL_EXPIRED` описан в схеме/шаблонах, но не используется в логике.
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
