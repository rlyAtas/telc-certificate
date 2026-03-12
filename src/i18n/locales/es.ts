import type { UiMessagesContent } from '../types.js';

const es: UiMessagesContent = {
    languageLabel: 'Idioma',
    common: {
      pageTitle: 'telc – Verificación del certificado',
      pageHeaderTitle: 'Verificación del certificado telc',
    },
    index: {
      introLabel: 'Verificación del certificado',
      introParagraph:
        'Este servicio busca automáticamente su certificado telc: revisa posibles fechas durante 35 días y le avisa en cuanto se encuentre el certificado.',
      formHeading: 'Iniciar solicitud',
      userNumberLabel: 'Número de participante',
      birthDateLabel: 'Fecha de nacimiento',
      examDateLabel: 'Fecha del examen',
      emailLabel: 'Correo electrónico',
      submitButton: 'Iniciar verificación',
    },
    subscribe: {
      introLabel: 'Casi listo',
      introParagraph:
        'El siguiente paso es confirmar su correo electrónico. Abra el enlace del mensaje para iniciar la verificación. Revise también la carpeta de spam.',
    },
    confirm: {
      introLabel: 'Correo confirmado',
      introParagraphs: [
        '¡Gracias! Su dirección de correo electrónico ha sido confirmada. La verificación automática del certificado ha comenzado.',
        'En cuanto se encuentre un certificado, le enviaremos otro correo. Puede ver el estado en cualquier momento con su enlace personal.',
      ],
      statusButton: 'Abrir estado ahora',
    },
    status: {
      badges: {
        active: 'Activo',
        found: 'Encontrado',
        completed: 'Finalizado',
        unknown: 'Desconocido',
      },
      messages: {
        active: 'La verificación del certificado está en curso.',
        found: 'Se encontró el certificado.',
        completed: 'La verificación ha finalizado. No se encontró certificado en el periodo.',
        unknown: 'No se pudo determinar claramente el estado actual.',
      },
      participantNumberLabel: 'Número de participante',
      examDateLabel: 'Fecha del examen',
      certificateButton: 'Abrir certificado',
      supportLabel: 'Apoyar el servicio',
      supportMessage: 'Apoye el proyecto - invíteme a un café.',
      supportButton: 'Apoyar',
    },
    progress: {
      heading: 'Progreso actual',
      step1: {
        todo: 'Enviar solicitud',
        active: 'Enviar solicitud',
        done: 'Solicitud enviada',
      },
      step2: {
        todo: 'Confirmar correo electrónico',
        active: 'Confirmar correo electrónico',
        done: 'Correo confirmado',
      },
      step3: {
        todo: 'Verificación automática',
        active: 'Verificación automática en curso',
        done: 'Verificación automática completada',
      },
      step4: {
        todo: 'Obtener resultado',
        active: 'Obtener resultado',
        done: 'Resultado recibido',
      },
    },
    hint: {
      label: 'Aviso',
      backToHome: 'Volver al inicio',
    },
    contact: {
      ariaLabel: 'Contacto',
      authorLine: '© Stanislav Shevchenko',
      emailTitle: 'Correo electrónico',
      emailAriaLabel: 'Correo electrónico',
      telegramTitle: 'Telegram',
      telegramAriaLabel: 'Telegram',
    },
    routes: {
      statusInvalidLink: 'El enlace de estado no es válido.',
      statusInvalidOrExpired: 'El enlace de estado no es válido o ha caducado.',
      statusLoadError: 'Ocurrió un error al cargar el estado.',
      confirmInvalidLink: 'El enlace de confirmación no es válido.',
      confirmInvalidOrExpired: 'El enlace de confirmación no es válido o ha caducado.',
      confirmProcessError: 'Ocurrió un error al confirmar su solicitud.',
      subscribeProcessError: 'Hubo un problema con su solicitud. Inténtelo más tarde.',
      subscribeValidation: {
        userNumberRequired: 'Por favor, introduzca el número de participante.',
        birthDateRequired: 'Por favor, introduzca su fecha de nacimiento.',
        examDateRequired: 'Por favor, introduzca la fecha del examen.',
        emailRequired: 'Por favor, introduzca su correo electrónico.',
        languageRequired: 'Por favor, seleccione un idioma.',
      },
    },
    emails: {
      confirm: {
        subject: 'telc – Confirme su correo electrónico',
        title: 'Se requiere confirmación',
        paragraph: 'Confirme su correo electrónico para que podamos iniciar la verificación.',
        cta: 'Confirmar correo',
        footer: 'Si no realizó esta solicitud, ignore este correo.',
      },
      confirmedStatus: {
        subject: 'telc – Correo confirmado, enlace de estado',
        title: 'Correo confirmado correctamente',
        paragraph: 'Su solicitud está activada. La búsqueda del certificado se realiza cada 4 horas.',
        cta: 'Abrir estado de su solicitud',
        footer: 'Puede comprobar el estado en cualquier momento usando el enlace anterior.',
      },
      certificateFound: {
        subject: 'telc – Certificado encontrado',
        title: 'Certificado encontrado',
        paragraph: 'Buenas noticias: se encontró su certificado.',
        cta: 'Abrir estado de su solicitud',
        footer: 'En la página de estado podrá acceder directamente al certificado.',
      },
    },
};

export default es;
