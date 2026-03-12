import type { UiMessagesContent } from '../types.js';

const ar: UiMessagesContent = {
    languageLabel: 'اللغة',
    common: {
      pageTitle: 'telc - التحقق من الشهادة',
      pageHeaderTitle: 'التحقق من شهادة telc',
    },
    index: {
      introLabel: 'التحقق من الشهادة',
      introParagraph:
        'تقوم هذه الخدمة بالبحث تلقائيًا عن شهادة telc الخاصة بك: تتحقق من التواريخ المحتملة لمدة تصل إلى 35 يومًا وتبلغك فور العثور على الشهادة.',
      formHeading: 'بدء الطلب',
      userNumberLabel: 'رقم المشارك',
      birthDateLabel: 'تاريخ الميلاد',
      examDateLabel: 'تاريخ الامتحان',
      emailLabel: 'البريد الإلكتروني',
      submitButton: 'بدء التحقق',
    },
    subscribe: {
      introLabel: 'شارفنا على الانتهاء',
      introParagraph:
        'الخطوة التالية هي تأكيد البريد الإلكتروني. افتح الرابط في الرسالة لبدء التحقق. يُرجى أيضًا التحقق من مجلد الرسائل غير المرغوب فيها.',
    },
    confirm: {
      introLabel: 'تم تأكيد البريد الإلكتروني',
      introParagraphs: [
        'شكرًا لك! تم تأكيد بريدك الإلكتروني بنجاح. بدأ التحقق التلقائي من الشهادة.',
        'بمجرد العثور على الشهادة، سنرسل لك بريدًا آخر. يمكنك متابعة الحالة دائمًا عبر رابط الحالة الشخصي الخاص بك.',
      ],
      statusButton: 'فتح الحالة الآن',
    },
    status: {
      badges: {
        active: 'نشط',
        found: 'تم العثور',
        completed: 'مكتمل',
        unknown: 'غير معروف',
      },
      messages: {
        active: 'التحقق من الشهادة قيد التنفيذ.',
        found: 'تم العثور على الشهادة.',
        completed: 'اكتمل التحقق. لم يتم العثور على شهادة خلال فترة التحقق.',
        unknown: 'تعذر تحديد الحالة الحالية بشكل واضح.',
      },
      participantNumberLabel: 'رقم المشارك',
      examDateLabel: 'تاريخ الامتحان',
      certificateButton: 'فتح الشهادة',
      supportLabel: 'دعم الخدمة',
      supportMessage: 'ادعم المشروع - اشترِ لي قهوة.',
      supportButton: 'ادعم',
    },
    progress: {
      heading: 'الحالة الحالية',
      step1: {
        todo: 'إرسال الطلب',
        active: 'إرسال الطلب',
        done: 'تم إرسال الطلب',
      },
      step2: {
        todo: 'تأكيد البريد الإلكتروني',
        active: 'تأكيد البريد الإلكتروني',
        done: 'تم تأكيد البريد الإلكتروني',
      },
      step3: {
        todo: 'التحقق التلقائي',
        active: 'التحقق التلقائي قيد التنفيذ',
        done: 'اكتمل التحقق التلقائي',
      },
      step4: {
        todo: 'الحصول على النتيجة',
        active: 'الحصول على النتيجة',
        done: 'تم استلام النتيجة',
      },
    },
    hint: {
      label: 'ملاحظة',
      backToHome: 'العودة إلى الرئيسية',
    },
    contact: {
      ariaLabel: 'جهات الاتصال',
      authorLine: '© Stanislav Shevchenko',
      emailTitle: 'البريد الإلكتروني',
      emailAriaLabel: 'البريد الإلكتروني',
      telegramTitle: 'Telegram',
      telegramAriaLabel: 'Telegram',
    },
    routes: {
      statusInvalidLink: 'رابط الحالة غير صالح.',
      statusInvalidOrExpired: 'رابط الحالة غير صالح أو منتهي الصلاحية.',
      statusLoadError: 'حدث خطأ أثناء تحميل الحالة.',
      confirmInvalidLink: 'رابط التأكيد غير صالح.',
      confirmInvalidOrExpired: 'رابط التأكيد غير صالح أو منتهي الصلاحية.',
      confirmProcessError: 'حدث خطأ أثناء تأكيد طلبك.',
      subscribeProcessError: 'حدثت مشكلة في طلبك. يرجى المحاولة لاحقًا.',
      subscribeValidation: {
        userNumberRequired: 'يرجى إدخال رقم المشارك.',
        birthDateRequired: 'يرجى إدخال تاريخ الميلاد.',
        examDateRequired: 'يرجى إدخال تاريخ الامتحان.',
        emailRequired: 'يرجى إدخال البريد الإلكتروني.',
        languageRequired: 'يرجى اختيار اللغة.',
      },
    },
    emails: {
      confirm: {
        subject: 'telc - يرجى تأكيد البريد الإلكتروني',
        title: 'التأكيد مطلوب',
        paragraph: 'يرجى تأكيد بريدك الإلكتروني حتى نتمكن من بدء التحقق.',
        cta: 'تأكيد البريد الإلكتروني',
        footer: 'إذا لم تقدم هذا الطلب، يرجى تجاهل هذا البريد.',
      },
      confirmedStatus: {
        subject: 'telc - تم تأكيد البريد الإلكتروني، رابط الحالة',
        title: 'تم تأكيد البريد الإلكتروني بنجاح',
        paragraph: 'تم تفعيل طلبك. يتم البحث عن الشهادة كل 4 ساعات.',
        cta: 'فتح حالة طلبك',
        footer: 'يمكنك التحقق من الحالة في أي وقت عبر الرابط أعلاه.',
      },
      certificateFound: {
        subject: 'telc - تم العثور على الشهادة',
        title: 'تم العثور على الشهادة',
        paragraph: 'أخبار جيدة: تم العثور على شهادتك.',
        cta: 'فتح حالة طلبك',
        footer: 'في صفحة الحالة يمكنك الانتقال مباشرة إلى الشهادة.',
      },
    },
};

export default ar;
