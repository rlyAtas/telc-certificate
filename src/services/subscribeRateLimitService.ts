import {
  SUBSCRIBE_RATE_LIMIT_MAX_REQUESTS,
  SUBSCRIBE_RATE_LIMIT_WINDOW_MS,
} from '../config.js';

type IpRateLimitState = {
  count: number;
  windowStartedAt: number;
};

const ipRateLimitState = new Map<string, IpRateLimitState>();
let lastCleanupAtMs = 0;

/**
 * Проверяет лимит запросов на отправку формы по IP.
 * Возвращает true, если запрос можно обработать.
 */
export function isSubscribeAllowedByIp(ip: string): boolean {
  const nowMs = Date.now();
  cleanupExpiredIpStates(nowMs);
  const currentState = ipRateLimitState.get(ip);

  if (!currentState) {
    ipRateLimitState.set(ip, {
      count: 1,
      windowStartedAt: nowMs,
    });
    return true;
  }

  const windowAgeMs = nowMs - currentState.windowStartedAt;
  if (windowAgeMs >= SUBSCRIBE_RATE_LIMIT_WINDOW_MS) {
    ipRateLimitState.set(ip, {
      count: 1,
      windowStartedAt: nowMs,
    });
    return true;
  }

  if (currentState.count >= SUBSCRIBE_RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  currentState.count += 1;
  ipRateLimitState.set(ip, currentState);
  return true;
}

function cleanupExpiredIpStates(nowMs: number): void {
  // Ограничиваем частоту полной очистки, чтобы не перебирать Map на каждый запрос.
  if (nowMs - lastCleanupAtMs < SUBSCRIBE_RATE_LIMIT_WINDOW_MS) {
    return;
  }

  lastCleanupAtMs = nowMs;

  for (const [ip, state] of ipRateLimitState.entries()) {
    if (nowMs - state.windowStartedAt >= SUBSCRIBE_RATE_LIMIT_WINDOW_MS) {
      ipRateLimitState.delete(ip);
    }
  }
}
