export function confirmEmailHtml(params: { confirmUrl: string }) {
  return `
    <div style="font-family: system-ui, sans-serif; line-height: 1.4">
      <h2>Bestätigung erforderlich</h2>
      <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, damit wir mit der Überprüfung beginnen können.</p>
      <p><a href="${params.confirmUrl}">E-Mail bestätigen</a></p>
      <p style="color:#667085;font-size:14px">
        Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie bitte diese E-Mail.
      </p>
    </div>
  `;
}
