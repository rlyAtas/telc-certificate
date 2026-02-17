import crypto from 'crypto';
import { prisma } from '../db.js';
import type { SubscribeData } from '../types/subscribe.js';

export class CertificateCheckService {
  static async create(input: SubscribeData) {
    try {
      const confirmToken = crypto.randomUUID();
      const publicToken = crypto.randomBytes(18).toString('base64url');

      const now = new Date();
      const confirmTokenExpiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

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

  // static async confirmByToken(token: string) {
  //   const record = await prisma.certificateCheck.findUnique({
  //     where: { confirmToken: token },
  //   });

  //   if (!record) return null;
  //   if (record.confirmedAt) return record;

  //   return prisma.certificateCheck.update({
  //     where: { id: record.id },
  //     data: {
  //       status: 'ACTIVE',
  //       confirmedAt: new Date(),
  //     },
  //   });
  // }
}