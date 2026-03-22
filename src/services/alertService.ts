import { logger } from './logger.js';

const TELEGRAM_ALERT_TIMEOUT_MS = 5_000;
const TELEGRAM_ALERT_TEXT_MAX_LENGTH = 4096;

type SendTelegramAlertParams = {
  text: string;
  disableNotification?: boolean; // false - по умолчанию, true - тихое уведомление
};

type TelegramSendMessageResult = {
  ok: boolean;
  description?: string;
  error_code?: number;
};

/**
 * Отправляет уведомление в Telegram-чат через Bot API.
 * Возвращает `true`, если сообщение отправлено успешно, иначе `false`.
 */
export async function sendTelegramAlert(params: SendTelegramAlertParams): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    logger.warn(
      '[services/alertService/sendTelegramAlert] Config missing, variable==TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID'
    );
    return false;
  }

  const text = truncateTelegramText(params.text.trim(), TELEGRAM_ALERT_TEXT_MAX_LENGTH);
  if (!text) {
    logger.warn('[services/alertService/sendTelegramAlert] Validation failed, reason=empty text');
    return false;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      signal: AbortSignal.timeout(TELEGRAM_ALERT_TIMEOUT_MS),
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_notification: params.disableNotification ?? false,
      }),
    });

    const data = await safeParseTelegramResult(response);
    if (!response.ok || !data.ok) {
      logger.error(
        `[services/alertService/sendTelegramAlert] Request failed, status=${response.status}, description=${data.description ?? 'unknown'}, errorCode=${String(data.error_code ?? '')}`
      );
      return false;
    }

    return true;
  } catch (error: unknown) {
    logger.error(`[services/alertService/sendTelegramAlert] Request failed, error=${String(error)}`);
    return false;
  }
}

async function safeParseTelegramResult(response: Response): Promise<TelegramSendMessageResult> {
  try {
    const data: unknown = await response.json();
    if (isTelegramSendMessageResult(data)) {
      return data;
    }
  } catch {
    // Игнорируем parse-ошибку и вернём fallback-результат ниже.
  }

  return {
    ok: false,
    description: 'invalid_telegram_response',
  };
}

function isTelegramSendMessageResult(value: unknown): value is TelegramSendMessageResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return typeof record.ok === 'boolean';
}

/**
 * Ограничивает длину сообщения под лимит Telegram Bot API.
 * Если текст длиннее лимита, многоточие уже входит в итоговую длину.
 */
function truncateTelegramText(value: string, maxLength: number): string {
  if (value.length <= maxLength) {
    return value;
  }

  if (maxLength <= 3) {
    return value.slice(0, maxLength);
  }

  return `${value.slice(0, maxLength - 3)}...`;
}
