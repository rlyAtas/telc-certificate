import crypto from 'crypto';
import { CHECK_ACTIVE_DAYS, CONFIRM_TOKEN_EXPIRE_MS, PUBLIC_TOKEN_BYTES } from '../config.js';
import { prisma } from '../db.js';
import type { NormalizedSubscribeData } from '../utils/normalizeSubscribe.js';
import type { CertificateCheck } from '../generated/prisma/client.js';
import { addDays } from '../utils/addDays.js';
import { logger } from './logger.js';

export class CertificateCheckService {
  static async create(input: NormalizedSubscribeData) {
    try {
      const confirmToken = crypto.randomUUID();
      const publicToken = crypto.randomBytes(PUBLIC_TOKEN_BYTES).toString('hex');

      const now = new Date();
      const confirmTokenExpiresAt = new Date(now.getTime() + CONFIRM_TOKEN_EXPIRE_MS);

      return prisma.certificateCheck.create({
        data: {
          email: input.email,
          emailLower: input.emailLower,

          userNumber: input.userNumber,
          birthDate: input.birthDate,
          examDate: input.examDate,
          language: input.language,

          status: 'EMAIL_UNCONFIRMED',

          confirmToken,
          confirmTokenExpiresAt,
          publicToken,
        },
      });
    } catch (error: unknown) {
      logger.error(`[services/CertificateCheckService/create] ${error}`);
      throw error;
    }
  }

  /**
   * Подтверждает заявку по токену и возвращает флаг первого подтверждения.
   * `justConfirmed = true` означает, что это первое успешное подтверждение e-mail.
   */
  static async confirmByToken(token: string): Promise<{
    record: CertificateCheck;
    justConfirmed: boolean;
  } | null> {
    try {
      // нет проверки на протухание токена

      const record = await prisma.certificateCheck.findUnique({
        where: { confirmToken: token },
      });

      if (!record) return null;
      if (record.confirmedAt) {
        return {
          record,
          justConfirmed: false,
        };
      }

      const now = new Date();
      const activeUntil = addDays(record.examDate, CHECK_ACTIVE_DAYS);

      const updatedRecord = await prisma.certificateCheck.update({
        where: { id: record.id },
        data: {
          status: 'ACTIVE',
          confirmedAt: now,
          cursorOffset: 0,
          nextRunAt: now,
          activeUntil,
        },
      });

      return {
        record: updatedRecord,
        justConfirmed: true,
      };
    } catch (error: unknown) {
      console.error('[services/CertificateCheckService/confirmByToken] Error confirming token:', error);
      throw error;
    }
  }

  static async getByPublicToken(publicToken: string) {
    try {
      return prisma.certificateCheck.findUnique({
        where: { publicToken },
      });
    } catch (error: unknown) {
      console.error(`[services/CertificateCheckService/getByPublicToken] ${error}`);
      throw error;
    }
  }
}
