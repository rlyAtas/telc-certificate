import { transporter } from './mailer.js';
import { confirmEmailHtml } from './templates.js';

export async function sendConfirmLinkEmail(params: {
  to: string;
  confirmUrl: string;
}) {
  console.log('Sending confirmation email to:', params.to);

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: params.to,
    subject: 'telc – Bitte E-Mail bestätigen',
    html: confirmEmailHtml({ confirmUrl: params.confirmUrl }),
  });
}
