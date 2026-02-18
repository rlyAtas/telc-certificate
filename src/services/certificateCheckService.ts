import crypto from 'crypto';
import { prisma } from '../db.js';
import type { SubscribeData } from '../types/subscribe.js';
import { addDays } from '../utils/addDays.js';

const ACTIVE_DAYS = 35;
const EXPIRE_TOREN_HOURS = ACTIVE_DAYS * 24;

export class CertificateCheckService {
  static async create(input: SubscribeData) {
    try {
      const confirmToken = crypto.randomUUID();
      const publicToken = crypto.randomBytes(5).toString('hex');

      const now = new Date();
      const confirmTokenExpiresAt = new Date(now.getTime() + EXPIRE_TOREN_HOURS * 60 * 60 * 1000);

      return prisma.certificateCheck.create({
        data: {
          email: input.email,
          emailLower: input.emailLower,

          userNumber: input.userNumber,
          birthDate: input.birthDate,
          examDate: input.examDate,

          status: 'EMAIL_UNCONFIRMED',

          confirmToken,
          confirmTokenExpiresAt,
          publicToken,
        },
      });
    } catch (error: unknown) {
      console.error('[services/CertificateCheckService/create] Error creating certificate check:', error);
      throw error;
    }
  }

  static async confirmByToken(token: string) {
    try {
      // нет проверки на протухание токена

      const record = await prisma.certificateCheck.findUnique({
        where: { confirmToken: token },
      });

      if (!record) return null;
      if (record.confirmedAt) return record;

      const now = new Date();
      const activeUntil = addDays(record.examDate, ACTIVE_DAYS);

      return prisma.certificateCheck.update({
        where: { id: record.id },
        data: {
          status: 'ACTIVE',
          confirmedAt: now,
          cursorOffset: 0,
          nextRunAt: now,
          activeUntil,
        },
      });
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
      console.error('[services/CertificateCheckService/getByPublicToken] Error fetching by public token:', error);
      throw error;
    }
  }
}