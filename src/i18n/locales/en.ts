import type { UiMessagesContent } from '../types.js';

const en: UiMessagesContent = {
    languageLabel: 'Language',
    common: {
      pageTitle: 'telc – Certificate Check',
      pageHeaderTitle: 'telc Certificate Check',
    },
    index: {
      introLabel: 'Certificate Check',
      introParagraph:
        'This service automatically searches for your telc certificate: it checks possible exam check dates for up to 35 days and notifies you immediately when the certificate is found.',
      formHeading: 'Start Request',
      userNumberLabel: 'Participant number',
      birthDateLabel: 'Date of birth',
      examDateLabel: 'Exam date',
      emailLabel: 'Email address',
      submitButton: 'Start check',
    },
    subscribe: {
      introLabel: 'Almost done',
      introParagraph:
        'The next step is email confirmation. Open the link in the message so we can start the check. Please also check your spam folder.',
    },
    confirm: {
      introLabel: 'Email confirmed',
      introParagraphs: [
        'Thank you! Your email address has been confirmed. Automatic certificate checking has started.',
        'As soon as a certificate is found, we will send you another email. You can always track the current status via your personal status link.',
      ],
      statusButton: 'Open status now',
    },
    status: {
      badges: {
        active: 'Active',
        found: 'Found',
        completed: 'Completed',
        unknown: 'Unknown',
      },
      messages: {
        active: 'Certificate check is in progress.',
        found: 'The certificate has been found.',
        completed: 'The check is completed. No certificate was found within the check period.',
        unknown: 'The current status could not be determined clearly.',
      },
      participantNumberLabel: 'Participant number',
      examDateLabel: 'Exam date',
      certificateButton: 'Open certificate',
      supportLabel: 'Support the service',
      supportMessage: 'Support the project - buy me a coffee.',
      supportButton: 'Support',
    },
    progress: {
      heading: 'Current progress',
      step1: {
        todo: 'Send request',
        active: 'Send request',
        done: 'Request sent',
      },
      step2: {
        todo: 'Confirm email address',
        active: 'Confirm email address',
        done: 'Email address confirmed',
      },
      step3: {
        todo: 'Automatic check',
        active: 'Automatic check in progress',
        done: 'Automatic check completed',
      },
      step4: {
        todo: 'Get result',
        active: 'Get result',
        done: 'Result received',
      },
    },
    hint: {
      label: 'Notice',
      backToHome: 'Back to home',
    },
    contact: {
      ariaLabel: 'Contact',
      authorLine: '© Stanislav Shevchenko',
      emailTitle: 'Email',
      emailAriaLabel: 'Email',
      telegramTitle: 'Telegram',
      telegramAriaLabel: 'Telegram',
    },
    routes: {
      statusInvalidLink: 'The status link is invalid.',
      statusInvalidOrExpired: 'The status link is invalid or expired.',
      statusLoadError: 'An error occurred while loading the status.',
      confirmInvalidLink: 'The confirmation link is invalid.',
      confirmInvalidOrExpired: 'The confirmation link is invalid or expired.',
      confirmProcessError: 'An error occurred while confirming your request.',
      subscribeProcessError: 'There was a problem with your request. Please try again later.',
      pageNotFound: 'The requested page was not found.',
      subscribeValidation: {
        userNumberRequired: 'Please enter the participant number.',
        birthDateRequired: 'Please enter your date of birth.',
        examDateRequired: 'Please enter the exam date.',
        emailRequired: 'Please enter your email address.',
      },
    },
    emails: {
      confirm: {
        subject: 'telc – Please confirm your email',
        title: 'Confirmation required',
        paragraph: 'Please confirm your email address so we can start the verification.',
        cta: 'Confirm email',
        footer: 'If you did not submit this request, please ignore this email.',
      },
      confirmedStatus: {
        subject: 'telc – Email confirmed, status link',
        title: 'Email successfully confirmed',
        paragraph: 'Your request has been activated. The certificate search runs every 4 hours.',
        cta: 'Open your request status',
        footer: 'You can check the status at any time using the link above.',
      },
      certificateFound: {
        subject: 'telc – Certificate found',
        title: 'Certificate found',
        paragraph: 'Good news: your certificate has been found.',
        cta: 'Open your request status',
        footer: 'On the status page, you can directly proceed to the certificate.',
      },
    },
};

export default en;
