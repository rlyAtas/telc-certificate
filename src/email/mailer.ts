import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = Number(process.env.SMTP_PORT);
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
const from = process.env.SMTP_FROM;

if (!host || !user || !pass || !from) {
  throw new Error('SMTP parametrs is not set');
}

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465, // 465 = SSL, 587 = STARTTLS
  auth: { user, pass },
});
