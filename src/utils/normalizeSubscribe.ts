import type { SubscribeValues } from '../validators/subscribeValidator.js';
import type { SubscribeData } from '../types/subscribe.js';

function toUtcDateOnly(s: string): Date {
  // s ожидается в формате YYYY-MM-DD
  return new Date(`${s}T00:00:00.000Z`);
}

export function normalizeSubscribe(values: SubscribeValues): SubscribeData {
  const userNumber = values.userNumber.trim();
  const email = values.email.trim();
  const emailLower = email.toLowerCase();
  const birthDate = toUtcDateOnly(values.birthDate);
  const examDate = toUtcDateOnly(values.examDate);

  return {
    userNumber,
    email,
    emailLower,
    birthDate,
    examDate,
  };
}