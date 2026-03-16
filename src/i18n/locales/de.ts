import type { UiMessagesContent } from '../types.js';

const de: UiMessagesContent = {
    languageLabel: 'Sprache',
    common: {
      pageTitle: 'telc – Zertifikatsprüfung',
      pageHeaderTitle: 'Überprüfung des telc Zertifikats',
    },
    index: {
      introLabel: 'Zertifikatsprüfung',
      introParagraph:
        'Dieser Service übernimmt die automatische Suche nach Ihrem telc-Zertifikat. Wir prüfen mögliche Prüftermine regelmäßig und informieren Sie sofort, sobald ein Zertifikat gefunden wird.',
      formHeading: 'Anfrage starten',
      userNumberLabel: 'Teilnehmernummer',
      birthDateLabel: 'Geburtsdatum',
      examDateLabel: 'Prüfungsdatum',
      emailLabel: 'E-Mail-Adresse',
      submitButton: 'Prüfung starten',
    },
    subscribe: {
      introLabel: 'Fast geschafft',
      introParagraph:
        'Der nächste Schritt ist die E-Mail-Bestätigung. Öffnen Sie den Link in der Nachricht, damit wir mit der Prüfung beginnen können. Bitte sehen Sie auch im Spam-Ordner nach.',
    },
    confirm: {
      introLabel: 'E-Mail bestätigt',
      introParagraphs: [
        'Vielen Dank! Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Die automatische Überprüfung des Zertifikats ist gestartet.',
        'Sobald ein Zertifikat gefunden wird, senden wir Ihnen eine weitere E-Mail. Den aktuellen Stand sehen Sie jederzeit über Ihren persönlichen Status-Link.',
      ],
      statusButton: 'Status jetzt öffnen',
    },
    status: {
      badges: {
        active: 'Aktiv',
        found: 'Gefunden',
        completed: 'Abgeschlossen',
        unknown: 'Unbekannt',
      },
      messages: {
        active: 'Die Überprüfung des Zertifikats läuft.',
        found: 'Das Zertifikat wurde gefunden.',
        completed: 'Die Überprüfung ist abgeschlossen. Im Prüfzeitraum wurde kein Zertifikat gefunden.',
        unknown: 'Der aktuelle Status konnte nicht eindeutig bestimmt werden.',
      },
      participantNumberLabel: 'Teilnehmernummer',
      examDateLabel: 'Prüfungsdatum',
      certificateButton: 'Zertifikat öffnen',
      supportLabel: 'Service unterstützen',
      supportMessage: 'Unterstützen Sie das Projekt - spendieren Sie mir einen Kaffee.',
      supportButton: 'Spendieren',
    },
    progress: {
      heading: 'Aktueller Stand',
      step1: {
        todo: 'Anfrage senden',
        active: 'Anfrage senden',
        done: 'Anfrage gesendet',
      },
      step2: {
        todo: 'E-Mail-Adresse bestätigen',
        active: 'E-Mail-Adresse bestätigen',
        done: 'E-Mail-Adresse bestätigt',
      },
      step3: {
        todo: 'Automatische Prüfung',
        active: 'Automatische Prüfung läuft',
        done: 'Automatische Prüfung abgeschlossen',
      },
      step4: {
        todo: 'Ergebnis abrufen',
        active: 'Ergebnis abrufen',
        done: 'Ergebnis erhalten',
      },
    },
    hint: {
      label: 'Hinweis',
      backToHome: 'Zur Startseite',
    },
    contact: {
      ariaLabel: 'Kontakt',
      authorLine: '© Stanislav Shevchenko',
      emailTitle: 'E-Mail',
      emailAriaLabel: 'E-Mail',
      telegramTitle: 'Telegram',
      telegramAriaLabel: 'Telegram',
    },
    routes: {
      statusInvalidLink: 'Der Status-Link ist ungültig.',
      statusInvalidOrExpired: 'Der Status-Link ist ungültig oder abgelaufen.',
      statusLoadError: 'Beim Laden des Status ist ein Fehler aufgetreten.',
      confirmInvalidLink: 'Der Bestätigungslink ist ungültig.',
      confirmInvalidOrExpired: 'Der Bestätigungslink ist ungültig oder abgelaufen.',
      confirmProcessError: 'Beim Bestätigen Ihrer Anfrage ist ein Fehler aufgetreten.',
      subscribeProcessError:
        'Es gab ein Problem mit Ihrer Anfrage. Bitte versuchen Sie es später erneut.',
      pageNotFound: 'Die angeforderte Seite wurde nicht gefunden.',
      subscribeValidation: {
        userNumberRequired: 'Bitte geben Sie die Teilnehmernummer ein.',
        birthDateRequired: 'Bitte geben Sie Ihr Geburtsdatum ein.',
        examDateRequired: 'Bitte geben Sie das Prüfungsdatum ein.',
        emailRequired: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
      },
    },
    emails: {
      confirm: {
        subject: 'telc – Bitte E-Mail bestätigen',
        title: 'Bestätigung erforderlich',
        paragraph:
          'Bitte bestätigen Sie Ihre E-Mail-Adresse, damit wir mit der Überprüfung beginnen können.',
        cta: 'E-Mail bestätigen',
        footer: 'Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie bitte diese E-Mail.',
      },
      confirmedStatus: {
        subject: 'telc – E-Mail bestätigt, Status-Link',
        title: 'E-Mail erfolgreich bestätigt',
        paragraph: 'Ihre Anfrage ist aktiviert. Die Suche nach dem Zertifikat läuft automatisch im Hintergrund. Sobald ein Ergebnis vorliegt, erhalten Sie eine weitere E-Mail.',
        cta: 'Status Ihrer Anfrage öffnen',
        footer: 'Sie können den Status jederzeit über den Link oben prüfen.',
      },
      certificateFound: {
        subject: 'telc – Zertifikat gefunden',
        title: 'Zertifikat gefunden',
        paragraph: 'Gute Nachricht: Ihr Zertifikat wurde gefunden.',
        cta: 'Status Ihrer Anfrage öffnen',
        footer: 'Auf der Statusseite können Sie direkt zum Zertifikat wechseln.',
      },
    },
};

export default de;
