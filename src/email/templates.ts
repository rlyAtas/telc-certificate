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

export function confirmedStatusEmailHtml(params: { statusUrl: string }) {
  return `
    <div style="font-family: system-ui, sans-serif; line-height: 1.4">
      <h2>E-Mail erfolgreich bestätigt</h2>
      <p>Ihre Anfrage wurde aktiviert. Die Suche nach dem Zertifikat erfolgt alle 4 Stunden.</p>
      <p><a href="${params.statusUrl}">Status Ihrer Anfrage öffnen</a></p>
      <p style="color:#667085;font-size:14px">
        Sie können den Status jederzeit über den Link oben prüfen.
      </p>
    </div>
  `;
}

export function certificateFoundStatusEmailHtml(params: { statusUrl: string }) {
  return `
    <div style="font-family: system-ui, sans-serif; line-height: 1.4">
      <h2>Zertifikat gefunden</h2>
      <p>Gute Nachricht: Ihr Zertifikat wurde gefunden.</p>
      <p><a href="${params.statusUrl}">Status Ihrer Anfrage öffnen</a></p>
      <p style="color:#667085;font-size:14px">
        Auf der Statusseite können Sie direkt zum Zertifikat wechseln.
      </p>
    </div>
  `;
}
