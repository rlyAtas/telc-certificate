import type { UiDirection, UiLanguage } from './languages.js';

export type ProgressStateText = {
  todo: string;
  active: string;
  done: string;
};

export type UiMessagesContent = {
  languageLabel: string;
  common: {
    pageTitle: string;
    pageHeaderTitle: string;
  };
  index: {
    introLabel: string;
    introParagraph: string;
    formHeading: string;
    userNumberLabel: string;
    birthDateLabel: string;
    examDateLabel: string;
    emailLabel: string;
    submitButton: string;
  };
  subscribe: {
    introLabel: string;
    introParagraph: string;
  };
  confirm: {
    introLabel: string;
    introParagraphs: [string, string];
    statusButton: string;
  };
  status: {
    badges: {
      active: string;
      found: string;
      completed: string;
      unknown: string;
    };
    messages: {
      active: string;
      found: string;
      completed: string;
      unknown: string;
    };
    participantNumberLabel: string;
    examDateLabel: string;
    certificateButton: string;
    supportLabel: string;
    supportMessage: string;
    supportButton: string;
  };
  progress: {
    heading: string;
    step1: ProgressStateText;
    step2: ProgressStateText;
    step3: ProgressStateText;
    step4: ProgressStateText;
  };
  hint: {
    label: string;
    backToHome: string;
  };
  contact: {
    ariaLabel: string;
    authorLine: string;
    emailTitle: string;
    emailAriaLabel: string;
    telegramTitle: string;
    telegramAriaLabel: string;
  };
  routes: {
    statusInvalidLink: string;
    statusInvalidOrExpired: string;
    statusLoadError: string;
    confirmInvalidLink: string;
    confirmInvalidOrExpired: string;
    confirmProcessError: string;
    subscribeAlreadyExistsByEmail: string;
    subscribeProcessError: string;
    pageNotFound: string;
    subscribeValidation: {
      userNumberRequired: string;
      birthDateRequired: string;
      examDateRequired: string;
      emailRequired: string;
    };
  };
  emails: {
    confirm: {
      subject: string;
      title: string;
      paragraph: string;
      cta: string;
      footer: string;
    };
    confirmedStatus: {
      subject: string;
      title: string;
      paragraph: string;
      cta: string;
      footer: string;
    };
    certificateFound: {
      subject: string;
      title: string;
      paragraph: string;
      cta: string;
      footer: string;
    };
  };
};

export type UiMessages = {
  meta: {
    htmlLang: UiLanguage;
    dir: UiDirection;
  };
  language: {
    label: string;
    options: Record<UiLanguage, string>;
  };
} & Omit<UiMessagesContent, 'languageLabel'>;
