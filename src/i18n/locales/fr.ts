import type { UiMessagesContent } from '../types.js';

const fr: UiMessagesContent = {
    languageLabel: 'Langue',
    common: {
      pageTitle: 'telc – Vérification du certificat',
      pageHeaderTitle: 'Vérification du certificat telc',
    },
    index: {
      introLabel: 'Vérification du certificat',
      introParagraph:
        'Ce service lance automatiquement la recherche de votre certificat telc. Nous vérifions régulièrement les dates possibles et vous informons dès qu’un certificat est trouvé.',
      formHeading: 'Démarrer la demande',
      userNumberLabel: 'Numéro de participant',
      birthDateLabel: 'Date de naissance',
      examDateLabel: "Date de l'examen",
      emailLabel: 'Adresse e-mail',
      submitButton: 'Démarrer la vérification',
    },
    subscribe: {
      introLabel: 'Presque terminé',
      introParagraph:
        'La prochaine étape est la confirmation de votre e-mail. Ouvrez le lien dans le message pour lancer la vérification. Vérifiez également le dossier spam.',
    },
    confirm: {
      introLabel: 'E-mail confirmé',
      introParagraphs: [
        'Merci ! Votre adresse e-mail a été confirmée avec succès. La vérification automatique du certificat a commencé.',
        'Dès qu’un certificat est trouvé, nous vous enverrons un nouvel e-mail. Vous pouvez suivre le statut à tout moment via votre lien personnel.',
      ],
      statusButton: 'Ouvrir le statut',
    },
    status: {
      badges: {
        active: 'Actif',
        found: 'Trouvé',
        completed: 'Terminé',
        unknown: 'Inconnu',
      },
      messages: {
        active: 'La vérification du certificat est en cours.',
        found: 'Le certificat a été trouvé.',
        completed: 'La vérification est terminée. Aucun certificat trouvé pendant la période.',
        unknown: 'Le statut actuel n’a pas pu être déterminé clairement.',
      },
      participantNumberLabel: 'Numéro de participant',
      examDateLabel: "Date de l'examen",
      certificateButton: 'Ouvrir le certificat',
      supportLabel: 'Soutenir le service',
      supportMessage: 'Soutenez le projet - offrez-moi un café.',
      supportButton: 'Soutenir',
    },
    progress: {
      heading: 'Progression actuelle',
      step1: {
        todo: 'Envoyer la demande',
        active: 'Envoyer la demande',
        done: 'Demande envoyée',
      },
      step2: {
        todo: "Confirmer l'adresse e-mail",
        active: "Confirmer l'adresse e-mail",
        done: 'Adresse e-mail confirmée',
      },
      step3: {
        todo: 'Vérification automatique',
        active: 'Vérification automatique en cours',
        done: 'Vérification automatique terminée',
      },
      step4: {
        todo: 'Obtenir le résultat',
        active: 'Obtenir le résultat',
        done: 'Résultat reçu',
      },
    },
    hint: {
      label: 'Information',
      backToHome: "Retour à l'accueil",
    },
    contact: {
      ariaLabel: 'Contact',
      authorLine: '© Stanislav Shevchenko',
      emailTitle: 'E-mail',
      emailAriaLabel: 'E-mail',
      telegramTitle: 'Telegram',
      telegramAriaLabel: 'Telegram',
    },
    routes: {
      statusInvalidLink: 'Le lien de statut est invalide.',
      statusInvalidOrExpired: 'Le lien de statut est invalide ou expiré.',
      statusLoadError: 'Une erreur est survenue lors du chargement du statut.',
      confirmInvalidLink: 'Le lien de confirmation est invalide.',
      confirmInvalidOrExpired: 'Le lien de confirmation est invalide ou expiré.',
      confirmProcessError: 'Une erreur est survenue lors de la confirmation de votre demande.',
      subscribeAlreadyExistsByEmail:
        'Une demande active existe déjà pour cette adresse e-mail. Veuillez vérifier votre boîte de réception (y compris les spams) et utiliser le dernier lien reçu.',
      subscribeProcessError: 'Un problème est survenu avec votre demande. Veuillez réessayer plus tard.',
      pageNotFound: 'La page demandée est introuvable.',
      subscribeValidation: {
        userNumberRequired: 'Veuillez saisir le numéro de participant.',
        birthDateRequired: 'Veuillez saisir votre date de naissance.',
        examDateRequired: "Veuillez saisir la date de l'examen.",
        emailRequired: 'Veuillez saisir votre adresse e-mail.',
      },
    },
    emails: {
      confirm: {
        subject: 'telc - Veuillez confirmer votre e-mail',
        title: 'Veuillez confirmer votre e-mail',
        paragraphs: [
          'Confirmez votre adresse e-mail afin que nous puissions activer votre demande.',
        ],
        paragraph: 'Confirmez votre adresse e-mail afin que nous puissions activer votre demande.',
        cta: "Confirmer l'e-mail",
        note: "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.",
        footer: "Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.",
      },
      confirmedStatus: {
        subject: 'telc - Demande activée',
        title: 'Votre demande est active',
        paragraphs: [
          'Votre adresse e-mail a été confirmée.',
          'Nous vérifions désormais votre certificat automatiquement en arrière-plan.',
        ],
        paragraph: 'Votre adresse e-mail a été confirmée. Nous vérifions désormais votre certificat automatiquement en arrière-plan.',
        cta: 'Ouvrir le statut',
        note: 'Dès qu’un résultat sera disponible, vous recevrez un nouvel e-mail.',
        footer: 'Dès qu’un résultat sera disponible, vous recevrez un nouvel e-mail.',
        support: {
          label: 'Soutenir le projet',
          message: 'Si ce service vous aide, vous pouvez soutenir le projet en m’offrant un café.',
          button: 'Offrir un café',
        },
      },
      certificateFound: {
        subject: 'telc - Certificat trouvé',
        title: 'Votre certificat a été trouvé',
        paragraphs: [
          'Un résultat est maintenant disponible pour votre demande.',
          'Ouvrez la page de statut pour accéder au lien vers le certificat.',
        ],
        paragraph: 'Un résultat est maintenant disponible pour votre demande. Ouvrez la page de statut pour accéder au lien vers le certificat.',
        cta: 'Ouvrir le statut',
        note: 'La page de statut contient le lien direct vers le certificat.',
        footer: 'La page de statut contient le lien direct vers le certificat.',
        support: {
          label: 'Soutenir le projet',
          message: 'Si ce service vous a aidé, vous pouvez soutenir le projet en m’offrant un café.',
          button: 'Offrir un café',
        },
      },
    },
};

export default fr;
