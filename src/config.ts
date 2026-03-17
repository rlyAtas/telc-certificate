/**
 * Единый источник констант приложения.
 * Здесь храним бизнес-правила, тайминги и инфраструктурные fallback-значения.
 */

// -----------------------------
// Бизнес-правила проверки
// -----------------------------

/** Длительность активного окна поиска сертификата (в днях). */
export const CHECK_ACTIVE_DAYS = 45;

/** Интервал между полными проходами диапазона дат (в часах). */
export const FULL_SCAN_INTERVAL_HOURS = 4;

/** Размер случайного токена публичной ссылки в байтах (randomBytes). */
export const PUBLIC_TOKEN_BYTES = 5;

// -----------------------------
// Тайминги и интервалы
// -----------------------------

/** Базовый тик проверки cron (в секундах). */
export const CHECK_TICK_SECONDS = 5;

/** Базовый тик проверки cron (в миллисекундах). */
export const CHECK_TICK_MS = CHECK_TICK_SECONDS * 1000;

/** Задержка повтора после временной ошибки внешнего API (в миллисекундах). */
export const CHECK_RETRY_DELAY_MS = 30_000; // 30 секунд 

/** Интервал между полными проходами диапазона дат (в миллисекундах). */
export const FULL_SCAN_INTERVAL_MS = FULL_SCAN_INTERVAL_HOURS * 60 * 60 * 1000;

/** Таймаут запроса к внешнему API telc (в миллисекундах). */
export const TELC_REQUEST_TIMEOUT_MS = 5_000;

/** Минимальное время заполнения формы (в миллисекундах). */
export const MIN_FORM_FILL_TIME_MS = 3_000;

/** Окно лимита для POST /subscribe по IP (в миллисекундах). */
export const SUBSCRIBE_RATE_LIMIT_WINDOW_MS = 60_000;

/** Максимум запросов на POST /subscribe в рамках окна на один IP. */
export const SUBSCRIBE_RATE_LIMIT_MAX_REQUESTS = 3;

/** Cron-выражение для запуска проверки. */
export const CHECK_TICK_CRON_EXPRESSION = `*/${CHECK_TICK_SECONDS} * * * * *`;

/** Интервал между разрешенной выгрузкой базы данных */
export const ADMIN_DB_DOWNLOAD_RATE_LIMIT_MS = 5 * 60 * 1000;

/** Порт HTTP-сервера (fallback при пустом `PORT`). */
export const APP_PORT = Number(process.env.PORT ?? 3000);

/** Срок жизни токена подтверждения e-mail (в миллисекундах). */
export const CONFIRM_TOKEN_EXPIRE_MS = CHECK_ACTIVE_DAYS * 24 * 60 * 60 * 1000;
