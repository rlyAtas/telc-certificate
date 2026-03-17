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
        subject: 'telc – Veuillez confirmer votre e-mail',
        title: 'Confirmation requise',
        paragraph: 'Veuillez confirmer votre adresse e-mail pour démarrer la vérification.',
        cta: "Confirmer l'e-mail",
        footer: "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.",
      },
      confirmedStatus: {
        subject: 'telc – E-mail confirmé, lien de statut',
        title: 'E-mail confirmé avec succès',
        paragraph: 'Votre demande est active. La recherche du certificat se poursuit automatiquement en arrière-plan. Dès qu’un résultat est disponible, vous recevrez un nouvel e-mail.',
        cta: 'Ouvrir le statut de votre demande',
        footer: 'Vous pouvez consulter le statut à tout moment via le lien ci-dessus.',
      },
      certificateFound: {
        subject: 'telc – Certificat trouvé',
        title: 'Certificat trouvé',
        paragraph: 'Bonne nouvelle : votre certificat a été trouvé.',
        cta: 'Ouvrir le statut de votre demande',
        footer: 'Depuis la page de statut, vous pouvez accéder directement au certificat.',
      },
    },
};

export default fr;
