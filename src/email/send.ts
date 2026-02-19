import { Resend } from 'resend';
import { confirmEmailHtml } from './templates.js';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendConfirmLinkEmail(params: {
  to: string;
  confirmUrl: string;
}) {
  console.log('Sending confirmation email to:', params.to);

  const from = process.env.SMTP_FROM || 'telc Zertifikatsprüfung <something@resend.dev>';

  const { data, error } = await resend.emails.send({
    from,
    to: params.to,
    subject: 'telc – Bitte E-Mail bestätigen',
    html: confirmEmailHtml({ confirmUrl: params.confirmUrl }),
  });
  if (error) return console.error({ error } );

}
